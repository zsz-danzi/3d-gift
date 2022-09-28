
/*==============================
 * Project: 3D-礼物
 * Description: 个性化
 * @author: danzizhong
 * Time：2018.02.29
=================================*/	

function Gift(){
	this.clock = new THREE.Clock();
	this.mixers = [];
}

Gift.prototype.init = function(opt){

	console.time('run');

	var self = this;
	this.obj = document.getElementById(opt.id);
	this.model_url = opt.model_url;
	this.img_url = opt.img_url;
	this.color = opt.color;
	this.play = opt.play || false;
	this.finger_move = opt.finger_move || false;
	this.callback = opt.callback;
	this.loadFn = opt.loadFn;

	this.scale = window.innerWidth / 375 ;

	//three.js 初始化
	this.threes_init();

	//设置模型
	this.loadModel(function(object){

		self.object = object;
		self.object.scale.set(.44,.44,.44);
		if(!this.play) self.object.scale.set(.44*self.scale,.44*self.scale,.44*self.scale);
		// self.object.scale.set(.8,.8,.8);
		self.object.position.set(-60, 0 ,-60);

		//设置色值
		self.setColor(self.color);

		//设置纹理
		self.setTexture(self.img_url,function(){

			//添加阴影
			self.object.traverse( function ( child ) {

				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}

			});

			if(self.play){
				//设置动画
				self.gift_animate();	
			}

			self.scene.add( self.object );


			//添加手指滑动事件
			if(self.finger_move){
				self.speedx = 0;
				self.lon = 0;
				self.theta = 0;
				self.obj.addEventListener( 'touchstart', self.onDocumentMouseDown.bind(self), false );
	        	self.obj.addEventListener( 'touchmove', self.onDocumentMouseMove.bind(self), false );
	        	// self.obj.addEventListener( 'touchend', self.onDocumentMouseUp, false );	
			};

			self.animate();

			self.loadFn && self.loadFn();

			// self.renderer.render( self.scene, self.camera );
			console.timeEnd('run');

		});


	});


	return this;
}

Gift.prototype.threes_init = function(){
	var self = this;

	// this.camera = new THREE.PerspectiveCamera( 45, this.obj.offsetWidth / this.obj.offsetHeight, 1, 2000 );
	this.camera =new THREE.OrthographicCamera(this.obj.offsetWidth/-2,this.obj.offsetWidth/2,this.obj.offsetHeight/2,this.obj.offsetHeight/-2,1,2000);

	this.camera.position.set( 200, 300, 200 );
	this.camera.lookAt(0,120,0);

	this.scene = new THREE.Scene();
	// this.scene.background = new THREE.Color( 0xa0a0a0 );
	// this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

	//半球光 光源
	// var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	// light.position.set( 0, 200, 0 );
	// this.scene.add( light );

	//聚光灯 光源
	// var spotLight = new THREE.SpotLight(0xffffff);
	// spotLight.position.set(0,400,-200);
	// spotLight.intensity = .8;
	// this.scene.add( spotLight );
	// console.log(spotLight)

	//点光源
	if(!this.play){
		var pointLight = new THREE.PointLight( 0xffffff, 4, 300 , 1); //PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
		pointLight.position.set(-60,400,-60);
		this.scene.add( pointLight );
	}

	//环境光
	var ambientLight = new THREE.AmbientLight(0xffffff);
	this.scene.add(ambientLight);

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 50, 200, 100 );
	light.castShadow = true;
	light.shadow.camera.top = 180;
	light.shadow.camera.bottom = -100;
	light.shadow.camera.left = -120;
	light.shadow.camera.right = 120;

	light.intensity = .7;
	this.scene.add( light );

	//ground
	// var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	// mesh.rotation.x = - Math.PI / 2;
	// mesh.receiveShadow = true;
	// this.scene.add( mesh );

	var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
	grid.material.opacity = 0.2;
	grid.material.transparent = true;
	// this.scene.add( grid );

	this.renderer = new THREE.WebGLRenderer( { 
		antialias: true ,
		alpha : true   //渲染透明
	} );

	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize( this.obj.offsetWidth, this.obj.offsetHeight );
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	this.obj.appendChild( this.renderer.domElement );

	window.addEventListener( 'resize', self.resize.bind(self) , false );	
}

Gift.prototype.resize = function(){
	this.camera.aspect = this.obj.offsetWidth / this.obj.offsetHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( this.obj.offsetWidth, this.obj.offsetHeight );	
}

Gift.prototype.gift_animate = function(){

	//动画
	this.object.mixer = new THREE.AnimationMixer( this.object );
	this.mixers.push( this.object.mixer );

	this.action = this.object.mixer.clipAction( this.object.animations[ 0 ] );

	this.action.setLoop(THREE.LoopRepeat,1,this.callback);
	this.action.clampWhenFinished = true;  //是否停留最后一帧
	this.action.play();

}

//设置颜色
Gift.prototype.setColor = function(color){
	// console.log(this.object)

	if(!this.object) return;

	var HSL = new THREE.Color( color ).getHSL({ h: 0, s: 0, l: 0 });
	HSL.s *= 0.5;

	//上色
	var ribbon1 = this.object.getObjectByName('sidai_1');
	var ribbon2 = this.object.getObjectByName('sidai_2');
	var ribbon3 = this.object.getObjectByName('sidai_3');
	var ribbon4 = this.object.getObjectByName('sidai_4');
	var ribbon5 = this.object.getObjectByName('sidai_5');
	var ribbon6 = this.object.getObjectByName('sidai_6');
	var ribbon7 = this.object.getObjectByName('sidai_7');
	var ribbon8 = this.object.getObjectByName('sidai_8');

	for(var i=0; i<8; i++){
		var ribbon = eval('ribbon'+(i+1));
		if(!ribbon) return;

		ribbon.material.color = new THREE.Color( color );
		ribbon.material.specular = new THREE.Color().setHSL( HSL.h, HSL.s, HSL.l );
		ribbon.material.reflectivity = 0.5;
		ribbon.material.shininess = 30;
	}


}

//设置纹理
Gift.prototype.setTexture = function(url,callback){

	var box1 = this.object.getObjectByName('hezi');
	var box2 = this.object.getObjectByName('gaizi_1');
	var box3 = this.object.getObjectByName('gaizi_2');

	var textureloader1 = new THREE.TextureLoader();
	
	textureloader1.load(url,function(texture){
		var texture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1);							
		box1.material.map = texture;
		box1.material.needsUpdate = true;					
		box3.material.map = texture;
		box3.material.needsUpdate = true;
	});

	var textureloader2 = new THREE.TextureLoader();
	textureloader2.load(url,function(texture){
		var texture = texture;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1.05, 0.37);							
		box2.material.map = texture;
		box2.material.needsUpdate = true;

		//回调函数
		callback && callback();
	});

}

//加载模型
Gift.prototype.loadModel = function(callback){

	var loader = new THREE.FBXLoader();
	loader.load( this.model_url , function ( object ) {
		callback && callback(object);
	} );	

}

Gift.prototype.remove = function(){
	if(this.action){
		this.action.paused = true;
	}
	this.scene.remove( this.object );
	this.obj.removeChild( this.renderer.domElement );
}

Gift.prototype.animate = function(){

	requestAnimationFrame( this.animate.bind(this) );

	if ( this.mixers.length > 0 ) {
		for ( var i = 0; i < this.mixers.length; i ++ ) {

			this.mixers[ i ].update( this.clock.getDelta() );

		}
	}

	if(this.finger_move){

        this.theta = THREE.Math.degToRad( this.lon );

        //缓冲运动 速度 = （目标 - 当前）/ 摩擦系数
        this.object.rotation.y += (this.theta - this.object.rotation.y) * 0.15 ;  

	}

	this.renderer.render( this.scene, this.camera );

}

//添加旋转事件
Gift.prototype.onDocumentMouseDown = function(ev){

    this.prex = ev.touches[0].clientX; 
    this.prey = ev.touches[0].clientY;  

}

Gift.prototype.onDocumentMouseMove = function(ev){
    ev.preventDefault();

    //速度（偏移量）
    // this.speedx = (ev.touches[0].clientX - this.prex) * 0.5;
    this.speedx = (ev.touches[0].clientX - this.prex) * Math.max(Math.abs((ev.touches[0].clientX - this.prex)),8) * 0.05;

    this.lon+=this.speedx;
	this.prex = ev.touches[0].clientX;
}
