viscomposer.ui.ScenegraphWindow=(function(){

	var ScenegraphWindow = function(){
		//_scenegraphUI = new viscomposer.ui.ScenegraphUI(scenegraph);
		this.scenegraphUI = null;
		this.dom = null;
		this.uiInit();
		this.listener();
	};

	var prototype = ScenegraphWindow.prototype;

	prototype.uiInit = function(){
		this.dom = $("#scenegraphWindow")[0];
	};

	prototype.listener = function(){

	};

	prototype.highlight = function(){
		$(this.dom).children(".title").animate({"background-color": "#4897f0", color: 'white'}, 500);
		setTimeout('$("#scenegraphWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);
	};

	prototype.loadScenegraph = function(scenegraph){
		this.scenegraphUI = new viscomposer.ui.ScenegraphUI(scenegraph);
	};

	prototype.update = function(){

	};


	return ScenegraphWindow;
})();