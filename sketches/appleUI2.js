

function CUI(canvas,args){

	if(!args) args = {};

	this.c = document.getElementById(canvas);
	this.ctx = this.c.getContext("2d");
	this.vectors = args.vectors || [];
	this.ctrls = args.ctrls || [];
	this.ctrlAmount = args.ctrlAmount || 10;
	this.resX = args.resX || 150;
	this.resY = args.resY || 150;
	this.setVec = args.setVec || [];
	this.lerpColors = [];
	this.lineWidth = args.lineWidth || 1;

	this._drawLine = false;
	this._moveCtrl = -1;
	this.mouseOut = false;

	this.init();

	this.Utils = util;

	CUI.isDrawing = false;

	this.staticDrawing = function(){
		return CUI.isDrawing;
	}

};

var util = {

	dist:function(a,b){
		var X = Math.abs(a.x - b.x);
		var Y = Math.abs(a.y - b.y);
		return Math.sqrt((X*X)+(Y*Y));
	},

	lerp:function(a,b,t){
		return a + ((b-a)*t);
	},

};


CUI.prototype = {

	init:function(){
		this.setVectors();
		this.addEventListeners();
		this.drawVectors();
	},

	addEventListeners:function(){

		var that = this;

		this.c.addEventListener('mousedown', function (evt) {
			that._drawLine = true;
			CUI.isDrawing = true;
			that.mouseOut = false;
		}, false);

		this.c.addEventListener('mouseup', function (evt) {
			that._drawLine = false;
			CUI.isDrawing = false;
			that._moveCtrl = -1;
			// that.mouseOut = false;
			
		}, false);

		this.c.addEventListener ("mouseout", function (evt) {
			that._drawLine = false;
			CUI.isDrawing = false;
			that._moveCtrl = -1;
			that.mouseOut = true;
			mouserOut = true;
		},false);

		this.c.addEventListener('mousemove', function (evt) {

			var mousePos = that.getMousePos(evt);
			// that.mouseOut = false;

			if (that._drawLine) {
				for(var i = 0 ; i < that.ctrls.length ; i++){
					if(that._moveCtrl>-1)
						i=that._moveCtrl;
					if( that.Utils.dist(mousePos,that.ctrls[i])<10 || that._moveCtrl == i){
						that.ctrls[i].x = mousePos.x;
						that.ctrls[i].y = mousePos.y;
						that._moveCtrl = i;
						i=that.ctrls.length;
					}
					
				}

				
			}
		}, false);
	},

	pinEdges:function(){
		this.ctrls[0].x =0;
		this.ctrls[this.ctrls.length-1].x=0;
	},

	getMousePos:function(evt){
		var rect = this.c.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};		
	},

	setVectors:function() {

		var nums = this.setVec.length>0 ? this.setVec : [0,55,0,32,22,0,78,9,0,119,28,0,130,65,0,119,100,0,98,128,0,64,144,0,30,136,0,0,121,0];

		var q = -1;

		for (var i = 0; i < this.ctrlAmount; i++) {
			var vec = {};
			vec.x = nums[++q];//150 + ((1 + Math.cos((i / 9) * Math.PI * 2)) / 2) * -150; //Math.sin(i+cd);//*1+Math.sin(i*.032+(i/100)*pi*20)*.1;
			vec.y = nums[++q];//i * 75 / 5; //*1+Math.cos(i*.032+(i/100)*pi*20)*.1;
			vec.z = nums[++q];//0;
			this.ctrls.push(vec);
			this.vectors.push(vec);
		}
	},

	setCtrls:function(arr) {

		var q = -1;

		for (var i = 0; i < this.ctrls.length; i++) {
			// var vec = {};
			this.ctrls[i].x = arr[++q];//150 + ((1 + Math.cos((i / 9) * Math.PI * 2)) / 2) * -150; //Math.sin(i+cd);//*1+Math.sin(i*.032+(i/100)*pi*20)*.1;
			this.ctrls[i].y = arr[++q];//i * 75 / 5; //*1+Math.cos(i*.032+(i/100)*pi*20)*.1;
			this.ctrls[i].z = arr[++q];//0;
			// this.ctrls[i] = (vec);
		}
	},

	background:function(color){

		var col = color || "#558899";

		this.ctx.clearRect(0, 0, this.resX,this.resY);
		this.ctx.fillStyle = col;
		this.ctx.fillRect(0, 0, this.resX,this.resY);
	},

	drawVectors: function() {

		// this.ctx.clearRect(0, 0, 150, 150);
		// this.ctx.fillStyle = "#558899";
		// this.ctx.fillRect(0, 0, 150, 150);

		var vecs = [];

		for(var i = 0 ; i < this.ctrls.length ; i++){
			vecs.push(new THREE.Vector3(
				this.ctrls[i].x,
				this.ctrls[i].y,
				this.ctrls[i].z));
		}

		var spline = new THREE.SplineCurve3(vecs);
		var pnts = spline.getPoints(50);

		for(var i = 1 ; i < pnts.length ; i++){
			this.ctx.beginPath();
			this.ctx.strokeStyle = '#113355';
			this.ctx.lineWidth=this.lineWidth;
			this.ctx.lineCap="round";
			var vec = pnts[i-1];
			this.ctx.lineTo(vec.x, vec.y);
			var vec = pnts[i];
			this.ctx.lineTo(vec.x, vec.y);
			this.ctx.stroke();
		}

		// for (var i = 1; i < this.vectors.length; i++) {
		// 	this.ctx.beginPath();
		// 	var vec = this.vectors[i - 1];
		// 	this.ctx.lineTo(vec.x, vec.y);
		// 	var vec = this.vectors[i];
		// 	this.ctx.lineTo(vec.x, vec.y);
		// 	this.ctx.stroke();

		// }
		for(var i = 0 ; i < this.ctrls.length ; i++){
			this.ctx.beginPath();
			this.ctx.lineWidth=1;
			this.ctx.arc(this.ctrls[i].x, this.ctrls[i].y, 5, 0, 2 * Math.PI, false);
			this.ctx.fillStyle = "#ffffff";
			this.ctx.fill();
			this.ctx.stroke();
		}
	},

	paintColors:function(f,p){

		var id = this.ctx.createImageData(this.resX,this.resX); // only do this once per page
		var d  = id.data;                        // only do this once per page
		
		var dat = [];

		colors = [];


		var freq = f || .0003;
		var rand = f*12 || 1;
		var rand2 = f*22 || 1;
		phh = (p/100)*.99*Math.PI*2;


		for(var i = 0 ; i < this.resX ; i++){
			for(var j = 0 ; j < this.resY ; j++){
				// var r = .6+noise(rand+i*.0271,.5+j*.0231,i*.0191)*.5;//(1+Math.cos(i*Math.PI*2/150))/2;
				// var g = .6+noise(rand+i*.021,j*.021,i*.021)*.5;//*((1+Math.cos(Math.PI*2/3+(i*Math.PI*2)/150))/2);
				// var b = .6+noise(rand+i*.031,j*.031,i*.021)*.5;//(1+Math.cos((Math.PI*2/3)*2+(i*Math.PI*2)/150))/2;//(1+Math.cos(((Math.PI*2/3)*2)+(i*Math.PI*2)/150))/2;
				
				var oi1 = .5+noise((rand2*.999)+i*freq,10+j*freq,(rand2+20+j)*freq*rand2,freq*j)
				var oi2 = .5+noise(i*freq*(rand*.999),j*freq*rand,freq*j);//i+.6+noise(rand+j*freq,.5+j*freq,rand+i*freq)*60.5;
				var oi3 = .5+noise((-rand2+freq+20+i)*freq*rand2,(rand2+20+j)*freq*rand2,freq*j);//i+.6+noise(rand+j*freq,.5+j*freq,i*freq)*60.5;

				var r = ( 2+Math.sin (phh+oi1*Math.PI*1.65))/3;
				var g = ((2+Math.sin((phh+oi2*Math.PI*1.65)))/3);
				var b = (2+ Math.sin((phh+oi3*Math.PI*1.65)))/3;//(1+Math.cos(((Math.PI*2/3)*2)+(i*Math.PI*2)/150))/2;

				var v = 1;//((1+Math.cos((j/150)*Math.PI))/2);
				dat.push([r*v*255,g*v*255,b*v*255,255]);

			
			}
		}
		
		var q=0;
		for(var i = 0 ; i < d.length ; i++){
			d[i] = 	 dat[q][0];
			d[++i] = dat[q][1];
			d[++i] = dat[q][2];
			d[++i] = dat[q][3];
			q++;
		}

		d[0]   = .5;
		d[1]   = .5;
		d[2]   = .5;
		d[3]   = .5;
		// console.log(d);
		this.imageData = dat;
		this.ctx.putImageData( id, 0, 0 );
	},

	lerpColor:function(x,y){

		var a = x || this.ctrls[0];
		var b = y || this.ctrls[1];

		this.ctx.colors = [];
		this.lerpColors = [];

		if(!this.colorSteps)
			this.colorSteps = 10;

		for(var i = 0 ; i <= this.colorSteps ; i++){
			var col = [];
			col.push(Math.floor(this.Utils.lerp(a.x,b.x,i/this.colorSteps)));
			col.push(Math.floor(this.Utils.lerp(a.y,b.y,i/this.colorSteps)));
			this.ctx.colors.push(col);
		}

		for(var k = 0 ; k < this.ctx.colors.length ; k++){
			var i = Math.floor(this.ctx.colors[k][0])
			var j = Math.floor(this.ctx.colors[k][1])
			var xy = i+(j*150);
			if(typeof this.imageData[xy]!=='undefined')
				this.lerpColors.push(this.imageData[xy]);
		}

		// console.log(this.ctx.colors.length);
		// for(var i = 0 ; i < this.lerpColors.length ; i++){
		// 	console.log(this.lerpColors[i][0]);
		// }
	},

	update:function(){

		if(this._drawLine)
			console.log(this.ctrls);
	},

}


