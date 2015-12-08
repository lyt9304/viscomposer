/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.selcolPanel = function(selcolModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this,selcolModule, workflowWindow);

    selcolModule.productive = true;

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.selcolPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.selcolPanel.prototype.constructor=viscomposer.ui.workflowWindow.selcolPanel;

viscomposer.ui.workflowWindow.selcolPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    var input = this.module.input;

    for(var i = 0; i < input.length; i++)
    {

        input[i].ui.onSwitch();
        input[i].ui.update();
        //console.log("input updating");

    }

};

viscomposer.ui.workflowWindow.selcolPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module colsel" id="' + that.uuid + '">' +
            '<div class="title" id="title-' + that.uuid + '">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div></div></div>');


};

viscomposer.ui.workflowWindow.selcolPanel.prototype.updateInputPorts = function(){

    var that = this;

    var input = that.module.input;

    if(!input){return;}

    for(var i = 0; i < input.length; i++)
    {

        if(input[i].ui)
        {
            input[i].ui.update();
        }
        else
        {
            that.createInputPort(input[i], i);
        }

    }

    that.adjustHeight();
    that.inputOnChange();

};

viscomposer.ui.workflowWindow.selcolPanel.prototype.createInputPort = function(port, index){

    var that = this;

    var panel = new viscomposer.ui.workflowWindow.selcolInput(that.elSelector + ' .inputs', port, index);

    return panel;

};

viscomposer.ui.workflowWindow.selcolPanel.prototype.inputOnChange = function(){
    var that = this;
    var input = this.module.input;
    $(this.elSelector + ' .input input').unbind("change");
    $(this.elSelector + ' .input input').on("change", function(){
        var uuid = $(this).parents('.input').attr("id");
        var inputUI = viscomposer.Object.hashmap.get(uuid);
        if(inputUI.index != 0 && inputUI.index == input.length-1)
        {
            that.module.addInputPort();
            that.module.addOutputPort();
        }
        var value = $(this).val();
        inputUI.port.value=value;
        viscomposer.app.tryRender();

    });

};

