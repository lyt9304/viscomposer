/**
 * Created by huwanqi on 15-9-7.
 */
viscomposer.ui.CircleUI = (function(){
    var circleUI = viscomposer.VObject.define("CircleUI","PrimitiveUI",function(module, workflow){
        viscomposer.ui.PrimitiveUI.call(this, module, workflow);
        this.uiInit();
        this.listener();
        this.update();
    });

    var prototype = circleUI.prototype;

    prototype.uiInit = function(){
        viscomposer.ui.PrimitiveUI.prototype.uiInit.call(this);
        console.log('module-primitive-view:ui initializing');
        //var module = this.module;
        //var dom = this.dom = $.parseHTML(
        //    '<div class="module '+ module.type.toLowerCase() +' ui-draggable ui-draggable-handle" id="' + this.uuid + '" style="left: 0; top: 0;">' +
        //    '<div class="title">' +
        //    '<span>' + module.label + '</span>' +
        //    '<img src="' + (module.arrayIcon||viscomposer.app.imgPool[module.type.toLocaleLowerCase()]) + '">' +
        //    '</div>' +
        //    '<div class="hr"></div>' +
        //    '<div class="content">' +
        //    '<div class="inputs">' +
        //    '</div>' +
        //    '<div class="outputs"></div>' +
        //        //this.modifierStr+
        //    '</div></div>');
        //$(dom).appendTo($(module.workflow.ui.dom));
    };

    prototype.listener = function(){
        viscomposer.ui.PrimitiveUI.prototype.listener.call(this);
        console.log('module-primitive-view: listener');
    };

    prototype.update = function(){
        viscomposer.ui.PrimitiveUI.prototype.update.call(this);
        console.log("module-primitive-view:updating");
        //update 自己的ui
        //update input
        //update output
        //update links
    };

    return circleUI;
})();
