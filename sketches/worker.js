self.addEventListener('message', function(e) {
	importScripts('../lib/three.js');
	
	var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.SplineCurve3(e.data.curves), e.data.detail), new THREE.MeshLambertMaterial({
			color: e.data.color
		}));

	// e.data.obj = sp;
	// 
	// tube = [1,2];

	self.postMessage({
		type: 'results',
		data: {
			tube:tube
		}
	});		
}, false);