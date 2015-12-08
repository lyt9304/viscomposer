/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.directModifierPanel= (function(){
    var directModifierPanel=viscomposer.VObject.define("directModifierPanel","ModuleUI",function(modifier){
            this.obj= modifier;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module

            this.update();
        }
    );

    var prototype=directModifierPanel.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);
        $(this.elSelector + ' .content input').val(this.module.modifierStr);
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        var modifierStr = that.module.modifierStr || '';

        $("#workflowWindow").append(
            '<div class="module modifier direct" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>Direct mapping</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<input type="text" value=' + modifierStr + '>' +
            '</div>' +
            '<div class="confirm">OK</div>' +
            '</div>'
        );

        $(that.elSelector + ' .confirm').on("click", function(){

            var mappingRule = $(that.elSelector + ' input').val();
            that.module.modifierStr=mappingRule;
            that.module.submit();

            $(that.elSelector).css('display','none');

        });
    };

    prototype.draggableListener = function(){

        var that = this;

        $(that.elSelector).draggable();

    };

    return directModifierPanel;
})();


