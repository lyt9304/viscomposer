/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.verticalarrayPanel = (function(){
    var verticalarrayPanel=viscomposer.VObject.define("verticalarrayPanel","ModuleUI",function(module, workflow){

            this.obj = module;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module
            this.workflowWindow = workflow;

            this.ScaleXShow = false;
            this.ScaleYShow = false;

            this.module.pos = [700, 220];

            this.update();

        }
    );

    var prototype=verticalarrayPanel.prototype;

    prototype.createDOM = function(){

        var that = this;
        //this.elSelector=".module#"+this.uuid;

        var module = that.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module parallelcoordinates" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["blankview"]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
            '</div></div>');


    };

    prototype.update = function(){

        //TODO
        viscomposer.ui.ModuleUI.prototype.update.apply(this);
        var inputUI = this.obj.input[0].ui;
        inputUI.linkOn = true;
        inputUI.update();
    };

    return verticalarrayPanel;
})();





