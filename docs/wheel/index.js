import                    "../common/main.js" ;
import c_img         from "../common/img.js"  ;
import c_obj         from "../common/obj.js"  ;
import run_volume    from "../volume/page.js" ;
import music         from "./music.js"        ;

const obj = (blue, border) => new c_obj([ blue, border ]);
const img = n => new c_img("./images/" + n + ".png");

const home   = obj(img("home_b"  ), img("home"  ));
const volume = obj(img("volume_b"), img("volume"));
const photo  = img("photo");

const cover = [
	obj(img("cover_b_0"), img("cover_0")),
	obj(img("cover_b_1"), img("cover_1")),
	obj(img("cover_b_2"), img("cover_2")),
	obj(img("cover_b_3"), img("cover_3")),
];

const speed = 80;
let cover_i = 3 ;

const draw_cover = _ => {
    if (cover_i !== -1) draw(cover[cover_i]);
};

const start = _ => {
	if (--cover_i === -1) {
		on_click = click_page;
		music();
	} else {
		setTimeout(start, speed);
	}
	on_resize();
};

const stop = _ => {
	if (++cover_i === cover.length - 1) {
		on_click = click_page;
		music();
	} else {
		setTimeout(stop, speed);
	}
	on_resize();
};

const click_page = _ => {
    if (click(home  )) return location = "../";
    if (click(volume)) return run_volume();
	if (click(cover[3])) {
		on_click = null;
		if (cover_i === -1) {
			stop();
		} else {
			start();
		}
	}
};

const draw_page = _ => {
	draw(bg_green);
	draw(photo);
    if (cover_i !== -1) draw(cover[cover_i]);
	draw(home);
	draw(volume);
};

on_resize = draw_page;
on_click  = click_page;
on_resize();