viscomposer.ui.DOMObject=(function(){
	var DOMObject=viscomposer.VObject.define("DOMObject",null,function(){
		this.obj=null;
		this.dom=null;
		this.container=null;
		this.parentDom=null;

		update.call(this);
	},["obj","dom","container","parentDom"]);

	var prototype=DOMObject.prototype;

	var update=prototype.update=function(){
		//TODO
	};

	prototype.appendTo=function(parentDom){
		$(this.dom).appendTo(parentDom);
		this.parentDom=parentDom;
	};

	return DOMObject;
})();