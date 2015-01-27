// gui=new dat.GUI();
// setupDat();

// data = {};

// function setupDat(args){
	
// 	if(!args) args = {};

// 	var sliders = args.sliders || 7;

// 	window.onload = function() {
// 	    initDat();
// 	};	
// }

// function initDat(args){
	
// 	if(!args) args = {};

// 	var sliders = args.sliders || 7;
// 	var values = args.values || {};
// 	var folders = args.folders || [];

// 	gui=0;

//     data = values;

//     info = {};

//     for (var i = 1; i <= sliders; i++) {
// 		data["var"+i]=0.0001
// 	}

// 	gui = new dat.GUI();
// 	GUI = gui;

// 		Object.keys(data).forEach(function (key) {
// 	  		gui.add(data, key, -1.0, 1.0).listen();
// 		})
// 		// gui.remember(data);
// 		for (var i in gui.__controllers) {
// 		    gui.__controllers[i].setValue(0);
// 		}
// 		// gui.close();
	
// 		for(var i = 0 ; i < folders.length ; i++){

// 			var folder = gui.addFolder(folders[i].name);

// 			thisData=folders[i].values;

// 			info[folders[i].name] = thisData;

// 			Object.keys(thisData).forEach(function (key) {
// 		  		folder.add(thisData, key, -1.0, 1.0).listen();
// 			})
// 			gui.remember(thisData);
			
// 		}

// 	for (var i in gui.__controllers) {
// 	    gui.__controllers[i].setValue(0);
// 	}

// 	gui.close();
// }

// function rebuildGui(args) {

// 	gui.destroy();
// 	initDat(args);
// }


var camera, controls, scene, renderer, composer, useComposer, projector,objects,noLights,updateControls,
	mouseX, mouseY, omouseX, omouseY, pmouseX, pmouseY, opmouseX, opmouseY, rmouseX, rmouseY, mousePressed,
	pmx, pmy,outputScale,reffect,rift, width, height,
	frameRate,pause,
	varW,varE,varR,varT,varY,varZ,
	var1,var2,var3,var4,var5,var6,var7,
	objectSelectable;

var tree;

var clock = new THREE.Clock();
clock.start();
var time = clock.getElapsedTime();
var count;

var thing = [];

// init();
// setupSliders();
// window.addEventListener('load', function() { 	if(typeof setupDone !== 'undefined'){
// animate();}}, false)

function init() {

	editable=false;

	width = window.innerWidth;
	height = window.innerHeight;

	frameRate = 1000/30;
	pause = false;
	objectSelectable = false;
	useDepth = false;
	noLights = false;
	useComposer = false;
	rift = false;

	outputScale = 1;

	projector = new THREE.Projector();

	objects = [];

	count=0;

	pmx = pmy = [];

	updateControls = true;

	varW = varE = varR = varT = varY = var1 = var2 = var3 = var4 = var5 = var6 = var7 = varZ = false;

	mouseX = mouseY = omouseX = omouseY = pmouseX = pmouseY = opmouseX = opmouseY = 0;
	mousePressed = false;

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = 130;

	controls = new THREE.OrbitControls( camera,container );
	// controls.addEventListener( 'change', render );

	reinit();

	renderer = new THREE.WebGLRenderer( { devicePixelRatio: 1,clearColor: 0xff0000, antialias: true ,alpha: true , preserveDrawingBuffer: true 
} );
// renderer = new THREE.WebGLRenderer({
// 					devicePixelRatio: 1,
// 					alpha: false,
// 					clearColor: 0x000000,
// 					antialias: true
// 				});
	renderer.setClearColor( 0x000000, 0);

	renderer.setSize( window.innerWidth, window.innerHeight);

	if(useComposer)
		composer = new THREE.EffectComposer( renderer );
	
	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	if(reinited){
			setTimeout(function(){

		animate();
			},30);

	}
}

function reinit() {

	scene = new THREE.Scene();

	setTimeout(function(){

		sc1.setup();
	},10);

	scene.traverse(function(t){if(t.geometry)objects.push(t)});

	lightGroup = new THREE.Object3D();

	if(!noLights){
		light = new THREE.DirectionalLight( 0x888888 ); light.position.set( 1, 1, -2 ); 		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x888888 ); light.position.set( 1, 0, -2 ); 		lightGroup.add( light );

		light = new THREE.DirectionalLight( 0x888888 ); light.position.set( -1, -1, -1 ); 		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x333333 ); light.position.set( 1, 1, .5 ); 		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x555555 ); light.position.set( -1, 1, .5 ); 		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x555555 ); light.position.set( 0, .2, 1 );   		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x333333 ); light.position.set( 0, 1, 1 );  		lightGroup.add( light );
		light = new THREE.DirectionalLight( 0x333333,1,0 ); light.position.set( 0, -1, 0 ); 	lightGroup.add( light );
		// light = new THREE.DirectionalLight( 0x777777,1,0 ); light.position.set( 1, -1, 1 ); 	lightGroup.add( light );
		light = new THREE.AmbientLight( 0x222222 ); scene.add( light );
	}
	scene.add(lightGroup);
	if(rift){	
	    reffect = new THREE.OculusRiftEffect(renderer);
	    reffect.setSize(window.innerWidth, window.innerHeight);
	    document.getElementById('ipd').innerHTML =
						effect.getInterpupillaryDistance().toFixed(3);
	}

	reinited = true;
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	setTimeout(function(){

		var time = clock.getElapsedTime();
		lightGroup.lookAt(camera.position);

		render();


		count++;
		
		// pm(4);

		if(!pause)
			sc1.draw(-time);


		// setSpan("mouseInfoX","mouseX: " + truncateDecimals(mouseX,3) + " rmouseX: " + rmouseX + " omouseX: " + truncateDecimals(omouseX,3));
		// setSpan("mouseInfoY","mouseY: " + truncateDecimals(mouseY,3) + " rmouseY: " + rmouseY + " omouseY: " + truncateDecimals(omouseY,3));

		requestAnimationFrame( animate );

		if(updateControls)
			controls.update(10);

	},frameRate)
}

function render() {

	// if(useComposer){

	// 	if(useDepth){

	// 		scene.overrideMaterial = depthMaterial;
	// 		renderer.render( scene, camera, depthTarget );
			
	// 	}

	// 	scene.overrideMaterial = null;
	// 	composer.render( scene, camera );
	// }

	// else if(rift)
	// 	reffect.render(scene,camera);
	// else
		renderer.render( scene, camera );

}

function pm(length){
	//previous mouse

	len = length || 2;
	returner = [];

	pmx.push(mouseX);
	pmy.push(mouseY);

	pmouseX = (pmx[0]);
	pmouseY = (pmy[0]);

	if(pmx.length>len)
		pmx.shift();
	if(pmy.length>len)
		pmy.shift();

	opmouseX = pmouseX-.5;
	opmouseY = pmouseY-.5;

}

function setSpan(id, str) {
    document.getElementById(id).firstChild.nodeValue = str;
}

function setSliders(obj){
	Object.keys(obj).forEach(function (key) {
  		data[key] = obj[key];
	});
}
	
window.onkeyup = onKeyUp;

function onKeyUp(evt) {

	if(!editable){
		if(evt.keyCode == 40){
			tree.position.y -= 30;
		}
		if(evt.keyCode == 38){
			tree.position.y += 30;
		}
		if(evt.keyCode == 37){
			tree.position.x -= 30;
		}
		if(evt.keyCode == 39){
			tree.position.x += 30;
		}
	}

	if(evt.keyCode == 82 && evt.ctrlKey){
		// findAndReplaceAce();
	}	
	if(evt.keyCode == 68 && evt.ctrlKey)
		objectSelectable = !objectSelectable;

	if(evt.keyCode == 67 && evt.ctrlKey){
		// activateAce();
	}	
	if(evt.keyCode == 88 && evt.ctrlKey){
		// updateCode();
	}	
	if(evt.keyCode == 32 && evt.ctrlKey){
		pause = !pause;
	}
	if(evt.keyCode == 188 && evt.ctrlKey){
		// changeAceFontSize(-1);
	}
	if(evt.keyCode == 190 && evt.ctrlKey){
		// changeAceFontSize(1);
	}
	if(evt.keyCode == 189 && evt.ctrlKey){
		// changeAceWidth(-5);
	}
	if(evt.keyCode == 187 && evt.ctrlKey){
		// changeAceWidth(5);
	}
	if(evt.keyCode == 73 && evt.ctrlKey && !evt.shiftKey){
		// invertColor();
	}	
	if(evt.keyCode == 83 && evt.ctrlKey && evt.shiftKey){
		// saveAce();
	}
	if(evt.keyCode == 73 && evt.ctrlKey && evt.shiftKey){
		// aceBackground();
	}
	if(evt.keyCode == 87 ){ varW = !varW;}
	if(evt.keyCode == 69 ){ varE = !varE;}
	if(evt.keyCode == 82 ){ varR = !varR;}
	if(evt.keyCode == 84 ){ varT = !varT;}
	if(evt.keyCode == 89 ){ varY = !varY;}
	if(evt.keyCode == 90 ){ varZ = !varZ;}

	if(evt.keyCode == 49 ){ var1 = !var1;}
	if(evt.keyCode == 50 ){ var2 = !var2;}
	if(evt.keyCode == 51 ){ var3 = !var3;}
	if(evt.keyCode == 52 ){ var4 = !var4;}
	if(evt.keyCode == 53 ){ var5 = !var5;}
	// }
}

window.onmousedown = function(event) { // Mouse pressed

	// mousePressed = true;
	// moveMouse(this.handle, event);

	// if(objectSelectable!=undefined){
	// 	if(objectSelectable){
	// 		scene.traverse(function(t){t.updateMatrixWorld()});

	// 		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	// 		projector.unprojectVector( vector, camera );
	// 		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	// 		var intersects = raycaster.intersectObjects( objects,true );

	// 		if(intersects.length>0){
	// 			intersects[0].object.material = new THREE.MeshLambertMaterial({color:0x00ffff});
	// 			reportParent(intersects[0].object);
	// 		}
	// 	}
	// }
}

function reportParent(obj){
	if(obj.joint == undefined){
		reportParent(obj.parent);
	}
	else
		console.log(obj);
}
window.onmouseup = function(event) {   // Mouse released
	mousePressed = false;
}
window.onmousemove = function(event) { // Mouse moved
	moveMouse(this.handle, event);
}

function moveMouse(handle, event) {
	var x = event.clientX;
	var y = event.clientY;

	var rect = event.target.getBoundingClientRect();
	if ( rect.left <= x && x <= rect.right &&
	  	rect.top  <= y && y <= rect.bottom ) {
		rmouseX = x;
		rmouseY = y;
		mouseX = x / rect.right;
		mouseY = y / rect.bottom;
		omouseX = mouseX-.5;
		omouseY = mouseY-.5;

	}
}

// Get a reference to the image element
 
// Take action when the image has loaded
function saveIMG(name) {
	var ctx = renderer.domElement;
	
    var imgAsDataURL = ctx.toDataURL("image/png");

    ctx.toBlob(function(blob) {
	  saveAs(blob, name);
	});
}

function orthoCam(){
	camera = new THREE.OrthographicCamera( 0, width, 0, height, 1, 100 );

}




		