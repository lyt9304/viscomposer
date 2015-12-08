/**
 * Created by vag on 2015/3/29.
 */
/**
 * Created by vag on 2015/3/29.
 */
viscomposer.ui.workflowWindow.colschooserPanel = function(module, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);
    this.module = module;
    this.productive = true;
    this.module.ui = this;
    this.workflowWindow = workflowWindow;
    this.selectedCol = null;

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.colschooserPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.colschooserPanel.prototype.constructor = viscomposer.ui.workflowWindow.colschooserPanel;

viscomposer.ui.workflowWindow.colschooserPanel.prototype.update = function(){
    var that = this;
    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);
    var module = that.module;
    var input = module.input[0];
    var inputUI = input.ui;
    inputUI.linkOn = true;
    inputUI.update();
    that.fillOptions();
};
viscomposer.ui.workflowWindow.colschooserPanel.prototype.createDom = function(){

    var that = this;
    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
        .append(
            '<div class="module colschooser" id="' + that.uuid + '">' +
            '<div class="title"><span>' + module.label + '</span></div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs"></div>' +
            '<div class="outputs"></div>' +
            '<div class="option">' +
            '</div>' +
            '</div></div>');

};
viscomposer.ui.workflowWindow.colschooserPanel.prototype.fillOptions = function(){
    var that = this;
    var optionDom = $(this.elSelector + ' .option');
    optionDom.html('');
    var cols = this.module.properties.cols;
    for(var key in cols)
    {
        var checked = cols[key].selected;
        if(checked)
        {
            optionDom.append('<div class="item"><input type="checkbox" value="' + key + '" checked>' + key + '</div>');
        }
        else
        {
            optionDom.append('<div class="item"><input type="checkbox" value="' + key + '">' + key + '</div>');
        }

    }
    $(that.elSelector + ' .option input[type="checkbox"]').unbind("click");
    $(that.elSelector + ' .option input[type="checkbox"]').on("click", function(){
        var val = $(this).attr("value");
        (that.module.properties.cols[val]).selected = this.checked;
        viscomposer.app.tryRender();
    });
};

