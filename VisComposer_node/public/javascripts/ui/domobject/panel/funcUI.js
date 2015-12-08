/**
 * Created by huwanqi on 15-8-28.
 */
viscomposer.ui.FuncUI=(function(){
    var funcUI = viscomposer.VObject.define("FuncUI","ModuleUI",function(module, workflow){
        viscomposer.ui.ModuleUI.call(this, module, workflow);
        this.pos = [200, 200];
    });

    var prototype = funcUI.prototype;

    prototype.uiInit = function(){
        viscomposer.ui.ModuleUI.prototype.uiInit.call(this);
        console.log('module-func:ui initializing');

    };

    prototype.listener = function(){
        viscomposer.ui.ModuleUI.prototype.listener.call(this);
        console.log('module-func: listener');
    };

    prototype.update = function(){
        viscomposer.ui.ModuleUI.prototype.update.call(this);
        console.log("module-func:updating");
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
    };

    return funcUI;
})();