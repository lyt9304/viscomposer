viscomposer.ui.ModuleUI=(function(){
	var ModuleUI = viscomposer.VObject.define("ModuleUI","DOMObject",function(module,workflow){
        this.module = module;
        module.ui = this;
        this.workflow = workflow;
        this.dom = null;
	});

	var prototype = ModuleUI.prototype;

    prototype.uiInit = function(){
        console.log("module: ui initializing");
    };

    prototype.listener = function(){
        console.log("module: listener");
        var dom = this.dom;
        var that = this;
        $(dom).draggable({
            drag: function(){
                that.module.workflow.ui.updateLinks();
            },
            stop: function(){
                var left = parseFloat($(this).css("left"));
                var top = parseFloat($(this).css("top"));
                that.pos = [left, top];
                that.updateLinks();
            },
        });
    };

    prototype.update = function(){
        console.log("module: updating");
        var dom = this.dom;
        var that = this;
        var module = this.module;
        //update input
        var inputs = module.inputs;
        for(var i = 0, l = inputs.length; i < l; i++){
            if(inputs[i].ui){
                inputs[i].ui.update();
            }else{
                new viscomposer.ui.InputUI(inputs[i]);
            }
        }
        //update output
        var outputs = module.outputs;
        for(i = 0, l = outputs.length; i < l; i++){
            if(outputs[i].ui){
                outputs[i].ui.update();
            }else{
                new viscomposer.ui.OutputUI(outputs[i]);
            }
        }
        //update links
        this.updateLinks();

        //update 自己的ui
        $(dom).find(".content").css("height", function(){
            var inputsDomH = $(that.inputsDom).height();
            var inputsDomW = $(that.outputsDom).width();
            return (((inputsDomH - inputsDomW) > 0) ? inputsDomH : inputsDomW)  + 10;
        });
        $(dom).css({left: this.pos[0], top: this.pos[1]});
    };

    prototype.updateLinks = function(){
        var linksFrom = this.module.getLinksFrom;
        for(var i = 0, l = linksFrom.length; i < l; i++){
            linksFrom[i].ui.update();
        }
        var linksTo = this.module.getLinksTo;
        for(i = 0, l = linksTo.length; i < l; i++){
            linksTo[i].ui.update();
        }
    };

	return ModuleUI;
})();