/**
 * Created by vag on 2015/3/29.
 */
viscomposer.ui.workflowWindow.counterPanel = function(module, workflowWindow){
    viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);
    this.module = module;
    this.productive = true;
    this.module.ui = this;
    this.workflowWindow = workflowWindow;
    this.selectedCol = null;
    this.update();
};

viscomposer.ui.workflowWindow.counterPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.counterPanel.prototype.constructor = viscomposer.ui.workflowWindow.counterPanel;

viscomposer.ui.workflowWindow.counterPanel.prototype.update = function(){

    var that = this;

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    var module = that.module;
    var input = module.input[0];
    var inputUI = input.ui;
    inputUI.linkOn = true;
    inputUI.update();

};
viscomposer.ui.workflowWindow.counterPanel.prototype.createDom = function(){

    var that = this;
    var module = that.module;

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
