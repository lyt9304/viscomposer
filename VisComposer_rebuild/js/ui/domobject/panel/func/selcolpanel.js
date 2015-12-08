/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.selcolPanelUI= (function(){
    var selcolPanelUI=viscomposer.VObject.define("selcolPanelUI","ModuleUI",function(Module, workflowWindow){
            Module.productive = true;
            this.update();
        }
    );

    var prototype=selcolPanelUI.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var input = this.obj.input;
        for(var i = 0; i < input.length; i++)
        {
            input[i].ui.onSwitch();
            input[i].ui.update();
        }
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.ui.uuid + " > .content").append(
            '<div class="module colsel" id="' + that.uuid + '">' +
            '<div class="title" id="title-' + that.uuid + '">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div></div></div>');
    };

    return selcolPanelUI;
})();



