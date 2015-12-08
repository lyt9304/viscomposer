/**
 * Created by vag on 2015/3/22.
 */
/**
 * Created by vag on 2015/3/12.
 */
viscomposer.ui.workflowWindow.scatterplotPanel = function(module, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);
    this.module = module;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module
    this.workflowWindow = workflowWindow;

    this.ScaleXShow = false;
    this.ScaleYShow = false;

    this.module.pos = [260, 175];

    this.update();
    //console.log("panel updating");

    this.switchClick();

};

viscomposer.ui.workflowWindow.scatterplotPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.scatterplotPanel.prototype.constructor = viscomposer.ui.workflowWindow.scatterplotPanel;

viscomposer.ui.workflowWindow.scatterplotPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);
    var input = this.module.input;

    for(var i = 0; i < input.length; i++)
    {

        input[i].ui.onSwitch();
        input[i].ui.update();

    }

};

viscomposer.ui.workflowWindow.scatterplotPanel.prototype.switchClick = function() {

    var that = this;
    var thisPos = that.module.pos;

    $(that.elSelector + ' .switchX').on("click", function(){

        var scaleX = that.module.properties.scaleX;
        var scaleXUI = scaleX.ui;
        if(!that.ScaleXShow)
        {
            scaleX.pos = [parseFloat(thisPos[0])+199, parseFloat(thisPos[1])-200];
            if(scaleXUI)
            {

                scaleXUI.update();
                $(scaleXUI.elSelector).css("display", "block");
            }
            else
            {
                scaleXUI = viscomposer.app.Factory.createPanel(scaleX, that);
            }
        }
        else
        {
            $(scaleXUI.elSelector).css("display", "none");
        }
        that.ScaleXShow = !that.ScaleXShow;

    });

    $(that.elSelector + ' .switchY').on("click", function(){

        var scaleY = that.module.properties.scaleY;
        var scaleYUI = scaleY.ui;
        if(!that.ScaleYShow)
        {
            scaleY.pos = [parseFloat(thisPos[0])+199, parseFloat(thisPos[1])-200];
            if(scaleYUI)
            {
                scaleYUI.update();
                $(scaleYUI.elSelector).css("display", "block");
            }
            else
            {
                scaleYUI = viscomposer.app.Factory.createPanel(scaleY, that);
            }
        }
        else
        {
            $(scaleYUI.elSelector).css("display", "none");
        }
        that.ScaleYShow = !that.ScaleYShow;

    });

};

viscomposer.ui.workflowWindow.scatterplotPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module scatterplot" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (that.module.layoutIcon||viscomposer.app.imgPool["blankview"]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
            '<div class="modifier"><div class="switchX">X</div><div class="switchY">Y</div></div>' +
            '</div></div>');


};