import                    "../common/main.js" ;
import c_img         from "../common/img.js"  ;
import c_obj         from "../common/obj.js"  ;
import run_volume    from "../volume/page.js" ;
import music         from "./music.js"        ;

const obj = (images, x = 0, y = 0) => new c_obj(images, x, y);
const img = n => new c_img("./images/" + n + ".png");

const home   = obj([ img("home_b"  ), img("home"  ) ]);
const volume = obj([ img("volume_b"), img("volume") ]);

const green          = img("green" );
const ground         = img("ground");
const sky            = img("sky"   );

const sun_yellow     = obj([ img("sun_y")              , img("sun") ], 100);
const sun_white      = obj([ img("sun_y").clone_white(), img("sun") ], 100);

const beam_6         = img("beam_w");
const beam_2         = obj(beam_6, -460, 0);

const ship_blue      = obj([ img("ship_b")               , img("ship") ]);
const ship_yellow    = obj([ img("ship_b").clone_yellow(), img("ship") ]);
const ship_blue_0    = obj(ship_blue  , -690, 0);
const ship_blue_1    = obj(ship_blue  , -575, 0);
const ship_blue_2    = obj(ship_blue  , -460, 0);
const ship_blue_3    = obj(ship_blue  , -306, 0);
const ship_blue_5    = obj(ship_blue  , -153, 0);
const ship_yellow_2  = obj(ship_yellow, -460, 0);
const ship_yellow_3  = obj(ship_yellow, -306, 0);
const ship_yellow_5  = obj(ship_yellow, -153, 0);
const ship_yellow_6  = obj(ship_yellow,    0, 0);
const ship_blue_6    = obj(ship_blue  ,    0, 0);
const ship_blue_7    = obj(ship_blue  ,  115, 0);
const ship_blue_8    = obj(ship_blue  ,  230, 0);

const house          = obj([ img("house_b"), img("house"), img("door_r"), img("door") ]);
const window_yellow  = obj([ img("window_y"), img("window") ]);
const window_white   = obj([ img("window_y").clone_white(), img("window") ]);

const man            = obj([ img("man_y"), img("man") ]);
const man_0          = obj(man,    0,   0);
const man_1          = obj(man, -200,  40);
const man_2          = obj(man, -400,  70);

const scenes = [
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],

	[ sun_white , house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_2  ],	
	[ sun_white , house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_2  ],
	
	[ sun_white , house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],
	[ sun_white , house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],	
	[ sun_white , house, window_yellow, ship_blue_0           ],
	[ sun_white , house, window_white , ship_blue_1           ],
	[ sun_white , house, window_yellow, ship_blue_2           ],
	[ sun_white , house, window_white , ship_blue_2  , beam_2 ],
	
	[ sun_white , house, window_white , ship_yellow_2         ],
	[ sun_white , house, window_white , ship_yellow_3         ],
	[ sun_white , house, window_white , ship_yellow_5         ],
	[ sun_white , house, window_white , ship_yellow_6         ],
	[ sun_white , house, window_white , ship_yellow_6, beam_6 ],
	[ sun_white , house, window_white , ship_blue_6  , man_0  ],
	[ sun_white , house, window_white , ship_blue_7  , man_0  ],
	[ sun_white , house, window_white , ship_blue_8  , man_0  ],

	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_0  ],
	[ sun_white , house, window_white ,                man_0  ],

	[ sun_yellow, house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_0  ],
	[ sun_yellow, house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_2  ],	
	[ sun_yellow, house, window_white ,                man_1  ],
	[ sun_white , house, window_white ,                man_2  ],
	
	[ sun_yellow, house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],
	[ sun_yellow, house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],
	[ sun_yellow, house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],
	[ sun_yellow, house, window_yellow,                       ],
	[ sun_white , house, window_white ,                       ],

	[ sun_white , house, window_yellow, ship_blue_0           ],
	[ sun_white , house, window_white , ship_blue_1           ],
	[ sun_white , house, window_yellow, ship_blue_2           ],
	[ sun_white , house, window_white , ship_blue_3           ],
	[ sun_white , house, window_yellow, ship_blue_5           ],
	[ sun_white , house, window_white , ship_blue_6           ],
	[ sun_white , house, window_white , ship_blue_7,   man_2  ],
	[ sun_white , house, window_white , ship_blue_8,   man_1  ],

];

let id = null;
let i  = 0;

const loop = _ => {
	if (++i === scenes.length) {
		i = 0;
		music();
		music();
	}
	if (on_resize === draw_page) on_resize();
	id = setTimeout(loop, 1000);
};

const cover = [
	obj([ img("cover_b_0"), img("cover_0") ]),
	obj([ img("cover_b_1"), img("cover_1") ]),
	obj([ img("cover_b_2"), img("cover_2") ]),
	obj([ img("cover_b_3"), img("cover_3") ])
];

let cover_i = 0;

const start = _ => {
	if (++cover_i === cover.length) {
	    on_click  = click_page;
		music();
		id = setTimeout(loop, 1000);
	} else {
	    on_click  = null;
		setTimeout(start, 80);
	}
    on_resize();
};

const stop = _ => {
	if (--cover_i === 0) {
	    on_click = click_page;
		music();
		clearTimeout(id);
		id = null;
		i  = 0;
	} else {
	    on_click = null;
		setTimeout(stop, 80);
	}
    on_resize();
};

const click_page = _ => {
	if (click(home  )) return location = "../";
	if (click(volume)) return run_volume();
	if (cover_i === cover.length) {
		on_click = null;
		stop();
	}  else {
		if (click(cover[0])) {
			on_click = null;
			start();
		}
	}
	on_resize();
};

const draw_page = _ => {
	draw(bg_green);
	draw(green);
	draw(sky);
	draw(ground);
	draw(scenes[i]);
	if (cover_i !== cover.length) {
		draw(cover[cover_i]);
	}
	if (cover_i === 0) {
	    draw(home);
	    draw(volume);
	}
};

on_resize = draw_page;
on_click  = click_page;
on_resize();
