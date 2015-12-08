/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.modifierPanel = function(module, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);

    this.productive = true;

    this.update();
    //console.log("panel updating");

    var input = this.module.input;
    for(var i = 0; i < input.length; i++)
    {
        input[i].ui.linkOn = true;
        input[i].ui.update();
    }

    this.modifierShow = false;

};

viscomposer.ui.workflowWindow.modifierPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.modifierPanel.prototype.constructor=viscomposer.ui.workflowWindow.modifierPanel;

viscomposer.ui.workflowWindow.modifierPanel.prototype.update = function(){
    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);
    var input = this.module.input;
    for(var i = 0; i < input.length; i++)
    {
        input[i].ui.onSwitch();
        input[i].ui.update();
    }
};

viscomposer.ui.workflowWindow.modifierPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module modifier" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
            '<div class="modifier"><div class="switch">OPEN</div></div>' +
            '</div></div>');

    $(that.elSelector + ' .switch').on("click", function(){

        var modifier = module.modifier;
        var modifierUI = modifier.ui;
        var modulePos = module.pos;
        if(!that.modifierShow)
        {
            $(this).html("CLOSE");
            modifier.pos = [parseInt(modulePos[0])+199, parseInt(modulePos[1]) + $(that.elSelector).height() + 30];
            if(modifierUI)
            {
                modifierUI.update();
                $(modifierUI.elSelector).css("display", "block");
            }
            else
            {
                modifierUI = viscomposer.app.Factory.createPanel(modifier, that);
            }
        }
        else
        {
            $(modifierUI.elSelector).css("display", "none");
            $(this).html("OPEN");
        }
        that.modifierShow = !that.modifierShow;

    });

};
