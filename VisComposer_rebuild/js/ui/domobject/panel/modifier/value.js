/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.valueModifierPanel= (function(){
    var valueModifierPanel=viscomposer.VObject.define("valueModifierPanel","ModuleUI",function(modifier){
            this.obj= modifier;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module

            this.update();
        }
    );

    var prototype=valueModifierPanel.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        var that = this;

        $("#workflowWindow").append(
            '<div class="module scale value" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>value mapping</span></div><div class="hr"></div>' +
            '<div class="content">' +
            '<div class="item">' +
            '<div class="label">Pos_x</div>' +
            '<input type="text" value="0">' +
            '</div>' +
            '</div>' +
            '<div class="confirm">OK</div>' +
            '</div>'
        );
    };

    prototype.draggableListener = function(){

        var that = this;

        $(that.elSelector).draggable();

    };

    return valueModifierPanel;
})();


