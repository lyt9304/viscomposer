/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.workflowWindow.input = function(parentDom, port){

    viscomposer.ui.workflowWindow.port.call(this,parentDom,port);

    this.elSelector = ".input#" + this.uuid;
    this.linkOn = false;
    this.update();

};

viscomposer.ui.workflowWindow.input.prototype=Object.create(viscomposer.ui.workflowWindow.port.prototype);
viscomposer.ui.workflowWindow.input.prototype.constructor=viscomposer.ui.workflowWindow.input;

viscomposer.ui.workflowWindow.input.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {
        var temp, label = that.port.label;
        if(label || (label==''))
        {
            if(label.length > 8)
            {
                temp = label.substr(0, 5) + '..';
            }else
            {
                temp = label;
            }
        }
        else
        {
            temp = that.port;
        }
        $(that.parentDom).append(
            '<div class="input" title="switch" id="' + that.uuid + '">' +
            '<div class="circle"></div>' +
            '<span class="label" title="' + label + '">' + temp + '</span>' +
            '<input class="string" value="'+that.port.value+'">' +
            '</div>'
        );
        $(that.elSelector + ' input.string').on("dragover", function(ev){
            ev.preventDefault();
        });
        that.onMouseup();
        that.onValueChange();
        that.renameListener();
        that.onMouseDown();
        that.inputDropListener();
    }
    else
    {

        $(that.elSelector + ' .string').val(that.port.value);

    }

    if(!that.linkOn)
    {
        $(that.elSelector + ' .circle').addClass("disable");
        $(that.elSelector + ' .string').css("display", "block");
    }
    else
    {
        $(that.elSelector + ' .circle').removeClass("disable");
        $(that.elSelector + ' .string').css("display", "none");
    }

};

viscomposer.ui.workflowWindow.input.prototype.inputDropListener = function(){
    var that = this;
    $(that.elSelector + ' input.string').on("drop", function(ev){
        ev.stopPropagation();
        that.port.value = viscomposer.app.draggingVar;
        that.port.submit();
    });
};

viscomposer.ui.workflowWindow.input.prototype.onMouseup = function(){

    var that = this;

    $(that.elSelector).mouseup(function (ev) {

        ev.stopPropagation();

        var start;
        if (start=viscomposer.app.connector.start) {

            viscomposer.app.connector.end = that.port;

            var workflow=that.port.module.workflow;
            workflow.addLink(start,that.port);

            workflow.ui.updateLinks();


        }
        viscomposer.app.connector.start = null;
        viscomposer.app.connector.end = null;
        viscomposer.app.connector.flag = false;
        $("#connect-temp").remove();


    });

};

viscomposer.ui.workflowWindow.input.prototype.onSwitch = function(){
    var that = this;
    $(that.elSelector + ' .circle').unbind("click");
    $(that.elSelector + ' .circle').on("click", function (ev) {
        ev.stopPropagation();
        if(!that.port.linkFrom)
        {
            that.linkOn = !that.linkOn;
            that.update();
        }
    });
};

viscomposer.ui.workflowWindow.input.prototype.onValueChange = function(){

    var that = this;

    $(that.elSelector + ' .string').on("change", function (ev) {

        var value = $(this).val();
        //console.log(value);

        that.port.value = value;
        that.port.submit();

    });

};