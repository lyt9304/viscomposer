viscomposer.ui.workflowWindow.panel = function(module, window){

    viscomposer.Object.call(this);

    this.elSelector = '.module#' + this.uuid;

    this.module = module;

    this.module.ui = this; //能否直接拉出一个module
    this.workflowWindow = window;

    this.module.pos = this.module.pos || [300, 50];


};

viscomposer.ui.workflowWindow.panel.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.ui.workflowWindow.panel.prototype.constructor=viscomposer.ui.workflowWindow.panel;
viscomposer.ui.workflowWindow.panel.prototype.module=null;
viscomposer.ui.workflowWindow.panel.prototype.workflowWindow=null;
viscomposer.ui.workflowWindow.panel.prototype.elSelector=null;

viscomposer.ui.workflowWindow.panel.prototype.update = function(){

    var that = this;



    if($(that.elSelector).length == 0)
    {
        that.createDom();
        that.renameListener();
        that.draggableListener();
        that.onMouseDown();

    }
    else
    {

    }

    that.setPos();
    that.adjustHeight();
    that.updateInputPorts();
    that.updateOutputPorts();

    if(!($(that.elSelector).hasClass(that.module.type))){
        $(that.elSelector).addClass(that.module.type);
    }

};

viscomposer.ui.workflowWindow.panel.prototype.adjustHeight = function(){

    var that = this;

    var content=$(that.elSelector + " .content");
    var contentH=$(that.elSelector + " .content").height();
    var inputH=$(that.elSelector + ' .inputs').height();
    var outputH=$(that.elSelector + ' .outputs').height();

    if(that.module instanceof viscomposer.workflow.Scatterplot)
    {
        //console.log($(that.elSelector).html(), contentH, inputH, outputH);
    }

    var H = contentH;
    if(H < inputH)
    {
        H = inputH;
    }
    if(H < outputH)
    {
        H = outputH;
    }
    content.height(H);

};

viscomposer.ui.workflowWindow.panel.prototype.updateInputPorts = function(){

    var that = this;

    var input = that.module.input;

    if(!input){return;}

    for(var i = 0; i < input.length; i++)
    {

        if(input[i].ui)
        {
            input[i].ui.update();
            //console.log("input updating");
        }
        else
        {
            that.createInputPort(input[i]);
        }

    }

    that.adjustHeight();

};


viscomposer.ui.workflowWindow.panel.prototype.updateOutputPorts = function(){
    var that = this;

    var output = that.module.output;

    if(!output){return;}

    for(var i = 0; i < output.length; i++)
    {

        if(output[i].ui)
        {
            output[i].ui.update();
            //console.log("output updating");
        }
        else
        {
            that.createOutputPort(output[i]);
        }

    }

    that.adjustHeight();
};

viscomposer.ui.workflowWindow.panel.prototype.createOutputPort = function(port){

    var that = this;

    var panel = new viscomposer.ui.workflowWindow.output(that.elSelector + ' .outputs', port);

    return panel;


};

viscomposer.ui.workflowWindow.panel.prototype.createDom = function(){};

//viscomposer.ui.workflowWindow.panel.prototype.deleteListener = function() {
//
//    var that = this;
//
//    var module = that.module;
//
//    //close button listener
//    $(that.elSelector + " .min").on("click", function(){
//
//        var inputs = that.module.input;
//        var outputs = that.module.output;
//
//        for(var i = 0; i < inputs.length; i++)
//        {
//            $( ".connect-line[id*='" + inputs[i].uuid + "']").remove();
//        }
//        for(var i = 0; i < outputs.length; i++)
//        {
//            $( ".connect-line[id*='" + outputs[i].uuid + "']").remove();
//        }
//
//        $(that.elSelector).remove();
//
//    });
//
//};

viscomposer.ui.workflowWindow.panel.prototype.renameListener = function(){

    var that = this;

    $(that.elSelector + " .title span").on("dblclick", function(){

        $(this).html('<input type="text" value="' + $(this).html() + '">');

        $(this).children("input").on("change", function(){

            var newLabel = $(this).val();
            that.module.label = newLabel;
            $(this).parents('span').html(newLabel);
            that.renameListener();

        });


    });

};

viscomposer.ui.workflowWindow.panel.prototype.draggableListener = function(){

    var that = this;

    $(that.elSelector).draggable({

        containment: '.workflowWindow-sub#' + that.workflowWindow.uuid,
        drag: function(){

            that.module.pos = [$(that.elSelector).css("left"), $(that.elSelector).css("top")];
            that.workflowWindow.updateLinks();

        },
        stop: function(){

            that.module.pos = [$(that.elSelector).css("left"), $(that.elSelector).css("top")];
            that.workflowWindow.updateLinks();
            //console.log(that.module.pos);

        }

    });

};

viscomposer.ui.workflowWindow.panel.prototype.setPos = function()
{

    var that = this;

    var pos = that.module.pos;

    $(this.elSelector).css({
        left: pos[0],
        top: pos[1]
    });

};
viscomposer.ui.workflowWindow.panel.prototype.onMouseDown = function(){

    var that = this;
    $(that.elSelector).mousedown(function(event, a){
        event.stopPropagation();

        if(event.which == 3 || a == 'right'){

            $("body > .menu").css("display", "none");

            $("#removemodulemenu").css({
                "left": event.clientX,
                "top": event.clientY,
                "display": "block"
            });

            var menucoverDom = $("body > .menucover");
            menucoverDom.css("display", "block");
            menucoverDom.unbind("click");
            menucoverDom.on("click", function(){

                $("body > .menu").css("display", "none");
                $(this).css("display", "none");

            });


        }
        else if(event.which == 1){

            $(".module").removeClass("module-clicked");
            $(that.elSelector).addClass("module-clicked");

        }
    });

};
