/**
 * Created by vag on 2015/3/19.
 */
viscomposer.ui.workflowWindow.rectPanel = function(circleModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this,circleModule, workflowWindow);
    this.module = circleModule;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module
    this.workflowWindow = workflowWindow;

    this.module.pos=[370, 100];

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.rectPanel.prototype = Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.rectPanel.prototype.constructor = viscomposer.ui.workflowWindow.rectPanel;

viscomposer.ui.workflowWindow.rectPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    var input = this.module.input;

    for(var i = 0; i < input.length; i++)
    {

        input[i].ui.onSwitch();
        input[i].ui.update();

    }

};

viscomposer.ui.workflowWindow.rectPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
            '<div class="module rect" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["rectangle"]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div></div></div>');


};
