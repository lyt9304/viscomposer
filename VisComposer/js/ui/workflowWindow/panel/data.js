/**
 * Created by vag on 2015/3/6.
 */

viscomposer.ui.workflowWindow.dataPanel = function(dataModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this,dataModule, workflowWindow);

    this.productive = true;

    this.update();

    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.dataPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.dataPanel.prototype.constructor=viscomposer.ui.workflowWindow.dataPanel;

viscomposer.ui.workflowWindow.dataPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    $(this.elSelector + ' .string').css("display", "none");

};

viscomposer.ui.workflowWindow.dataPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

//    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
//            '<div class="module data" id="' + that.uuid + '">' +
//            '<div class="title" id="title-' + that.uuid + '">' +
//            '<span>' + module.label + '</span>' +
//            '</div><div class="content">' +
//            '<div class="inputs">' +
//            '</div>' +
//            '<div class="outputs">' +
//            '</div></div></div>');

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
        .append(
            '<div class="module data" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content" style="height: 100px;">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div>' +
            '</div>' +
            '</div>');


};