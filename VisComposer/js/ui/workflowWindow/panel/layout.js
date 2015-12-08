/**
 * Created by vag on 2015/3/15.
 */

viscomposer.ui.workflowWindow.layoutPanel = function(layoutModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this,layoutModule, workflowWindow);
    this.module = layoutModule;
    this.productive = true; //能否直接拉出一个module
    this.module.ui = this;
    this.workflowWindow = workflowWindow;

    this.update();

};

viscomposer.ui.workflowWindow.layoutPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.layoutPanel.prototype.constructor = viscomposer.ui.workflowWindow.filterpanel;

viscomposer.ui.workflowWindow.layoutPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

};

viscomposer.ui.workflowWindow.layoutPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
            '<div class="module layout" id="' + that.uuid + '">' +
            '<div class="title" id="title-' + that.uuid + '">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["blankview"]) + '">' +
            '</div><div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div></div></div>');


};
