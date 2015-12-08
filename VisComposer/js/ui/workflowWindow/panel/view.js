/**
 * Created by vag on 2015/3/15.
 */

viscomposer.ui.workflowWindow.viewPanel = function(viewModule, workflowWindow){
    viscomposer.ui.workflowWindow.panel.call(this, viewModule, workflowWindow);
    this.module.productive = false; //能否直接拉出一个module
    this.module.pos = [580, 150];
    this.update();
};

viscomposer.ui.workflowWindow.viewPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.viewPanel.prototype.constructor = viscomposer.ui.workflowWindow.filterpanel;

viscomposer.ui.workflowWindow.viewPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    var input = this.module.input;

    for(var i = 0; i < input.length; i++)
    {
        input[i].ui.onSwitch();
        input[i].ui.update();
    }


};

viscomposer.ui.workflowWindow.viewPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module view" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["blankview"]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div></div></div>');

};
