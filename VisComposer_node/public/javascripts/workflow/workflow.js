viscomposer.workflow.Workflow = (function(){

	var Workflow=viscomposer.VObject.define("Workflow",null,function(node,options){
		options = options||{};
        this.node = node;
        this.label = 'Workflow';
        this.funName = 'Workflow';
        this.resName = 'result';
        this.header = new viscomposer.workflow.WorkflowHeader(this);
        this.arrayModule = null;
        this.moduleList = {};
        this.moduleFunNames = {};
        this.linkList = {};
        this.ui = null;
        this.properties = {
            num: 1
        };
	});

	var prototype = Workflow.prototype;

	prototype.update = function(){
		this.header.update();
        this.updateInputs();
        var moduleList = this.moduleList;
        for(var key in moduleList){
            moduleList[key].update();
        }
        var linkList = this.linkList;
        for(var key in linkList){
            linkList[key].update();
        }
	};

    prototype.updateInputs = function(){
        var header = this.header;
        var importedDataInputs = header.importedDataInputs;
        for(var i = 0, l = importedDataInputs.length; i < l; i++){
            importedDataInputs[i].update();
        }
        var inputs = header.inputs;
        for(i = 0, l = inputs.length; i < l; i++){
            inputs[i].update();
        }
    };

    prototype.addModule = function(category, type){
        var registry = viscomposer.registry[category];
        var moduleClass = registry[type];
        var module = new moduleClass(this);
        module.workflow = this;
        this.moduleList[module.uuid] = module;
        //if(module.type === 'array'){
        //    this.arrayModule = module;
        //}
        if(category == 'array'){
            this.arrayModule = module;
        }else if(category == 'primitive'){

        }
        return module;
    };

    prototype.removeModule=function(module){
        if(this.arrayModule===module){
            this.arrayModule=null;
        }
        module.destroy();
    };

    prototype.addData = function(dataInfo){
        this.header.addData(dataInfo);
    };

    prototype.addLink = function(port1, port2){
        var link = new viscomposer.workflow.Link(port1, port2);
        if(port2.module){
            port2.module.update();
        }else if(port2.workflow){
            port2.workflow.update();
        }
        this.linkList[link.uuid] = link;
        return link;
        //TODO render
    };

    prototype.removeLink = function(link){
        this.linkList[link.uuid] = null;
        link.destroy();
    };

	prototype.topoSort = function(){};

    return Workflow;

})();
