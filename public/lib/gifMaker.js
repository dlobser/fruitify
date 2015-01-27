function gifMaker(inScene, inRenderer){

	this.scene = inScene || scene;
	this.renderer = inRenderer || renderer;

	this.c = 0;
	this.animCamera = new THREE.PerspectiveCamera( 80, 1, 1, 1000 );
	this.ctx = this.renderer.domElement;
	this.needsUpdate = false;

}

gifMaker.prototype.makeGif = function(){
	this.needsUpdate = true;
}

gifMaker.prototype.render = function(){

	if(this.needsUpdate){

		if(this.c==0){
			this.gif = new GIF({workers:4,quality:1});
			var that = this;
			this.gif.on('finished', function(blob) {
				window.open(URL.createObjectURL(blob));
				renderer.setSize(window.innerWidth, window.innerHeight);
				that.gif.frames = [];
				that.gif.imageParts = [];
			});
			this.gifShader();
			this.tempVal = sliders[0].slider("value");
		}
		

		sliders[0].slider("value", 40 + Math.floor((.5+(Math.sin((this.c/14) * Math.PI)/2)) * 50));

		// console.log(10 + Math.floor((.5+(Math.sin((this.c/31) * Math.PI * 2)/2)) * 80));

		this.postShader.uniforms["time"].value = this.c*.023;
		this.animCamera.position.y = Math.random()*.5;
		var off = 0;
		if(!isSymmetrical)
			off=Math.PI;
		this.animCamera.position.x = Math.sin(off+Math.sin((this.c/15)*Math.PI*2)*.3)*50;
		this.animCamera.position.z = Math.cos(off+Math.sin((this.c/15)*Math.PI*2)*.3)*50;
		this.animCamera.lookAt(new THREE.Vector3 (0.0, Math.random()*.5, 0.0));
		this.renderer.setSize(275, 275);
		this.renderer.render( this.scene, this.animCamera, this.fatTexture, true );
		this.renderer.render(this.rScene,this.rCam);

		if(this.c<16){
			console.log(this.c);
			if(this.c>0)
				this.gif.addFrame(this.ctx, {copy:true, delay: 2});
		}
		else{
			console.log('done');
			this.c=-1;
			this.gif.render();
			this.gif.running = false;
			this.renderer.setSize(this.width, this.height);
			this.needsUpdate = false;
			sliders[0].slider("value", this.tempVal);
		}
		this.c++;
	}

}


gifMaker.prototype.gifShader = function(){

	this.noiser = "\
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

	this.fatTexture = new THREE.WebGLRenderTarget( 2048,2048, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat } );

	var vertRT = "\
		varying vec2 vUv;\
		uniform float time;\
		void main() {\
			vUv = uv;\
			gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position.x,position.y,position.z), 1.0 );\
		}\
	";

	var fragRT="\
		varying vec2 vUv;\
		uniform float time;\
		uniform sampler2D fatTexture;\
		vec3 gamma(vec3 inv){\
			return vec3(pow(inv.x,.8),pow(inv.y,.9),pow(inv.z,1.2));\
		}\
		void main() {\
			vec2 nUv = vec2(vUv.x+noise((vUv*100.)),vUv.y*((vUv*120.)));\
			float n = turbulence(vec3(15.*noise(nUv*10.*time)+nUv*220.+nUv.y,time*30.))*.3;\
			float vig = sqrt((vUv.x-.5)*(vUv.x-.5)+(vUv.y-.5)*(vUv.y-.5));\
			vig*=-1.;\
			vig+=1.5;\
			vec3 vigC = vec3(.2,.6,.8);\
			vec4 fat = texture2D(fatTexture, vUv);\
			vec4 fat2 = texture2D(fatTexture, vec2(vUv.x+(sin(n*3.1415*2.)*.002),vUv.y+(cos(n*3.1415*2.)*.002)));\
			vec4 fat3 = texture2D(fatTexture, vec2(vUv.x+(.025-(sin(n*3.1415*2.)*.05)),vUv.y+(.025-(cos(n*3.1415*2.)*.05))));\
			vec3 vignette = ((fat2.a*-1.)+1.)*(vigC * ( vig*vig + .1*noise(vec2(time*30.))));\
			gl_FragColor = vec4(gamma(((fat3.xyz*.5 + fat2.xyz*1.5)/1.75) + vec3(  (n*n) * 2. + vignette )), 1.);\
		}\
	";

	this.postShader = new THREE.ShaderMaterial( {
		uniforms: {
			fatTexture: { type: "t", value: this.fatTexture },
			time:{type:"f",value:0} },
			vertexShader: vertRT,
			fragmentShader: this.noiser+fragRT,
			depthWrite: false
	});

	var geo = new THREE.PlaneGeometry(100,100,10,10);	
	this.pln = new THREE.Mesh(geo,this.postShader);
	this.rScene = new THREE.Scene();
	this.rScene.add(this.pln);
	this.rCam = new THREE.OrthographicCamera( -50, 50, 50, -50, 1, 100 );
	this.rCam.position.z = 100;


}