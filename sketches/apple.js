

sc1 = {

	setup: function () {

		drawLathe = true;
		isSymmetrical = true;
		drawStem = false;
		drawLeaf = false;
		updateCanvas = false;

		outputScale = 4;

		shaders = [];
		colors = [];
		canvases = [];

		frameRate = 1;
		highres = true;	
		setupDone = true;

		undo = [];

		setupSliders();
		

		R = new rainbow();
		scene.add(R.tubeParent);
		spp = sphere(10);
		spp.material = cShader();
		// scene.add(spp);


 },

	draw: function (time) {

		cShaders.forEach(function(s){
			s.uniforms["camMat"].value = camera.matrixWorld;
		})
		if(typeof spp!=='undefined')
			spp.rotation.y+=.1;
		lightGroup.lookAt(camera.position);
		checkAndUpdateSliders();
		if(undo.length>50)
			undo.shift();
		if(varZ){
			if(undo.length>0)
				readData(JSON.parse(undo.pop()));
			varZ=false
		}
		// bumpMat.uniforms['camPos'].value = camera.position;
		
	}
};

function checkAndUpdateSliders(){

	var sliderMoveFromAnim = sliderMove;//animater();

		for(var i = 0 ; i < shaders.length ; i++){
			shaders[i].uniforms["camPos"].value = controls.object.position;
		}

		if(typeof pValue == 'undefined')
			pValue = [0];

		
		sliderMove = false;

		R.steps = Math.round(7+(sliderData[2]/3));
		steps = R.steps;

		if(typeof pSliderDatas == 'undefined')
			pSliderDatas = [];

		sliderData = checkSlider();

		if(pSliderDatas.length==0)
			pSliderDatas.push(sliderData);

		sliderDataIsChanged = compareObj(pSliderData,pSliderDatas[0]);

		if(mouseLeft){
			if(undo.length===0)
				undo.push(writeData());
			else if(!compareObj(writeData(),undo[undo.length-1]))
				undo.push(writeData());
		}


		if(typeof canvases!=='undefined'){

			if(typeof colorCanvas !== 'undefined')
				colorCanvas.update();

			if( canvases[0]._drawLine || canvases[1]._drawLine || pSliderData[2]!=sliderData[2] ||  !R.loopFinished || R.curveDetail<100){
				
					R.setCurves(canvases);
					R.tubesRotation[0] = ((sliderData[1]-50)/50) * Math.PI;
					R.tubesRotation[1] = ((sliderData[0]-50)/50) * Math.PI;

					if(R.curveDetail<100){
						R.steps=10;
					}
					else
						updateCanvas=true;
					if(R.tubeStep>R.steps)
						R.tubeStep=0;
					
					if(canvases[0]._drawLine || canvases[1]._drawLine || pSliderData[2]!=sliderData[2] ){
						if(R.tubeStep<R.steps-2)
							R.curveDetail = 10;
						else
							R.curveDetail = 30;
					}
					else if(R.curveDetail<100){
						R.tubeStep=0;
						R.curveDetail = 100;
					}

					if(R.loopFinished){
						highres = true;
						if(undo.length===0)
							undo.push(writeData());
						else if(!compareObj(writeData(),undo[undo.length-1]))
							undo.push(writeData());
					}
					

					if(pSliderData[2]!=sliderData[2]){

						R.tubeStep = 0;
						while(!R.loopFinished){
							R.update(true);
						}
					}
					R.update(true);
					
					R.makeLathe(1);

					if(drawStem)
						R.makeStem();

			}
			else if( pSliderData[0]!=sliderData[0] || pSliderData[1]!=sliderData[1] || pSliderData[6]!=sliderData[6]){

				R.tubesRotation[0] = ((sliderData[1]-50)/50) * Math.PI;
				R.tubesRotation[1] = ((sliderData[0]-50)/50) * Math.PI;
				
				if(pSliderData[0]!=sliderData[0]){
					R.curveDetail = 10;
					R.makeLathe();
				}
				// else
				R.curveDetail = 100;
				R.leaf.rotation.y = (R.rAmount/5)+((sliderVal(leafRotation)/100)*Math.PI*2);
				R.rotateTube();
				highres = true;
					
			}
			else if(canvases[0].staticDrawing() || sliderMoveFromAnim || pSliderData[3]!=sliderData[3]){
				// highres=false;
				R.colorTube();
				R.colorSpine();
				// undo.push(writeData());
			}
			else if(highres && mouseLeft){

				R.loopFinished = false;
				R.curveDetail=100;
				
				highres = true;
				R.lathe = makeHighRes(R);
				R.loopFinished = true;
			
				R.highres = false;
				mouseLeft = false;
				if(undo.length===0)
					undo.push(writeData());
				else if(!compareObj(writeData(),undo[undo.length-1]))
					undo.push(writeData());
			}
			if(pSliderData[4]!=sliderData[4]){
				if(drawStem)
					R.makeStem();
			}
			if(R.leaf!==undefined){
				if(pSliderData[5]!=sliderData[5]){
					if(drawLeaf){
						R.makeLeaf({x:20,y:10,length:sliderVal(leafSize)/200});
						R.leaf.needsUpdate = true;
						R.leaf.rotation.y = (R.rAmount/5)+((sliderVal(leafRotation)/100)*Math.PI*2);
					}
				}
				else if(R.leaf.needsUpdate){
					R.makeLeaf({length:sliderVal(leafSize)/200});
					R.leaf.rotation.y = (R.rAmount/5)+((sliderVal(leafRotation)/100)*Math.PI*2);
					R.leaf.needsUpdate = false;
				}
			}
		}

		mouseLeft=false;

		pSliderData = cloneArray(sliderData);
		pSliderDatas.push(pSliderData);

		if(pSliderDatas.length>10)
			pSliderDatas.shift();

		if(typeof firstLoop === 'undefined'){
			// booball();
			readData({"canvases":[[0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,90.28125,8.296875,0,108.28125,39.296875,0,103.28125,77.296875,0,86.28125,115.296875,0,61.28125,144.296875,0,22,143,0,0,127,0],[0,55,0,13,29,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,50,99,0,17,117,0,0,135,0],[4.28125,12.984375,0,128.28125,127.984375,0]],"sliders":[90,50,38.18,69.99,20,70,0,85.84],"toDrawExtraGeo":[true,true,true,true,true]});
			firstLoop=false;
			undo.push(writeData());
		}
}

function setupSliders(){

	sliderDataIsChanged = false;

	// $(function() {
	    $( "#openDialog" ).dialog({position: { my: "left top", at: "right top", of: window }});
	    $( "#openDialog" ).dialog( "open" );
	    document.getElementById("openDialog").style.display = 'block';

	  // });



	$(function() {
	    $( "#dialog" ).dialog({
	      autoOpen: false,
	      show: {
	        effect: "blind",
	        duration: 100
	      },
	      hide: {
	        effect: "bline",
	        duration: 100
	      },
	      maxWidth:1000,
	        maxHeight: 500,
	        width: 530,
	        height: 400,
	    });
	 
	    $( "#opener" ).click(function() {
	      $( "#dialog" ).dialog( "open" );
	    });
	    $( "#opener2" ).click(function() {
	      $( "#dialog" ).dialog( "open" );
	      $( "#openDialog" ).dialog( "close" );
	    });
	  });


	canvases.push(new CUI('myCanvas',{lineWidth:20,setVec:[0, 35, 0, 16.38352394104004, 14.90057373046875, 0, 54.38352394104004, 0.90057373046875, 0, 98.38352394104004, 11.90057373046875, 0, 117.38352394104004, 47.90057373046875, 0, 109.38352394104004, 83.90057373046875, 0, 82.38352394104004, 116.90057373046875, 0, 56, 144, 0, 22, 143, 0, 0, 127, 0]}));
	canvases.push(new CUI('myCanvas2',{lineWidth:20,setVec:[0,55,0,13,29,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,50,99,0,17,117,0,0,135,0]}));
	canvases.push(new CUI('myCanvas3',{lineWidth:3,setVec:[20,20,0,130,130,0],ctrlAmount:2}));

	colorSlider = $( "#slider" ).slider({
		range: false,
		step:.01,
		value:20,
	});

	stemSlider = $( "#stemSlider" ).slider({
		range: false,
		step:.01,
		value:20,
	});

	leafRotation = $( "#leafRotation" ).slider({
		range: false,
		step:.01,
		value:0,
	});

	leafSize = $( "#leafSize" ).slider({
		range: false,
		step:.01,
		value:50,
	});
	
	mouseLeft = false;
	sliders = [];

	for(var i = 0 ; i < 4 ; i++){

		var name = "";

		if(i==0)
			name="outer rotation"
		if(i==1)
			name="inner rotation"
		if(i==2)
			name="steps"

		if(i<3){
			$("#sliders").append("\
				<div style='width:150px;position:relative'>\
				<div style='text-align:center;font-size:.8em;margin-bottom:0px'> "+name+"</div>\
			<div class='mine'></div>\
				<div id='slider" + i + "'></div>\
			</div><div style='margin-top:0em'>\
			");
		}

		var val = 80;

		if(i==0)
			val = 90;
		if(i==1)
			val = 50;
		if(i==2)
			val = 20;

		sliders[i]=$( "#slider"+i ).slider({
			range: false,
			step:.01,
			value:val,
			// values: [ 17 ]
		});
		sliders[i].mouseleave(function() {
		  mouseLeft = true;
		});
	}


	colorSlider.mouseleave(function() {
		  mouseLeft = true;
		});

	$( "#tabs" ).tabs();
  	$( "#accordion" ).accordion({
		collapsible: true,
		heightStyle: "content",
		active: false,
		animate: 50
	});

	sliderData = checkSlider();
	pSliderData = checkSlider();

	// console.log('hi')

	// if(typeof colorSlider !== 'undefined')
	animater();
	document.getElementById("all").style.display = "block"

	// console.log(sliderData);

}

function toDrawLathe(){
	drawLathe = !drawLathe;

	R.makeLathe();
	// R.loopFinished = false;
	// R.tubeStep = 0;
}

function isSymmetry(){
	isSymmetrical = !isSymmetrical;
	if(isSymmetrical)
		document.getElementById("symmetryButton").value="Symmetry On";//.firstChild.nodeValue = "boobBag";
	else
		document.getElementById("symmetryButton").value="Symmetry Off";
	R.makeLathe();
	R.rotateTube();

}

function toDrawStem(){
	drawStem = !drawStem;
	if(drawStem==false)
		R.makeStem(true);
	else
		R.makeStem();
	if(drawStem)
		document.getElementById("stemButton").value="Hide Stem";//.firstChild.nodeValue = "boobBag";
	else
		document.getElementById("stemButton").value="Show Stem";
	// console.log(q);
	// R.makeLathe();
	// R.loopFinished = false;
	// R.tubeStep = 0;
}

function toDrawLeaf(){
	drawLeaf = !drawLeaf;
	if(drawLeaf)
		document.getElementById("leafButton").value="Hide Leaf";//.firstChild.nodeValue = "boobBag";
	else
		document.getElementById("leafButton").value="Show Leaf";
	// R.makeLathe();
	R.loopFinished = false;
	R.tubeStep = 0;
}

function makeHighRes(R,val) {

    function doChunk(R,val) {
		var v = val || 1;
		R.curveDetail=40;
		var t = R.makeLathe(val);
		R.curveDetail = 100;
		// console.log(t);
		return t;

    }

    return doChunk(R,val);    
}

function checkSlider(){
	sl = [];
	for(var i = 0 ; i < sliders.length ; i++){
		var s = sliders[i];
		sl.push(s.slider("value"));
	}
	sl.push(sliderVal(stemSlider));
	sl.push(sliderVal(leafSize));
	sl.push(sliderVal(leafRotation));
	return sl;
}

function sliderVal(s){
	return s.slider("value");
}

function animater(){

	if(typeof first === 'undefined'){
		first = true;
	}

	if(typeof pValue == 'undefined'){
		// if(typeof colorSlider !== 'undefined')
			pValue = colorSlider.slider("value");
		// else
		// 	pValue = 0;
	}

	sliderMove = false;

	if(pValue!==colorSlider.slider("value"))
		sliderMove = true;

	if(canvases[0].staticDrawing() || first || !sliderDataIsChanged || sliderMove || updateCanvas){
		for(var i = 0 ; i < canvases.length ; i++){

			if(i==2){
				var s = Math.round(7+(sliderData[2]/3));
				if(!first && R.curveDetail<100){
					s=R.steps;
				}

				canvases[i].colorSteps =  s;//Math.round(7+(sliderData[2]/3));//Math.round((data.var6+1)*10) ;
				canvases[i].paintColors(colorSlider.slider("value")*.001,sliders[3].slider("value"));
				colors = canvases[i].lerpColor();
				updateCanvas=false;

			}
			else{
				canvases[i].background("#99ccff");
				canvases[i].pinEdges();
			}

			canvases[i].drawVectors();

		}
		first = false;
	}

	pValue = colorSlider.slider("value");
	requestAnimationFrame(animater);

	return sliderMove;
};

var compareObj = function(a,b){

	var returner = true;

	if(typeof a ==='undefined' || typeof b ==='undefined')
		return true;

	else{
		for(var k in a){
			if(b[k]!=a[k])
				returner = false;
		}

		return returner;
	}
};

function saveUndoAnimation(){
	var num = 1;
	while(undo.length>0){
		readData(JSON.parse(undo.pop()));
		saveIMG('Fruit_'+num);
	}
}

function upResAndSave(name,toSave){

	var saveMe = toSave?true:false;

	R.tubeStep = 0;
	R.loopFinished = false;
	R.curveDetail = 120;

	while(!R.loopFinished){
		R.update(true);
	};
	R.makeLathe(2);
	R.makeLeaf({length:sliderVal(leafSize)/200});
	
	if(!saveMe)
		saverX3D(name);
};

function saverX3D(name) {

	var scaleOut = 4;//outputScale || 1;

	var name = name || "tree.x3d";

	var mshArray = [];

	var returnerArray = [];

	scene.updateMatrixWorld();

	scene.traverse(function(obj){
		if(obj.geometry){
			if(obj.parent)
				obj.parent.updateMatrixWorld();
			obj.updateMatrixWorld();
			if(obj.geometry.vertices.length>0){
				returnerArray.push(obj);
			}
		}
	});

	mshArray = returnerArray;

	// alert("saving!");
	var j = 0;

	var outputVecs = "";
	var outputFaces = "";
	var outputColors = "";

	// console.log(mshArray);
	
	for (var i = 0 ; i < mshArray.length ; i++){
		
		// if(i == mshArray.length-2 || i == mshArray.length-3) i++;
		// else{
			var getInfo = THREE.saveGeometryToX3D(mshArray[i],j,(.0003*scaleOut));
			// console.log(getInfo);
			outputVecs += getInfo[0];
			outputFaces += getInfo[1];
			outputColors += getInfo[2];
			j += mshArray[i].geometry.vertices.length;
		// }
	}

	var output = [
	'<?xml version=\"1.0\" encoding=\"UTF-8\"?>',
	'<!DOCTYPE X3D PUBLIC \"ISO//Web3D//DTD X3D 3.1//EN\" \"http://www.web3d.org/specifications/x3d-3.1.dtd\">',
	'<X3D profile=\"Immersive\" version=\"3.1\" xsd:noNamespaceSchemaLocation=\"http://www.web3d.org/specifications/x3d-3.1.xsd\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema-instance\">',
	 '<head>',
	  '<meta content=\"fruited.x3d\" name=\"title\"/>',
	  '<meta content=\"Generated from Meshlab X3D Exported\" name=\"description\"/>',
	  '<meta content=\"7 December 2014\" name=\"created\"/>',
	  '<meta content=\"Made by Idle Hands, http://www.dlobser.com\" name=\"fruited\"/>',
	' </head>',
	' <Scene>',
	'  <Shape>',
	'   <IndexedFaceSet coordIndex=\"'+outputFaces+'\" colorPerVertex=\"false\" solid=\"false\" normalPerVertex=\"false\">',
	    '<Coordinate point=\"'+outputVecs+'\"/>',
	    '<ColorRGBA color=\"'+outputColors+'\"/>',
	   '</IndexedFaceSet>',
	  '</Shape>',
	 '</Scene>',
	'</X3D>',
	].join("\n");


	
	output.replace("undefined","");
	// document.write(output);
	// console.log(output);
	// alert("saved!");
	var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
	saveAs(blob, name);
}

THREE.saveGeometryToX3D = function (geo,nums,scalar) {

	geo.updateMatrixWorld();

	var num = parseInt(nums);

	var s = [];

	s[0]=""; //verts
	s[1]=""; //faces
	s[2]=""; //colors

	for (i = 0; i < geo.geometry.vertices.length; i++) {

		var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
		
		geo.matrixWorld.multiplyVector3( vector );
		vector.multiplyScalar(scalar);
		//vector.applyProjection( matrix )
		
		s[0]+= ' '+(vector.x) + ' ' +
		vector.y + ' '+
		vector.z + ' ';

		
	}

	for (i = 0; i < geo.geometry.faces.length; i++) {

		s[2]+=geo.material.color.r + ' ' + 
		geo.material.color.g + ' ' + 
		geo.material.color.b + ' 1 ';

		s[1]+= (geo.geometry.faces[i].a+num) + ' ' +
		(geo.geometry.faces[i].b+num) + ' '+
		(geo.geometry.faces[i].c+num);

		// if (geo.geometry.faces[i].d!==undefined) {
		// 	s+= ' '+ (geo.geometry.faces[i].d+1+num);
		// }
		s[1]+= ' -1 ';
	}
	// console.log(s);
	return s;
}

function exp(t){
	return t*t;
}

function cloneArray(a){
	var b = [];
	for(var i = 0 ; i < a.length ; i++){
		b[i] = a[i];
	}
	return b;
}

function isDef(t){
	return typeof t !== 'undefined';
}

function drawCenterShape(){
	R.toDrawExtraGeo[0] = !R.toDrawExtraGeo[0];
	R.loopFinished = false;
	R.tubeStep = 0;
}

function makeShader(){

	tex = THREE.ImageUtils.loadTexture('assets/textures/superBlurry.jpg');

	var vertRT2 = "\
	    varying vec2 vUv;\
	    varying vec3 vNormal;\
	    uniform sampler2D tDiffuse;\
	    uniform vec3 camPos;\
	    void main() {\
	    	vNormal = (normal+normalize(camPos*-1.)).xyz;\
	        vUv = uv;\
	        float offset = texture2D(tDiffuse, vUv).x;\
	        gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position.x,position.y,position.z + offset*.00), 1.0 );\
	    }\
	";

	var fragRT2="\
	    varying vec2 vUv;\
	    uniform sampler2D tDiffuse;\
	    varying vec3 vNormal;\
	   	uniform vec3 camPos;\
	    void main() {\
	        float offset = texture2D(tDiffuse, vUv).x;\
	        vec4 col = texture2D(tDiffuse, vNormal.xy);\
	        gl_FragColor = vec4(vec3(vNormal.x),1.0);\
	    }\
	";

	

	return new THREE.ShaderMaterial( {
	    uniforms: { tDiffuse: { type: "t", value: tex },
	    			color: { type: "c", value: new THREE.Color(0x5599ee) },
					camPos : { type: "v3", value: new THREE.Vector3( 0, 1, 2 ) },  
	    			 },
	    vertexShader: vertRT2,
	    fragmentShader: fragRT2,
	    // depthWrite: false
	} );
}

function writeData(log){

	var canvases = [];

	for(var j = 0 ; j < R.canvases.length ; j++){
		var r = []; 
		for(var i = 0 ; i < R.canvases[j].ctrls.length ; i++){
			r.push(R.canvases[j].ctrls[i].x);
			r.push(R.canvases[j].ctrls[i].y);
			r.push(R.canvases[j].ctrls[i].z);
		}
		// if(j<2)
		// r = scaleDown(r);
		canvases.push(r);

	}

	// console.log(drawStem);

	// if(typeof drawStem=='undefined');
	// 	drawStem=false;
	// console.log(isSymmetrical,drawLathe,drawStem);

	var sl = checkSlider();

	sl.push(colorSlider.slider("value"));

	tob = {
		canvases:canvases,
		sliders:sl,
		toDrawExtraGeo:[R.toDrawExtraGeo[0],isSymmetrical,drawLathe,drawStem,drawLeaf]
	};

	ob = JSON.stringify(tob);
	if(log)
		console.log(ob);
	return ob;
}

function readData(st){

	var bob = st || JSON.parse(ob);

	for(var i = 0 ; i < R.canvases.length ; i++){
		R.canvases[i].setCtrls(bob.canvases[i]);
	}

	for(var i = 0 ; i < sliders.length ; i++){
		sliders[i].slider("value",bob.sliders[i]);
	}

	colorSlider.slider("value",bob.sliders[7]);
	stemSlider.slider("value",bob.sliders[4]);
	leafSize.slider("value",bob.sliders[5]);
	leafRotation.slider("value",bob.sliders[6]);

	// console.log(bob.sliders[4]);

	R.toDrawExtraGeo[0] = bob.toDrawExtraGeo[0];
	isSymmetrical = bob.toDrawExtraGeo[1];
	drawLathe = bob.toDrawExtraGeo[2];
	drawStem = bob.toDrawExtraGeo[3];
	drawLeaf = bob.toDrawExtraGeo[4];
	updateCanvases();
	R.loopFinished = false;
	R.tubeStep = 0;
}

function setOuterShape(st){

	if(undo.length===0)
		undo.push(writeData());
	else if(!compareObj(writeData(),undo[undo.length-1]))
		undo.push(writeData());

	var options = document.getElementById('selectOuter').options;
		
	switch(options.selectedIndex){
		case 0:
			R.canvases[0].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
			break;
		case 1:
			R.canvases[0].setCtrls([0, 0, 0, 25, 4, 0, 48, 17, 0, 65, 37, 0, 73, 62, 0, 73, 88, 0, 65, 112, 0, 48, 132, 0, 25, 145, 0, 0, 150, 0]);
			break;
		case 2:
			R.canvases[0].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
			break;
		case 3:
			R.canvases[0].setCtrls([0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,95.28125,11.5,0,119.28125,45.5,0,112.28125,85.5,0,82.38352394104004,116.90057373046875,0,56,144,0,22,143,0,0,127,0]);
			break;
		case 4:
			R.canvases[0].setCtrls([0,36.5,0,15.28125,21.5,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,44.28125,112.5,0,8.28125,132.5,0,0,114.5,0]);
			break;
		case 5:
			R.canvases[0].setCtrls([0, 75, 0, 17, 26, 0, 62, 1, 0, 112, 10, 0, 145, 49, 0, 145, 100, 0, 112, 140, 0, 62, 148, 0, 17, 123, 0, 0, 75, 0]);
			break;
		default:
			R.canvases[0].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
	}
	
	updateCanvases();
	R.loopFinished = false;
	R.tubeStep = 0;
}

function setInnerShape(st){

	if(undo.length===0)
		undo.push(writeData());
	else if(!compareObj(writeData(),undo[undo.length-1]))
		undo.push(writeData());


	var options = document.getElementById('selectInner').options;
		
	switch(options.selectedIndex){
		case 0:
			R.canvases[1].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
			break;
		case 1:
			R.canvases[1].setCtrls([0, 7.5, 0, 22.5, 11.1, 0, 43.2, 22.8, 0, 58.5, 40.800000000000004, 0, 65.7, 63.300000000000004, 0, 65.7, 86.7, 0, 58.5, 108.3, 0, 43.2, 126.3, 0, 22.5, 138, 0, 0, 142.5, 0]);
			break;
		case 2:
			R.canvases[1].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
			break;
		case 3:
			R.canvases[1].setCtrls([0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,95.28125,11.5,0,119.28125,45.5,0,112.28125,85.5,0,82.38352394104004,116.90057373046875,0,56,144,0,22,143,0,0,127,0]);
			break;
		case 4:
			R.canvases[1].setCtrls([0,55,0,10.28125,26.296875,0,34.28125,4.296875,0,67.28125,-0.703125,0,92.28125,16.296875,0,101.28125,45.296875,0,92.28125,72.296875,0,64.28125,98.296875,0,24.28125,124.296875,0,0,146.296875,0]);
			break;
		case 5:
			R.canvases[1].setCtrls([0, 75, 0, 17, 26, 0, 62, 1, 0, 112, 10, 0, 145, 49, 0, 145, 100, 0, 112, 140, 0, 62, 148, 0, 17, 123, 0, 0, 75, 0]);
			break;
		default:
			R.canvases[1].setCtrls([0,15.5,0,16.38352394104004,14.90057373046875,0,53.28125,20.5,0,90.28125,35.5,0,117.28125,63.5,0,116.38352394104004,94.90057373046875,0,58.38352394104004,95.90057373046875,0,56,144,0,22,143,0,0,141.5,0]);
	}
	
	updateCanvases();

	// R.canvases[1].setCtrls(st);
	R.loopFinished = false;
	R.tubeStep = 0;
}

function updateCanvases(){
	for(var i = 0 ; i < canvases.length ; i++){

		if(i==2){
			// canvases[i].colorSteps =  10;//Math.round(7+(sliderData[2]/3));//Math.round((data.var6+1)*10) ;
			canvases[i].paintColors(colorSlider.slider("value")*.001,sliders[3].slider("value"));
			colors = canvases[i].lerpColor();
		}
		else{
			canvases[i].background("#99ccff");
			canvases[i].pinEdges();
		}

		canvases[i].drawVectors();

	}
}

function scaleDown(a){

	var b = [];

	for(var i = -1 ; i < a.length-3; i){
		b.push(a[++i]*.9);
		b.push((150/20)+a[++i]*.9);
		b.push(a[++i]);
	}

	console.log(b);

	return b;
};

applyPreset2 = function(n){

	$( "#dialog" ).dialog( "close" );

	if(undo.length===0)
		undo.push(writeData());
	else if(!compareObj(writeData(),undo[undo.length-1]))
		undo.push(writeData());

	var div = document.getElementById('user');
	var options = {};//document.getElementById('select').options;
	var divAnim = document.getElementById('anim');

	if(typeof n !== undefined)
		options.selectedIndex = n;
	
	switch(options.selectedIndex)
	{
	case 0:
		//apple
		readData({"canvases":[[0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,90.28125,8.296875,0,108.28125,39.296875,0,103.28125,77.296875,0,86.28125,115.296875,0,61.28125,144.296875,0,22,143,0,0,127,0],[0,55,0,13,29,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,50,99,0,17,117,0,0,135,0],[4.28125,12.984375,0,128.28125,127.984375,0]],"sliders":[90,50,38.18,69.99,20,70,0,85.84],"toDrawExtraGeo":[true,true,true,true,true]});
		break;
	case 1:
		//apple
		readData({"canvases":[[0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,90.28125,8.296875,0,108.28125,39.296875,0,103.28125,77.296875,0,86.28125,115.296875,0,61.28125,144.296875,0,22,143,0,0,127,0],[0,55,0,13,29,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,50,99,0,17,117,0,0,135,0],[4.28125,12.984375,0,128.28125,127.984375,0]],"sliders":[90,50,38.18,69.99,20,70,0,85.84],"toDrawExtraGeo":[true,true,true,true,true]});
		break;
	case 2:
		//mushroom
	 	readData(  {"canvases":[[0,2.965911865234375,0,35.37215995788574,5.965911865234375,0,77.37215995788574,18.965911865234375,0,107.37215995788574,43.965911865234375,0,119.37215995788574,79.96591186523438,0,82.37215995788574,86.96591186523438,0,68.37215995788574,94.96591186523438,0,67.37215995788574,135.96591186523438,0,10.153125000000001,136.65,0,0,102.45,0],[0,57,0,11.700000000000001,33.6,0,32.4,16.5,0,60.300000000000004,15.6,0,84.60000000000001,28.2,0,92.7,55.2,0,75.60000000000001,83.10000000000001,0,45,96.60000000000001,0,15.3,112.8,0,0,129,0],[110.37215995788574,137.49432373046875,0,66.37215995788574,17.49432373046875,0]],"sliders":[89.57,50.74,53.58,73.2,20,50,0,99.99000000000001],"toDrawExtraGeo":[true,true,true,false,false]});
		break;
	case 3:
		//hamburger
	 	readData( {"canvases":[[0,15.15,0,84.853125,20.55,0,104.653125,61.050000000000004,0,87.55312500000001,70.95,0,98.353125,74.55,0,99.253125,96.15,0,90.253125,100.65,0,106.453125,106.95,0,91.153125,131.25,0,0,134.85000000000002,0],[0,60.15,0,16.453125,34.95,0,56.953125,14.25,0,104.653125,58.35,0,118.153125,124.05,0,95.653125,125.85000000000001,0,81.253125,72.75,0,56.953125,43.050000000000004,0,29.053125,58.35,0,0,115.95,0],[75.28125,63.1875,0,91.28125,64.1875,0]],"sliders":[17.37,74.25,67.72,12.16,20,50,0,19.38],"toDrawExtraGeo":[true,true,true]});
		break;
	case 4:
		//infinity
	 	readData(   {"canvases":[[0,75,0,12.393,39.279,0,45.19800000000001,21.054000000000002,0,81.648,27.615000000000002,0,105.705,56.04600000000001,0,105.705,93.22500000000001,0,81.648,122.385,0,45.19800000000001,128.21700000000004,0,12.393,109.992,0,0,75,0],[0,75,0,12.393,39.279,0,45.19800000000001,21.054000000000002,0,81.648,27.615000000000002,0,105.705,56.04600000000001,0,105.705,93.22500000000001,0,81.648,122.385,0,45.19800000000001,128.21700000000004,0,12.393,109.992,0,0,75,0],[32.28125,129.1875,0,138.28125,57.1875,0]],"sliders":[26.45,99.99000000000001,99.99000000000001,66.52,20,50,0,51.86],"toDrawExtraGeo":[false,false,true]});
		break;
	case 5:
		//spaceship
	 	readData( {"canvases":[[0,14.25,0,20.25,17.490000000000002,0,38.88,28.02,0,61.06065439224244,55.33219367980958,0,108.85065439224243,65.86219367980956,0,108.85065439224243,82.06219367980957,0,60.25065439224244,92.59219367980957,0,38.88,121.17,0,20.25,131.7,0,0,135.75,0],[0,14.25,0,11.053125,40.35,0,53.28125,10.5,0,32.71065439224243,60.1921875,0,119.28125,69.5,0,59.13,85.53,0,31.900654392242433,89.35218750000001,0,74.28125,138.5,0,13.270654392242433,105.5521875,0,0,135.75,0],[70.28125,72.1875,0,134.28125,57.1875,0]],"sliders":[17.37,53.22,67.72,19.1,20,50,0,20],"toDrawExtraGeo":[true,true,true,false]});
		break;
	case 6:
		//happy cat
	 	readData({"canvases":[[0,67.54688186645508,0,10.245171546936035,42.34688186645508,0,37.153125,20.55,0,73.24517154693604,12.646881866455079,0,101.05312500000001,16.950000000000003,0,99.34517154693604,65.74688186645508,0,80.44517154693604,94.54688186645508,0,50.745171546936035,111.64688186645508,0,26.445171546936034,118.84688186645508,0,0,115.24688186645508,0],[0,20.746875000000003,0,41.745171546936035,19.846875,0,81.34517154693604,19.846875,0,106.453125,20.55,0,126.253125,28.650000000000002,0,117.34517154693604,58.546875,0,99.253125,82.65,0,71.44517154693604,104.446875,0,31.845171546936037,121.546875,0,0,129.64687500000002,0],[37.28125,64.1875,0,76.28125,118.1875,0]],"sliders":[63.99,76.24,30.18,76.09,20,50,0,47.89],"toDrawExtraGeo":[true,true,true,false]});
		break;
	case 7:
		//butterfly
		readData( {"canvases":[[0,61.050000000000004,0,40.753125000000004,21.450000000000003,0,83.05312500000001,14.25,0,103.753125,36.75,0,101.953125,71.85000000000001,0,67.753125,81.75,0,81.253125,107.85000000000001,0,56.053125,133.05,0,19.153125,131.25,0,0,91.65,0],[0,14.25,0,13.753125,18.75,0,24.553125,33.150000000000006,0,29.953125,50.25,0,30.853125000000002,68.25,0,30.853125000000002,85.35000000000001,0,30.853125000000002,102.45,0,28.153125,117.75,0,16.453125,132.15,0,0,135.75,0],[71.28125,36.1875,0,118.28125,125.1875,0]],"sliders":[20.4,48.92,67.72,62.22,20,50,0,37.37],"toDrawExtraGeo":[true,true,true,true]});
		break;
	case 8:
		//pear
		readData({"canvases":[[0,34.05,0,12.853125,18.75,0,33.553125,19.65,0,47.953125,39.45,0,53.353125,69.15,0,71.353125,89.85000000000001,0,73.153125,113.25,0,56.953125,132.15,0,25.453125,140.25,0,0,128.55,0],[0,57,0,11.700000000000001,33.6,0,32.4,16.5,0,60.300000000000004,15.6,0,84.60000000000001,28.2,0,92.7,55.2,0,75.60000000000001,83.10000000000001,0,45,96.60000000000001,0,15.3,112.8,0,0,129,0],[49.28125,127.1875,0,41.28125,81.1875,0]],"sliders":[84.76,63.63,20,56.87,20,77.92,0,31.22],"toDrawExtraGeo":[true,true,true,true,true]});
		break;
	case 9:
		//jewel
		readData( {"canvases":[[0,7.5,0,22.5,11.1,0,43.2,22.8,0,58.5,40.800000000000004,0,65.7,63.300000000000004,0,65.7,86.7,0,58.5,108.3,0,43.2,126.3,0,22.5,138,0,0,142.5,0],[0,75,0,15.3,30.900000000000002,0,55.800000000000004,8.4,0,100.8,16.5,0,130.5,51.6,0,130.5,97.5,0,100.8,133.5,0,55.800000000000004,140.70000000000002,0,15.3,118.2,0,0,75,0],[31.28125,30.1875,0,52.28125,62.1875,0]],"sliders":[99.99000000000001,0,39.11,74,20,0,50,20],"toDrawExtraGeo":[false,false,true,false]});
		break;
	case 10:
		//speaker
		readData({"canvases":[[0,7.5,0,45,7.5,0,91.28125,9.5,0,126,16.5,0,135,52.5,0,135,97.5,0,126,133.5,0,89.28125,141.5,0,45,142.5,0,0,142.5,0],[0,7.5,0,22.5,11.1,0,43.2,22.8,0,58.5,40.800000000000004,0,65.7,63.300000000000004,0,65.7,86.7,0,58.5,108.3,0,43.2,126.3,0,22.5,138,0,0,142.5,0],[41.28125,21.1875,0,43.28125,103.1875,0]],"sliders":[75.04,62.14,45.52,36.62,20,0,50,59.04],"toDrawExtraGeo":[true,true,true,false]});
		break;
	case 11:
		//church
		readData( {"canvases":[[0,4.5,0,30.28125,13.5,0,53.28125,32.5,0,67.28125,56.5,0,72.28125,83.5,0,74.28125,112.5,0,71.28125,139.5,0,48.28125,141.5,0,21.28125,141.5,0,0,142.5,0],[0,7.5,0,13.28125,10.5,0,15.28125,39.5,0,51.28125,41.5,0,51.28125,58.5,0,18.28125,60.5,0,12.28125,92.5,0,14.28125,118.5,0,16.28125,139.5,0,0,142.5,0],[15.28125,85.1875,0,108.28125,135.1875,0]],"sliders":[88,54.04,40.85,73.93,20,0,50,47.05],"toDrawExtraGeo":[true,true,true,false]});
		break;
	case 12:
		//jewel
		readData({"canvases":[[0,10.296875,0,21.28125,10.296875,0,65.28125,11.296875,0,79.28125,18.296875,0,106.28125,40.296875,0,105.28125,53.296875,0,78.28125,89.296875,0,39.28125,142.296875,0,25.28125,147.296875,0,0,148.296875,0],[0,7.5,0,14.28125,20.296875,0,32.28125,35.296875,0,51.28125,53.296875,0,66.28125,68.296875,0,71.28125,78.296875,0,55.28125,95.296875,0,38.28125,111.296875,0,19.28125,128.296875,0,0,142.5,0],[118.28125,129.984375,0,107.28125,63.984375,0]],"sliders":[91.58,50,38.18,0,20,0,50,39.18],"toDrawExtraGeo":[true,true,true,false]});
		break;
	default:
 		readData({"canvases":[[0,35,0,16.38352394104004,14.90057373046875,0,54.38352394104004,0.90057373046875,0,98.38352394104004,11.90057373046875,0,117.38352394104004,47.90057373046875,0,109.38352394104004,83.90057373046875,0,82.38352394104004,116.90057373046875,0,56,144,0,22,143,0,0,127,0],[0,55,0,13,29,0,36,10,0,67,9,0,94,23,0,103,53,0,84,84,0,50,99,0,17,117,0,0,135,0],[20,20,0,130,130,0]],"sliders":[90,50,20,20,20,0,50,20],"toDrawExtraGeo":[true,true,true]});	
	}
}


function booball(){
var noisy = "\
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }\
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }\
float noise(vec3 P) {\
	vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));\
	vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);\
	vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);\
	vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;\
	vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);\
	vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\
	vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\
	gx0 = fract(gx0); gx1 = fract(gx1);\
	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));\
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));\
	gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);\
	gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);\
	vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),\
		 g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),\
		 g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),\
		 g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);\
	vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));\
	vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));\
	g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;\
	g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;\
vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),\
				   dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),\
			  vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),\
				   dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);\
	return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);\
}\
float noise(vec2 P) { return noise(vec3(P, 0.0)); }\
float turbulence(vec3 P) {\
	float f = 0., s = 1.;\
for (int i = 0 ; i < 9 ; i++) {\
   f += abs(noise(s * P)) / s;\
   s *= 2.;\
   P = vec3(.866 * P.x + .5 * P.z, P.y, -.5 * P.x + .866 * P.z);\
}\
	return f;\
}\
";

var bumpVert = "\
	varying vec3 vecNormal;\
	varying vec3 pos;\
	void main() {\
		pos = (modelMatrix * vec4(position,1.0)).xyz;\
		vecNormal = normal;\
		gl_Position = projectionMatrix *\
		modelViewMatrix * vec4(position, 1.0 );\
	}\
";

//bump mapping from here:
//http://mrl.nyu.edu/~perlin/courses/fall2013/oct30/
//specular from here:
//http://www.sunandblackcat.com/tipFullView.php?l=eng&topicid=30

var bumpFrag = "\
	precision highp float;\
	varying vec3 vecNormal;\
	uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];\
	uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];\
	uniform vec3 color;\
	uniform vec3 camPos;\
	varying vec3 pos;\
	void main(void) {\
		vec4 lgts = vec4(vec3(0.0),1.0);\
		vec3 spec = vec3(0.);\
		float mult = 9.;\
		float Noise = (noise(pos*mult))*.1;\
		float off = .0001;\
		float px = ((noise(vec3(mult*pos.x+off,mult*pos.y,mult*pos.z))*.6)-Noise);\
		float py = ((noise(vec3(mult*pos.x,mult*pos.y+off,mult*pos.z))*.6)-Noise);\
		float pz = ((noise(vec3(mult*pos.x,mult*pos.y,mult*pos.z+off))*.6)-Noise);\
		vec3 nNormal = normalize(vecNormal-vec3(px,py,pz));\
		float camNormal = 1.+-max(0.,dot( nNormal, normalize(camPos) ));\
		for(int i = 0 ; i < MAX_DIR_LIGHTS ; i++){\
			vec3 dir = directionalLightDirection[i];\
			lgts.rgb += pow(clamp(dot(dir,nNormal),0.,1.),2.) * directionalLightColor[i];\
			vec3 halfVec = normalize(directionalLightDirection[i]+normalize(vecNormal+camPos));\
			spec += pow(dot(halfVec,vecNormal),13.9)*.5*(1.+-Noise)*directionalLightColor[i];\
		}\
		vec3 rim = lgts.rgb * pow(camNormal,2.) * 2.;\
		gl_FragColor = vec4(.8*(color*lgts.rgb+rim+spec), 1.0);\
	}\
";

noisy+=bumpFrag;

bumpMat = new THREE.ShaderMaterial({
	uniforms: THREE.UniformsUtils.merge([
		THREE.UniformsLib['lights'],
		{	
			camPos: {type: 'v3', value:new THREE.Vector3(0,0,0)},
			color: {type: 'v3', value:new THREE.Vector3(1,1,1)},
		}
	]),
	vertexShader: bumpVert,
	fragmentShader: noisy,
	lights: true
});
spp = sphere(6,30,30);
spp.material = bumpMat;
bumpMat.color = new THREE.Color(1,1,1);
bumpMat.dispose = function(){console.log('sucker')}
scene.add(spp);

console.log(bumpMat);
}
/*
//bird
 {"canvases":[[0,22.35,0,11.1537,42.8511,0,54.253125000000004,25.05,0,102.853125,21.450000000000003,0,123.55312500000001,27.75,0,118.153125,53.85,0,82.153125,112.35000000000001,0,35.353125,123.15,0,11.953125,106.05,0,0,138.45000000000002,0],[0,75,0,11.1537,42.8511,0,40.67820000000001,26.448600000000003,0,73.4832,32.353500000000004,0,95.1345,57.94140000000001,0,95.1345,91.4025,0,73.4832,117.6465,0,40.67820000000001,122.89530000000003,0,11.1537,106.4928,0,0,75,0],[32.28125,129.1875,0,138.28125,57.1875,0]],"sliders":[26.45,43.89,46.18,77.45,19.93],"toDrawExtraGeo":[false,true,null]}

 */

/* dad thing

{"canvases":[[0,7.296875,0,19.28125,33.296875,0,34.28125,48.296875,0,50.28125,59.296875,0,63.28125,69.296875,0,90.28125,94.296875,0,99.28125,125.296875,0,61.28125,135.296875,0,20.28125,136.296875,0,0,124.296875,0],[0,58.296875,0,20.28125,43.296875,0,43.28125,37.296875,0,66.28125,45.296875,0,77.28125,64.296875,0,76.28125,83.296875,0,66.28125,105.296875,0,48.28125,122.296875,0,24.28125,132.296875,0,0,118.296875,0],[52.28125,49.984375,0,105.28125,38.984375,0]],"sliders":[85.68,2.91,87.63,46.61,60.57],"toDrawExtraGeo":[true,true,true,true]}
*/
/*
sarah
 {"canvases":[[0,4.5,0,30.28125,13.5,0,53.28125,32.5,0,67.28125,56.5,0,72.28125,83.5,0,74.28125,112.5,0,71.28125,139.5,0,48.28125,141.5,0,21.28125,141.5,0,0,142.5,0],[0,55,0,10.28125,26.296875,0,34.28125,4.296875,0,67.28125,-0.703125,0,92.28125,16.296875,0,101.28125,45.296875,0,92.28125,72.296875,0,64.28125,98.296875,0,24.28125,124.296875,0,0,146.296875,0],[38.28125,92.984375,0,141.28125,135.984375,0]],"sliders":[91.72,71.64,99.99000000000001,68.73,23.34],"toDrawExtraGeo":[true,true,true,true]}
 */
 