import c_obj    from "../common/obj.js"   ;
import c_img    from "../common/img.js"   ;

const borders  = [];
const blues    = [];
const yellows  = [];
const digits   = [];

const obj = (blue, border) => new c_obj([ blue, border ]);
const img = n => new c_img("../volume/images/" + n + ".png");

const green  = img("green");

for (let i = 0; i < 9; ++i) {
    borders.push(img("a" + (i + 1)));
    blues.push(img("b" + (i + 1)));
    yellows.push(blues[i].clone_yellow());
    digits.push(0);
}

let save_draw  = null;
let save_click = null;

let v = get('volume', Math.pow(2, -5));
for (let i = 0; i < digits.length; ++i) {
	if (v >= .5) {
		digits[i] = 1;
		v -= .5;
	}
	v *= 2;
}

const set_vol_by_digits = _ => {
	let v = 0;
    if (digits.every(n => n === 1)) {
        v = 1;
    } else {
    	for (let i = 0; i < digits.length; ++i) {
    		if (digits[i] === 1) v += Math.pow(2, -(i + 1));
    	}
    }
	gain.gain.setTargetAtTime(v, audio.currentTime, .05);
	set('volume', v);
};

const speed  = 80;
let digits_i =  0;

const start = _=> {
	if (++digits_i === digits.length) {
		on_click = click_page;
	} else {
		setTimeout(start, speed);
	}
	on_resize();
};

const stop = _=> {
	if (--digits_i === 0) {
		on_click = save_click;
		on_resize = save_draw;
	} else {
		setTimeout(stop, speed);
	}
	on_resize();
};

const click_page = _ => {
	for (let i = 0; i < digits.length; ++i) {
		if (yellows[i].click() || borders[i].click()) {
			if (digits[i] === 0) {
				digits[i] = 1;
				set_vol_by_digits();
			} else {
				digits[i] = 0;
				set_vol_by_digits();
			}
			on_resize();
			return;
		}
	}
	on_click = null;
	stop();
};

const draw_page = _ => {
	save_draw();
	for (let i = 0; i < digits_i; ++i) {
        if (digits[i] === 0) draw(blues[i]);
        else draw(yellows[i]);
		draw(borders[i]);
    }
	if (digits_i === digits.length) {
		draw(green);
	}
};

const run = _ => {
    save_draw  = on_resize;
    save_click = on_click;
    on_resize  = draw_page;
    on_click   = null;
	start();
};

export default run;
