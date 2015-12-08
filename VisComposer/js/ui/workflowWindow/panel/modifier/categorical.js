/**
 * Created by vag on 2015/3/22.
 */
viscomposer.ui.workflowWindow.categoricalModifierPanel = function(modifier){

    viscomposer.ui.workflowWindow.panel.call(this, modifier);
    this.module = modifier;
    this.productive = false; //能否直接拉出一个module
    this.module.ui = this; //能否直接拉出一个module

    this.update();
    //console.log("panel updating");

};

viscomposer.ui.workflowWindow.categoricalModifierPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.categoricalModifierPanel.prototype.constructor = viscomposer.ui.workflowWindow.categoricalModifierPanel;

viscomposer.ui.workflowWindow.categoricalModifierPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

};

viscomposer.ui.workflowWindow.categoricalModifierPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $("#workflowWindow").append(
        '<div class="module modifier categorical" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.modifierStr + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '</div>' +
            '<div class="confirm">OK</div>' +
            '</div>'
    );

    var valueSet = that.module.properties.valueSet;

    for(var key in valueSet)
    {

        $(that.elSelector + ' .content').append(
            '<div class="item">' +
            '<div class="value">' + key + '</div>' +
            '<div class="color">' + valueSet[key] + '</div>' +
            '<input class="btn" type="color" value="' + valueSet[key] + '">' +
            '<div class="btncover" style="width: 15px; height: 15px; background-color: ' + valueSet[key] + '; position: absolute;right: 19px; top: 2px; pointer-events: none;"></div>' +
            '</div>');

    }


    $(that.elSelector + ' .content .item .btn').on("change", function(){

        $(this).siblings(".color").html($(this).val());
        $(this).siblings(".btncover").css("background-color", $(this).val());

        var newValueSet = {};
        $.each($(that.elSelector + ' .content .item'), function(){

            var key = $(this).children(".value").html();
            var color = $(this).children(".color").html();
            newValueSet[key] = color;


        });

        that.module.properties.valueSet = newValueSet;
//        $(that.elSelector).css("display", "none");
        that.module.submit();

    });

    $(that.elSelector + ' .confirm').on("click", function(){

        var newValueSet = {};
        $.each($(that.elSelector + ' .content .item'), function(){

            var key = $(this).children(".value").html();
            var color = $(this).children(".color").html();
            newValueSet[key] = color;


        });

        that.module.properties.valueSet = newValueSet;
        $(that.elSelector).css("display", "none");
        that.module.submit();

    });


};

viscomposer.ui.workflowWindow.categoricalModifierPanel.prototype.draggableListener = function(){

    var that = this;

    $(that.elSelector).draggable();

};
