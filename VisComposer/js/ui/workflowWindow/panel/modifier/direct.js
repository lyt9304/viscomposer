/**
 * Created by vag on 2015/3/22.
 */


viscomposer.ui.workflowWindow.directModifierPanel = function(modifier){

    viscomposer.ui.workflowWindow.panel.call(this, modifier);
    this.module = modifier;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.directModifierPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.directModifierPanel.prototype.constructor = viscomposer.ui.workflowWindow.directModifierPanel;

viscomposer.ui.workflowWindow.directModifierPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    $(this.elSelector + ' .content input').val(this.module.modifierStr);

};

viscomposer.ui.workflowWindow.directModifierPanel.prototype.createDom = function(){

    var that = this;

    var modifierStr = that.module.modifierStr || '';

    $("#workflowWindow").append(
        '<div class="module modifier direct" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>Direct mapping</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<input type="text" value=' + modifierStr + '>' +
            '</div>' +
            '<div class="confirm">OK</div>' +
            '</div>'
    );

    $(that.elSelector + ' .confirm').on("click", function(){

        var mappingRule = $(that.elSelector + ' input').val();
        that.module.modifierStr=mappingRule;
        that.module.submit();

        $(that.elSelector).css('display','none');

    });



};

viscomposer.ui.workflowWindow.directModifierPanel.prototype.draggableListener = function(){

    var that = this;

    $(that.elSelector).draggable();

};
