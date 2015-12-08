/**
 * Created by vag on 2015/3/29.
 */
viscomposer.ui.workflowWindow.parallelcoordinatesPanel = function(module, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);
    this.module = module;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module
    this.workflowWindow = workflowWindow;

    this.ScaleXShow = false;
    this.ScaleYShow = false;

    this.module.pos = [700, 220];

    this.update();

};

viscomposer.ui.workflowWindow.parallelcoordinatesPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.parallelcoordinatesPanel.prototype.constructor = viscomposer.ui.workflowWindow.parallelcoordinatePanel;

viscomposer.ui.workflowWindow.parallelcoordinatesPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);
    var inputUI = this.module.input[0].ui;
    inputUI.linkOn = true;
    inputUI.update();

};

viscomposer.ui.workflowWindow.parallelcoordinatesPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

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