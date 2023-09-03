import                    "../common/main.js" ;
import c_img         from "../common/img.js"  ;
import c_obj         from "../common/obj.js"  ;
import run_volume    from "../volume/page.js" ;
import music         from "./music.js"        ;

const obj = (blue, border) => new c_obj([ blue, border ]);
const img = n => new c_img("./images/" + n + ".png");

const back   = obj(img("back_b"  ), img("back"  ));
const volume = obj(img("volume_b"), img("volume"));

const blue   = [];
const yellow = [];

for (let i = 0; i < 4; ++i) {
	blue  [i] = obj(img("b" + i)               , img("a" + i));
	yellow[i] = obj(img("b" + i).clone_yellow(), img("a" + i));
}

const start_anim = [
	[ yellow[3], blue[2] ],
	[ yellow[3], blue[1] ],
	[ yellow[3], blue[0] ],
	yellow[3]
];

const stop_anim = [
	[ yellow[3], blue[0] ],
	[ yellow[3], blue[1] ],
	[ yellow[3], blue[2] ],
	blue[3]
];

const speed = 80;
let playing  = false;
let anim_i   = 3    ;

const draw_block = _ => {
	if (playing) draw(start_anim[anim_i]);
	else draw(stop_anim[anim_i]);
};

const start = _ => {
	if (++anim_i === start_anim.length - 1) {
		on_click = click_page;
		music();
	} else {
		setTimeout(start, speed);
	}
	on_resize();
};

const stop = _ => {
	if (++anim_i === stop_anim.length - 1) {
		on_click = click_page;
		music();
	} else {
		setTimeout(stop, speed);
	}
	on_resize();
};

const click_page = _ => {
    if (click(back  )) return location = "../";
    if (click(volume)) return run_volume();
	if (click(blue[3])) {
		on_click = null;
		anim_i = 0;
		playing = !playing;
		if (playing) {
			setTimeout(start, speed);
		} else {
			setTimeout(stop, speed);
		}
		on_resize();
	}
};

const draw_page = _ => {
	draw(bg_green);
    draw(back);
    draw(volume);
	draw_block();
};

on_resize = draw_page;
on_click  = click_page;
on_resize();
