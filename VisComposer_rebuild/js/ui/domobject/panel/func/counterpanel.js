/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.counterPanelUI= (function(){
    var counterPanelUI=viscomposer.VObject.define("counterPanelUI","ModuleUI",function(Module, workflowWindow){
            //this.module = module;
            this.productive = true;
            this.obj.ui = this;
            this.workflowWindow = workflowWindow;
            this.selectedCol = null;
            this.update();
        }
    );

    var prototype=counterPanelUI.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var module = this.obj;
        var input = module.input[0];
        var inputUI = input.ui;
        inputUI.linkOn = true;
        inputUI.update();
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
            .append(
            '<div class="module counter" id="' + that.uuid + '">' +
            '<div class="title"><span>' + module.label + '</span></div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs"></div>' +
            '<div class="outputs"></div>' +
            '<div class="option">' +
            '<div class="sectionNum">section number: <input type="text"></div>' +
            '</div>' +
            '</div></div>');

        var inputDom = $(that.elSelector + ' .sectionNum input');
        inputDom.val(that.module.properties.sectionNum);
        inputDom.on("change", function(){
            that.module.properties.sectionNum = $(this).val();
            viscomposer.app.tryRender();
        });
    };

    return counterPanelUI;
})();



