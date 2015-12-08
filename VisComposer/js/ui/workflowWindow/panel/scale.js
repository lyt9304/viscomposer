/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.scalePanel = function(scaleModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, scaleModule, workflowWindow);

    this.productive = true;

    this.update();
    //console.log("panel updating");

    this.onChangeListener();

//    this.type = 1;//1区间映射，2颜色映射，3区间-值映射

    this.type = "colormapping";

};

viscomposer.ui.workflowWindow.scalePanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.scalePanel.prototype.constructor=viscomposer.ui.workflowWindow.scalePanel;

viscomposer.ui.workflowWindow.scalePanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    $(this.elSelector + ' .string').css("display", "none");

};

viscomposer.ui.workflowWindow.scalePanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module scale" id="' + that.uuid + '">' +
            '<div class="title" id="title-' + that.uuid + '">' +
            '<span>' + module.label + '</span>' +
            '</div><div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div>' +
//            '<div class="attributes">' +
//            'min: <input class="min">' +
//            'max: <input class="max">' +
//            '</div>' +
            '</div></div>');


};

viscomposer.ui.workflowWindow.scalePanel.prototype.onChangeListener = function(){

    var that = this;

    $(that.elSelector + ' .attributes .min').on("change", function(){

        var value = $(this).val();

        that.module.properties.min = value;

    });

    $(that.elSelector + ' .attributes .max').on("change", function(){

        var value = $(this).val();

        that.module.properties.max = value;

    });

};