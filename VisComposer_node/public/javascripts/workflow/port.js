viscomposer.workflow.Port = (function(){
	var Port = viscomposer.VObject.define("Port", null, function(type, module){
        this.label = "";
        this.value = 0;
        this.module = module;
		this.imported = false; //用来标记workflow的input是否直接导入的数据
	    var linkType;
	    switch(type){
	    case 'input':case 'map':
	        linkType = 'input'; break;
	    case 'output':case 'geometry':case 'transform':case 'data':case 'scale':case 'array':
	        linkType = 'output'; break;
	    default:
	        linkType = 'none';
	    }
        this.linkType = linkType;
    	this.linkFrom = null;
    	this.linkTo={};
	});

	var prototype = Port.prototype;

	prototype.init=function(){
		//TODO
	};

	prototype.prepare=function(){

	};

	prototype.update=function(){

	};

	return Port;
})();