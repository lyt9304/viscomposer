/**
 * Created by vag on 2015/3/29.
 */
viscomposer.ui.PrimitiveUI = (function(){
    var PrimitiveUI = viscomposer.VObject.define("PrimitiveUI","ModuleUI",function(module, workflow){
        viscomposer.ui.ModuleUI.call(this, module, workflow);
        this.pos = [200, 200];
    });

    var prototype = PrimitiveUI.prototype;

    prototype.uiInit = function(){
        viscomposer.ui.ModuleUI.prototype.uiInit.call(this);
        console.log('module-primitive:ui initializing');
        var module = this.module;
        var dom = this.dom = $.parseHTML(
            '<div class="module '+ module.type.toLowerCase() +'" id="' + this.uuid + '" style="left: ' + this.pos[0] + 'px; top: ' + this.pos[1] + 'px;">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            //'<img src="' + (module.arrayIcon||viscomposer.app.imgPool[module.type.toLocaleLowerCase()]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
                //this.modifierStr+
            '</div>' +
            '</div>');
        this.inputsDom = $(dom).find('.inputs');
        this.outputsDom = $(dom).find('.outputs');
        $(dom).appendTo($(module.workflow.ui.container));

    };

    prototype.listener = function(){
        viscomposer.ui.ModuleUI.prototype.listener.call(this);
        console.log('module-primitive: listener');

    };

    prototype.update = function(){
        viscomposer.ui.ModuleUI.prototype.update.call(this);
        console.log("module-primitive:updating");
    };

    return PrimitiveUI;
})();





