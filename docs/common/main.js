///////////////////////////////////////////////////////////////////////////////
//
// errors
//
///////////////////////////////////////////////////////////////////////////////

window.assert = function(condition, msg) {
	if (!condition) {
		if (msg === undefined) msg = "assertion failed";
		log(msg);
		throw new Error(msg);
	}
};

let error_caught = false;

window.addEventListener("error", e => {
    // report first error only
    if (error_caught) return;
	error_caught = true;
	let i = e.filename.indexOf("//") + 2;
	i += e.filename.substring(i).indexOf("/") + 1;
	const filename = e.filename.substring(i);
    document.body.innerHTML = `<h1>${e.error}<br>${filename}<br>Line ${e.lineno}</h1>`;
	setTimeout(_ => {
		document.body.addEventListener('click', e => {
			set('page', 'home'); 
			location.reload();
		});
	}, 0);
	if (audio !== null) audio.close();
});

window.addEventListener('unhandledrejection', e => {
    if (error_caught) return; 
	error_caught = true;
	if (typeof(e.reason.stack) !== 'undefined') {
	    document.body.innerHTML = `<h1>${e.reason}<br>${e.reason.message}<br>${e.reason.stack}</h1>`;
	} else {
	    document.body.innerHTML = `<h1>${e.reason}<br>${e.reason.message}</h1>`;
	}
	document.body.addEventListener('click', e => {
		set('page', 'home'); 
		location.reload();
	});
});

window.log = m => console.log(m);

/////////////////////////////////////////////////////////////////////////////////////////////////
//
// app_state
//
/////////////////////////////////////////////////////////////////////////////////////////////////

const app_name = "amby2";

let app_state = localStorage.getItem(app_name);
if (app_state === null) app_state = { version: "0", volume: 0.5 };
else app_state = JSON.parse(app_state);

window.set = (key, value) => {
	app_state[key] = value;
	localStorage.setItem(app_name, JSON.stringify(app_state));
};

window.get = (key, _default) => {
	if (app_state[key] === undefined) set(key, _default);
	return app_state[key];
};

window.run_page = page => {
	import(page).then(o => o.run());
};

///////////////////////////////////////////////////////////////////////////////////////////////
//
// audio
//
// This framework calls init_audio with every click on the canvas before all other 
// click handlers.
//
///////////////////////////////////////////////////////////////////////////////////////////////

window.audio       = null;
let main_gain      = null;
window.gain        = null;

window.init_audio = _ => {
	if (audio === null) {
		audio = new (window.AudioContext || window.webkitAudioContext)();
	}
	if (audio.state === "suspended") {
		audio.resume();
	}
	if (main_gain === null) {
		const compressor = audio.createDynamicsCompressor();
		compressor.threshold.setValueAtTime( -50, audio.currentTime);
		compressor.knee     .setValueAtTime(  40, audio.currentTime);
		compressor.ratio    .setValueAtTime(  12, audio.currentTime);
		compressor.attack   .setValueAtTime(   0, audio.currentTime);
		compressor.release  .setValueAtTime(0.25, audio.currentTime);
		compressor.connect(audio.destination);
		main_gain = audio.createGain();
		main_gain.gain.value = 1;
		main_gain.connect(compressor);
		gain = audio.createGain();
		gain.gain.value = get('volume', Math.pow(2, -5));
		gain.connect(main_gain);
	}
};

///////////////////////////////////////////////////////////////////////////////
//
// canvas
//
///////////////////////////////////////////////////////////////////////////////

window.ctx = canvas.getContext('2d');

const click_test_canvas = document.createElement('canvas');
const click_test_ctx    = click_test_canvas.getContext("2d", { willReadFrequently: true });

window.design_width  = 1000 ;
window.design_height = 1000 ;
let scale            = 1    ;
let left             = 0    ;
let top              = 0    ;

window.set_design_size = function(w, h) {
	design_width  = w;
	design_height = h;
	adjust_canvas();
};

// Convert mouse and touch event coords to design coords.
window.design_coords = e => {
	return {
		x: (e.pageX - left) / scale,
		y: (e.pageY - top ) / scale
	};
};

window.adjust_canvas = _ => {
    const sx          = window.innerWidth  / design_width ;
    const sy          = window.innerHeight / design_height;
    scale             = Math.min(sx, sy);
	canvas.width      = scale * design_width ;
	canvas.height     = scale * design_height;
	left              = (window.innerWidth  - canvas.width ) / 2;
	top               = (window.innerHeight - canvas.height) / 2;
	canvas.style.left = left;
	canvas.style.top  = top ;
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
	click_test_canvas.width  = design_width / 4; 
	click_test_canvas.height = design_height / 4;
    click_test_ctx.setTransform(1, 0, 0, 1, 0, 0);
};

window.on_resize = null; // should set when page starts

window.addEventListener('resize', _ => {
	adjust_canvas();
	if (on_resize !== null) on_resize();
});

adjust_canvas();

///////////////////////////////////////////////////////////////////////////////////
//
// color palette
//
///////////////////////////////////////////////////////////////////////////////////

window.colors = {
	green  : [  64, 216, 122 ],
	blue   : [  29, 225, 220 ],
	yellow : [ 242, 244,  44 ],	
	white  : [ 174, 201, 201 ],
	black  : [  72,  55,  55 ]
		
};

const rgb_blue   = `rgb(${colors.blue  [0]}, ${colors.blue  [1]}, ${colors.blue  [2]})`;
const rgb_yellow = `rgb(${colors.yellow[0]}, ${colors.yellow[1]}, ${colors.yellow[2]})`;
const rgb_green  = `rgb(${colors.green [0]}, ${colors.green [1]}, ${colors.green [2]})`;
const rgb_white  = `rgb(${colors.white [0]}, ${colors.white [1]}, ${colors.white [2]})`;
const rgb_black  = `rgb(${colors.black [0]}, ${colors.black [1]}, ${colors.black [2]})`;

function c_bg(rgb) {
	this.rgb = rgb;
}

c_bg.prototype.draw = function() {
	ctx.fillStyle = this.rgb;
	ctx.fillRect(0, 0, design_width, design_height);
};

c_bg.prototype.click = function() {
	return false;
};

window.bg_green = new c_bg(rgb_green);
window.bg_black = new c_bg(rgb_black);
window.bg_white = new c_bg(rgb_white);

///////////////////////////////////////////////////////////////////////////////
//
// miscellaneous 
//
///////////////////////////////////////////////////////////////////////////////

window.PHI = 1.61803398875;

window.clamp = (n, a, b) => Math.max(Math.min(n, Math.max(a, b)), Math.min(a, b));

// See http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
window.freq = (octave_steps, base_f, steps) => {
	return base_f * Math.pow(Math.pow(2, 1 / octave_steps), steps);
};

window.p   = (b, n, i) => Math.pow(Math.pow(b  , 1 / n), i);
window.phi = (n, i   ) => Math.pow(Math.pow(PHI, 1 / n), i);

window.draw = (o, x = 0, y = 0) => {
	if (o === null) return;
	if (Array.isArray(o)) {
		for (const i in o) {
			o[i].draw(x, y);
		}
	} else o.draw(x, y);
};

window.click = (o, x = 0, y = 0) => {
	if (o === null) return;
	if (Array.isArray(o)) {
		for (const i in o) {
			if (o[i].click(x, y)) return true;
		}
		return false;
	} else return o.click(x, y);
};

window.start = (o, x = 0, y = 0) => {
	if (o === null) return;
	if (Array.isArray(o)) {
		for (const i in o) o[i].start(x, y);
	} else o.start(x, y);
};

window.stop = (o, x = 0, y = 0) => {
	if (o === null) return;
	if (Array.isArray(o)) {
		for (const i in o) o[i].stop(x, y);
	} else o.stop(x, y);
};

///////////////////////////////////////////////////////////////////////////////
//
// click handling 
//
///////////////////////////////////////////////////////////////////////////////

window.on_click  = null;
window.click_x   = null;
window.click_y   = null;

canvas.addEventListener('click', e => {
	init_audio();
    click_x = (e.pageX - left) / scale;
	click_y = (e.pageY - top ) / scale;
	if (on_click !== null) on_click();
});

// pixel-based click detection
window.click_test = (images, x = 0, y = 0, s = 1) => {
	if (!Array.isArray(images)) images = [images];
	for (let i = 0; i < images.length; ++i) {
		if (!images[i].complete) return false;
	}
    click_test_ctx.clearRect(0, 0, click_test_canvas.width, click_test_canvas.height);
    const dx      = x            ;
    const dy      = y            ;
    const sx      = 0            ;
    const sy      = 0            ;
	for (let i = 0; i < images.length; ++i) {
		const image   = images[i]      ;
	    const sWidth  = image.width  ;
	    const sHeight = image.height ;
	    const dWidth  = sWidth * s   ;
	    const dHeight = sHeight * s  ;
		click_test_ctx.drawImage(image, sx, sy, sWidth, sHeight, dx/4, dy/4, dWidth/4, dHeight/4);		
	}
    const image_data = click_test_ctx.getImageData(0, 0, click_test_canvas.width, click_test_canvas.height);
    let int_x = Math.floor(click_x / 4);
    let int_y = Math.floor(click_y / 4);
    const i = Math.floor((image_data.width * int_y + int_x) * 4);
	return image_data.data[i] !== 0;
};
