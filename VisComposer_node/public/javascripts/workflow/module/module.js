viscomposer.workflow.Module = (function(){
	var Module = viscomposer.VObject.define("Module",null,function(){
        this.inputs = [];
        this.outputs = [];
        this.envOutputs = [];
        this.properties = {};
        this.category = null;
        this.type = null;
        this.label = null;
        this.ui = null;
	});

	var prototype = Module.prototype;

	prototype.init=function(){
        var setting = this.setting;
        this.label = setting.label;
        this.category = setting.category;
        this.type = setting.type;
        var inputs = setting.inputs;
        for(var i = 0, l = inputs.length; i < l; i++){
            var input = new viscomposer.workflow.Port(inputs[i].type, this);
            input.label = inputs[i].label;
            this.inputs.push(input);
        }
        var outputs = setting.outputs;
        for(i = 0, l = outputs.length; i < l; i++){
            var output = new viscomposer.workflow.Port(outputs[i].type, this);
            output.label = outputs[i].label;
            this.outputs.push(output)
        }
        var envOutputs = setting.envOutputs;
        for(i = 0, l = envOutputs.length; i < l; i++){
            var envOutput = new viscomposer.workflow.Port(envOutputs[i].type, this);
            envOutput.label = envOutputs[i].label;
            this.envOutputs.push(output)
        }
        this.setting = null;
	};

	prototype.update=function(){
        //TODO
	};

    prototype.getLinksFrom = function(){
        var links = [];
        var inputs = this.inputs;
        //TODO
        return links;
    };

    prototype.getLinksTo = function(){
        var links = [];
        var outputs = this.outputs;
        //TODO
        return links;
    };

	return Module;
})();