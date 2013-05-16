/******************************************************************************
 *							can.js
 *
 * Manipulate images as arrays of pixel data. Render with the canvas. 
 *         Accessability and abstraction before performance.
 *
 *				Copyleft 2013 by Matthew McWilliams
*******************************************************************************/

if (can === undefined) {var can = {};}

//-----------------------------------------------------------------------------
//					     VARIABLES
//-----------------------------------------------------------------------------
can.keys = ['r', 'g', 'b', 'a'];
can.tmp = [];
can.state = {};


//-----------------------------------------------------------------------------
//							CORE
//-----------------------------------------------------------------------------
/******************************************************************************
 * can.get
 * Retrieves image data from an element. Can be video or img. 
 * 
 * @param: id		{String}	Element id img, video, canvas
 * @param: type		{String}	(opt) Pixel element type:
 *									rgba {default} object {r: 255, g: 255...}
 *									rgb  obj omitting alpha value
 *									flat  array [255, 255, 255, 255]
 *									flatrgb array [255, 255, 255]
*******************************************************************************/

can.get = function (id, type) {
	'use strict';
	if (type === undefined || type === null ) {
		type = 'rgba';
	}
	var img = document.getElementById(id),
		w = img.width,
		h = img.height,
		canvas = document.createElement('canvas');
		console.dir(img);
	//Temporary jQuery for Video
	if (img.tagName.toLowerCase() === 'video') {
		w = $('#' + id).width();
		h = $('#' + id).height();
	}
	console.log(w + ', ' + h);
	canvas.width = w;
	canvas.height = h;

	var canvasCtx = canvas.getContext('2d');
	canvasCtx.drawImage(img, 0, 0, w, h);

	var imgObj = canvasCtx.getImageData(0, 0, w, h),
	 	dataArr = [],
    	data = imgObj.data,
    	typeRgba = function (r, g, b, a) {
			return {
		        'r' : r, 
		        'g' : g, 
		        'b' : b, 
		        'a' : a // 255
	      	};
		},
		typeRgb = function (r, g, b) {
			return {
		        'r' : r, 
		        'g' : g, 
		        'b' : b,
	      	};
		},
		typeFlat = function (r, g, b, a) {
			return [r, g, b, a];
		},
		typeFlatRgb = function (r, g, b) {
			return [r, g, b];
		};

	for (var y = 0; y < h; ++y) {
		dataArr[y] = [];
		for (var x = 0; x < w; ++x) {
			var i = (y * w + x) * 4;
			if (type === 'rgba') {
				dataArr[y][x] = typeRgba(data[i], data[i+1], data[i+2], data[i+3]);
			} else if (type === 'rgba') {
				dataArr[y][x] = typeRgb(data[i], data[i+1], data[i+2]);
			} else if (type === 'flat') {
				dataArr[y][x] = typeFlat(data[i], data[i+1], data[i+2], data[i+3]);
			} else if (type === 'flatrgb') {
				dataArr[y][x] = typeRgb(data[i], data[i+1], data[i+2]);
			}
		}
	}
	return dataArr;
};

/******************************************************************************
 * can.set
 * Sets image data to canvas element
 *
 * @param: id 		{String}	id of canvas to set image data to
 * @param: data 	{Array}		image array --- absimg
*******************************************************************************/

can.set = function (id, data) {
	'use strict';
	var h = data.length,
		w = data[0].length,
      	out = document.getElementById(id); 

      	out.width = w;
      	out.height = h;

  	var ctx = out.getContext('2d'),
    	newArr = ctx.createImageData(w, h),
    	typeCheck = function (px, z) {
    		//console.log(px);
			if (px.r !== undefined) {
				if (px.a === undefined) {
					if (z !== 3) {
						return px[can.keys[z]];
					} else {
						return 255;
					}
				} else {
					return px[can.keys[z]];
				}
			} else {
				if(px.length === 3) {
					if (z !== 3) {
						return px[z];
					} else {
						return 255;
					}
				} else if (px.length === 4) {
					return px[z];
				}
			}
		};
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) { //assumes rectangle
			var i = (y * w + x) * 4;
			newArr.data[i+0] = typeCheck(data[y][x], 0);
			newArr.data[i+1] = typeCheck(data[y][x], 1);
			newArr.data[i+2] = typeCheck(data[y][x], 2);
			newArr.data[i+3] = typeCheck(data[y][x], 3);
		}
	}
	ctx.putImageData(newArr, 0, 0);
};

//jquery dependent for now
/******************************************************************************
 * can.newCanvas
 * Creates canvas element and appends to DOM
 *
 * @param: container 	{Object}	$ element to append new canvas to
 * @param: id 			{String}	id of canvas to create
 * @param: data 		{Array}		(opt) image array --- absimg
*******************************************************************************/
can.newCanvas = function (container, id, data, w, h) {
	var style = '';
	if (w !== undefined) { style += 'width:' + w + 'px;';}
	if (w !== undefined) { style += 'height:' + h + 'px;';}
	str = '<canvas id="' + id +'" syle="' + style +'"></canvas>';
	container.append(str);
};
can.newI = function (container, id, w, h) {};
can.newV = function (container, id, w, h) {};

/******************************************************************************
 * can.px
 * Retrieves pixel data
 *
 * @param: data 	{Array}		image array --- absimg
 * @param: x		{Integer} 	x from left
 * @param: y		{Integer}	y from top
 * @param: w 		{Integer}	(opt) width of array
 * @param: h 		{Integer} 	(opt) height of array
*******************************************************************************/

can.px = function (data, x, y, w, h) {
	'use strict';
	if (w !== undefined || h !== undefined) {
		var newArr = [],
			newX = 0,
			newY = 0;
		if (w === undefined) { w = 1; }
		if (h === undefined) { h = 1; }

		for (var a = y; a < y + h; a++) {
			newArr[newY] = [];
			for (var b = x; b < x + w; b++) {
				newArr[newY][newX] = data[a][b];
				newX += 1;
			}
			newY += 1;
		}
		return newArr;
	} else {
		return data[y][x];
	}
};

/******************************************************************************
 * can.all
 * Performs action on all pixels
 *
 * @param: data 	{Array}		image array
 * @param: act 		{Function}	action to perform on all pixels	
 * @param: x		{Integer} 	x from left
 * @param: y		{Integer}	y from top
 * @param: w 		{Integer}	(opt) width of array
 * @param: h 		{Integer} 	(opt) height of array
*******************************************************************************/

can.all = function (data, act, complete, x, y, w, h) {
	'use strict';
	if (x === undefined || x === null) { x = 0; }
	if (y === undefined || y === null) { y = 0; }
	if (w === undefined || w === null) { w = data[0].length; }
	if (h === undefined || h === null) { h = data.length; }
	for (var a = y; a < y + h; a++) {
		for (var b = x; b < x + w; b++) {
			act(data[a][b], b, a);
		}
	}
	if (complete !== undefined) { complete(); }
};

//
//
//
//


/******************************************************************************
 * can.localFile
 * Takes local image or video and attaches it to the tag id'd in the function
 *
 * @param: input	{String} 	input from input[type=file]
 * @param: id		{String}	id of element to attach local file
 * @param: callback	{Function}	runs after image/video loads
*******************************************************************************/

can.localFile = function (input, id, callback) {
	var targetElem = document.getElementById(id);
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			targetElem.onload = function () {
				if (callback) { callback(id); }
			};
			targetElem.setAttribute('src', e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	} else {
		targetElem.setAttribute('src', e.target.result);
	}
};

//
//
//
//

can.hist = function (data) {
	'use strict';
	can.tmp = [];
	for (var i = 0; i < 255; i++) { can.tmp[i] = 0; }
	var getAvg = function (px) {
		var avg = 0;
		if (px.r !== undefined) {
			avg = Math.floor((px.r + px.g + px.b) / 3);
		} else {
			avg = Math.floor((px[0] + px[1] + px[2]) / 3);
		}
		can.tmp[avg] += 1;
	},
	success = function () {
		console.dir(can.tmp);
		can.tmp = [];
	}
	can.all(data, getAvg, success);
};

can.histDisplay = function (id, hist, w, h) {
	'use strict';
	if (w === undefined || w === null) { w = 255; }
	if (h === undefined || h === null) { h = 125; }
	var max = 0;
	for (var i = 0; i < hist.length; i++) {
		if (hist[i] > max) {
			max = hist[i];
		}
	}
	var correct = [];
	for (var i = 0; i < hist.length; i++) {
		correct[i] = Math.round((hist[i] / max ) * h);
	}
	var histogram = document.getElementById(id); //is a canvas
	//fuck that
	for (var i = 0; i < correct.length; i++) {
		$('#' + id).append('<span style="background: #000; width: ' + Math.round(w / 255) +'px; height: ' +  + '"></span>');
	}
	
};

can.avgColor = function (data, callback) {
	'use strict';
	can.state = {
		total : {r : 0, g : 0, b : 0, a: 0},
		count : 0
	};
	var avgColor = function (px) {
		if (px.r !== undefined) {
			can.state.total.r += px.r;
			can.state.total.g += px.g;
			can.state.total.b += px.b;
			if (px.a !== undefined) {
				can.state.total.a += px.a;
			} else {
				can.state.total.a += 255;
			}
		} else {
			can.state.total.r += px[0];
			can.state.total.g += px[1];
			can.state.total.b += px[2];
			if (px[3] !== undefined) {
				can.state.total.a += px[3];
			} else {
				can.state.total.a += 255;
			}
		}
		can.state.count += 1;
	},
	success = function () {
		var result = {
			r: Math.round(can.state.total.r / can.state.count), //round for now
			g: Math.round(can.state.total.g / can.state.count),
			b: Math.round(can.state.total.b / can.state.count),
			a: can.state.total.a / can.state.count
		};
		can.state = {};
		if (callback !== undefined) { callback(result); }
	};
	can.all(data, avgColor, success);
};

//-----------------------------------------------------------------------------
//							UTILS
//-----------------------------------------------------------------------------

/******************************************************************************
 * can.find
 * finds and isolates colors within a range. uses can.all
 *
 * @param: id 		{String}	canvas element to write to
 * @param: data 	{Array}		data array
 * @param: center 	{pixel}		obj or array to check against
 * @param: fuzz		{Integer}	allowable deviation on any value
*******************************************************************************/

can.find = function (id, data, center, fuzz) {
	'use strict';
	can.tmp = [];
	can.state = {
		center : center,
		fuzz : fuzz
	}
	var find = function (px, x, y) {
		if (can.tmp[y] === undefined) { can.tmp[y] = []; }
		var c = can.state.center,
			f = can.state.fuzz;
		if (px.r <= c.r+f && px.r >= c.r-f 
		 && px.g <= c.g+f && px.g >= c.g-f 
		 && px.b <= c.b+f && px.b >= c.b-f) {
			can.tmp[y][x] = px;
		} else {
			can.tmp[y][x] = {r : 0, g : 0, b : 0, a : 0};
		}
	},
	complete = function () {
		console.dir(can.tmp);
		can.set(id, can.tmp);
		can.tmp = [];
		can.state = {};
	};
	can.all(data, find, complete, 0, 0);
};

/******************************************************************************
 * can.avg
 * Averages image data and writes to canvas. uses can.all
 *
 * @param: id 		{String}	canvas element to write to
 * @param: data 	{Array}		data array
*******************************************************************************/

can.avg = function (id, data) {
	'use strict';
	can.tmp = [];
	can.tmp.length = data.length;
	var avg = function (px, x, y) {
		if (can.tmp[y] === undefined) { can.tmp[y] = []; }
		var val = Math.round((px.r + px.g + px.b) / 3);
		can.tmp[y][x] = {
			'r' : val,
			'g' : val,
			'b' : val,
			'a' : 255
		};
	},
	complete = function () {
		can.set(id, can.tmp);
		can.tmp = [];
	};
	can.all(data, avg, complete, 0, 0);
};

/******************************************************************************
 * can.avgReal
 * Averages image data and writes to canvas. uses can.all and an algorithm
 * by a very angry man from the internet
 *
 * Y = (0.299 * R) + (0.587 * G) + (0.114 * B)
 *
 * @param: id 		{String}	canvas element to write to
 * @param: data 	{Array}		data array
*******************************************************************************/

can.avgReal = function (id, data) {
	can.tmp = [];
	can.tmp.length = data.length;
	var avg = function (px, x, y) {
		if (can.tmp[y] === undefined) { can.tmp[y] = []; }
		var val = Math.round((0.299 * px.r) + (0.587 * px.g) + (0.114 * px.b));
		can.tmp[y][x] = {
			'r' : val,
			'g' : val,
			'b' : val,
			'a' : 255
		};
	},
	complete = function () {
		can.set(id, can.tmp);
		can.tmp = [];
	};
	can.all(data, avg, complete, 0, 0);
};

/******************************************************************************
 * can.threshAvg
 * Performs action on all pixels
 *
 * @param: data 	{Array}		image array
 * @param: action	{Function}	action to perform on all pixels	
 * @param: x		{Integer} 	x from left
 * @param: y		{Integer}	y from top
 * @param: w 		{Integer}	(opt) width of array
 * @param: h 		{Integer} 	(opt) height of array
*******************************************************************************/

can.threshAvg = function (data, upper, lower, replace, x, y, w, h) {
	'use strict';
	var thresh = function (px, x, y) {
		var avg = avg(px);
		if (typeof(upper) === number) {
			if (avg > upper) {
				px = replace;
			}
		}
		if (typeof(lower) === number) {
			if (avg < lower) {
				px = replace;
			}
		}
		data[y][x] = px;
	},
	avg = function (px) {
		var avg = 0;
		for (var i = 0; i < px.length; i++) {
			if (px.r !== undefined) { // is object or array
				avg += px[can.keys[i]];
			}
		}
		avg = avg / px.length;
		return avg;
	};
	console.dir(data);
};

//-----------------------------------------------------------------------------
//							BLENDING MODES
//-----------------------------------------------------------------------------

/******************************************************************************
 * can.blend
 * Performs action on all pixels
 *
 * @param: A 		{Array} 		active layer image array
 * @param: B  		{Array} 		base layer image array
 * @param: act 		{String}		action to perform on all pixels
 * @param: complete {Function} 		callback for completion
*******************************************************************************/

can.blend = function (A, B, act, complete) {
	'use strict';
	var x = 0,
		y = 0,
		w = A[0].length,
		h = B.length
	if (B[0].length !== w) {
		//kill temporarily
		console.log('image size mismatch');
		return false;
	}
	var mode = {};
	mode['add'];
	mode['subtract'];
	mode['multiply'];

	for (var a = y; a < y + h; a++) {
		for (var b = x; b < x + w; b++) {
			act(A[a][b], B[a][b], b, a);
		}
	}
	if (complete !== undefined) { complete(); }
};

/******************************************************************************
 * can.add
 * Addative blending, returns new image data
 *
 * @param: A 	{Array} 	active layer image array
 * @param: B 	{Array}		base layer image array
*******************************************************************************/

can.add = function (A, B) {
	'use strict';
	var add = function (active, base, x, y) {

	},
	success = function () {

	};
};

can.toImg = function () {

};

can.video = {};

//go to frame
can.video.frame = function (id, frame, rate) {
	if (rate === undefined) {
		rate = 29.97;
	}
	var v = document.getElementById(id);
	v.currentTime = frame / rate;
};

if (module === undefined) {var module = {};}
//FOR NODE
module.exports = can;