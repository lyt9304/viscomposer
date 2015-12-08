/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.selcolInput = function(parentDom, port, index){

    viscomposer.ui.workflowWindow.port.call(this,parentDom,port);

    this.elSelector = ".input#" + this.uuid;
    this.index = index;
    this.linkOn = true;
    this.update();

};

viscomposer.ui.workflowWindow.selcolInput.prototype=Object.create(viscomposer.ui.workflowWindow.port.prototype);
viscomposer.ui.workflowWindow.selcolInput.prototype.constructor=viscomposer.ui.workflowWindow.selcolInput;

viscomposer.ui.workflowWindow.selcolInput.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {
        var temp, label = that.port.label;
        if(label.length > 8)
        {
            temp = label.substr(0, 5) + '..';
        }else
        {
            temp = label;
        }
        $(that.parentDom).append(
            '<div class="input" id="' + that.uuid + '">' +
            '<div class="circle"></div>' +
            '<span class="label" title="' + label + '">' + temp + '</span>' +
            '<input class="string">' +
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

//viscomposer.ui.workflowWindow.selcolInput.prototype.inputDropListener = function(){
//    var that = this;
//    $(that.elSelector + ' .string').on("drop", function(ev){
//        ev.stopPropagation();
//        that.port.value = viscomposer.app.draggingVar;
//        that.port.submit();
//
//        if(that.index != 0 && that.index == inputs.length-1)
//        {
//            that.port.module.addInputPort();
//            that.port.module.addOutputPort();
//        }
//    });
//};

viscomposer.ui.workflowWindow.selcolInput.prototype.onSwitch = function(){

    var that = this;

    $(that.elSelector + ' .circle').unbind("click");
    $(that.elSelector + ' .circle').on("click", function (ev) {

        ev.stopPropagation();

        that.linkOn = !that.linkOn;

        that.update();


    });

};

viscomposer.ui.workflowWindow.selcolInput.prototype.onMouseup = function(){

    var that = this;

    $(that.elSelector).mouseup(function (ev) {

        ev.stopPropagation();
        var module = that.port.module;
        var inputs = module.input;
        var start;
        if (start=viscomposer.app.connector.start) {

            viscomposer.app.connector.end = that.port;
            //添加一个输入和一个输出
            if(that.index != 0 && that.index == inputs.length-1)
            {
                that.port.module.addInputPort();
                that.port.module.addOutputPort();
            }

            var workflow=that.port.module.workflow;
            workflow.addLink(start,that.port);
            workflow.ui.updateLinks();
            that.port.module.ui.update();

        }

        viscomposer.app.connector.start = null;
        viscomposer.app.connector.end = null;
        viscomposer.app.connector.flag = false;
        $("#connect-temp").remove();

    });

};

viscomposer.ui.workflowWindow.selcolInput.prototype.inputDropListener = function(){
    var that = this;
    $(that.elSelector + ' input.string').unbind("drop");
    $(that.elSelector + ' input.string').on("drop", function(ev){
        ev.stopPropagation();
        that.port.value = viscomposer.app.draggingVar;
        if(that.index != 0 && that.index == that.port.module.input.length-1)
        {
            that.port.module.addInputPort();
            that.port.module.addOutputPort();
        }
        that.port.submit();

    });
};

viscomposer.ui.workflowWindow.selcolInput.prototype.onValueChange = function(){

    var that = this;

    $(that.elSelector + ' .string').on("change", function (ev) {

        var value = $(this).val();
        //console.log(value);

        that.port.value = value;
        that.port.submit();

    });

};