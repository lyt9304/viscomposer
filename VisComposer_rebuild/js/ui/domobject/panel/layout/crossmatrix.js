/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.crossmatrixPanel = (function(){
    var crossmatrixPanel=viscomposer.VObject.define("crossmatrixPanel","ModuleUI",function(module, workflowWindow){

            this.obj = module;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module
            this.workflowWindow = workflowWindow;

            this.obj.pos = [700, 220];

            this.update();

        }
    );

    var prototype=crossmatrixPanel.prototype;

    prototype.createDOM = function(){

        var that = this;
        //this.elSelector=".module#"+this.uuid;

        var module = that.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module crossmatrix" id="' + that.uuid + '">' +
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
        var input = this.obj.input;

        for(var i = 0; i < input.length; i++)
        {

            input[i].ui.onSwitch();
            input[i].ui.update();

        }

    };

    return crossmatrixPanel;
})();





