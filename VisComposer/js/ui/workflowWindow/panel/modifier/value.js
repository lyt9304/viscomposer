/**
 * Created by vag on 2015/3/22.
 */
viscomposer.ui.workflowWindow.valueModifierPanel = function(modifier){

    viscomposer.ui.workflowWindow.panel.call(this, modifier);
    this.module = modifier;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module

    this.update();

    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.valueModifierPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.valueModifierPanel.prototype.constructor = viscomposer.ui.workflowWindow.valueModifierPanel;

viscomposer.ui.workflowWindow.valueModifierPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

};

viscomposer.ui.workflowWindow.valueModifierPanel.prototype.createDom = function(){
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

viscomposer.ui.workflowWindow.valueModifierPanel.prototype.draggableListener = function(){

    var that = this;

    $(that.elSelector).draggable();

};