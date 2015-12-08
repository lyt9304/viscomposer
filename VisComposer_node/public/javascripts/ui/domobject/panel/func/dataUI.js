/**
 * Created by huwanqi on 15-9-11.
 */
viscomposer.ui.DataUI = (function(){
    var dataUI = viscomposer.VObject.define("DataUI","FuncUI",function(module, workflow){
        viscomposer.ui.PrimitiveUI.call(this, module, workflow);
        this.uiInit();
        this.listener();
        this.update();
    });

    var prototype = dataUI.prototype;

    prototype.uiInit = function(){
        viscomposer.ui.FuncUI.prototype.uiInit.call(this);
        console.log("module-func-data:uiInit");
        var module = this.module;
        var dom = this.dom = $.parseHTML(
            '<div class="module data" id="' + this.uuid + '" style="left: ' + this.pos[0] + 'px; top: ' + this.pos[1] + 'px">' +
                '<div class="title">' +
                    '<span>' + module.label + '</span>' +
                '</div>' +
                '<div class="hr"></div>' +
                '<div class="content" style="height: 100px;">' +
                    '<div class="inputs"></div>' +
                    '<div class="outputs"></div>' +
                '</div>' +
            '</div>');
        this.inputsDom = $(dom).find('.inputs');
        this.outputsDom = $(dom).find('.outputs');
        $(dom).appendTo($(module.workflow.ui.container));
    };

    prototype.listener = function(){
        viscomposer.ui.FuncUI.prototype.listener.call(this);
        console.log("module-func-data: listener");
    };

    prototype.update = function(){
        viscomposer.ui.FuncUI.prototype.update.call(this);
        console.log("module-fuc-data:update");
        var dom = this.dom;
        $(dom).find(".string").hide();
    };

    return dataUI;
})();