/**
 * Created by vag on 2015/3/3.
 */
viscomposer.ui.workflowWindow = function(workflow){

    var that = this;

    viscomposer.Object.call(that);

    that.workflow = workflow;
    that.workflow.ui = that;
    that.elSelector = ".workflowWindow-sub#" + that.uuid;

    that.update();
    //console.log("workflow updating");
    that.dragoverListener();
    that.mouseupListener();
    that.dropListener();
    that.inputAreaDropListener();
    that.rightClickListener();

};

viscomposer.ui.workflowWindow.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.workflowWindow.prototype.constructor = viscomposer.ui.workflowWindow;
viscomposer.ui.workflowWindow.prototype.workflow = null;
viscomposer.ui.workflowWindow.prototype.elSelector = null;

viscomposer.ui.workflowWindow.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {
        that.createDom();
    }
    else
    {

    }

    that.updatePanel();
    that.updateInputPorts();
    that.updateOutputPorts();
    that.updateLinks();



};

viscomposer.ui.workflowWindow.prototype.createDom = function(){

    var that = this;

    $("#workflowWindow > .content").append(
        '<div class="workflowWindow-sub" id="' + that.uuid + '">' +
        '<div class="workflowWindow-sub-inputs"><div class="title">Inputs</div><div class="hr"></div></div>' +
        '<svg></svg>' +
        '<div class="workflowWindow-sub-outputs"></div>' +
        '<div class="content"></div>' +
        '</div>'
    );

};

viscomposer.ui.workflowWindow.prototype.rightClickListener = function(){

    var that = this;

    $(that.elSelector).mousedown(function(event, a) {

        event.stopPropagation();

        if (event.which == 3 || a == 'right') {

            $("body > #mappingmenu").css({
                "left": event.clientX,
                "top": event.clientY,
                "display": "block"
            });
            var menucoverDom = $("body > .menucover");
            menucoverDom.css("display", "block");
            menucoverDom.mousedown(function(){

                $("body > .menu").css("display", "none");
                $(this).css("display", "none");

            });

            var w = that.workflow;
            var env = w.getEnv();
            var scaleList = [];
            var scalePoolDom = $("#mappingmenu > .scalepool > .submenu");
            scalePoolDom.html("");
            for(var key in env)
            {
                if(env[key].type === 'scale')
                {
                    scaleList.push(env[key]);
                    scalePoolDom.append('<div>' + key + '</div>');
                }
            }
            if(scaleList.length == 0)
            {
                scalePoolDom.append('<div>none</div>');
            }

            var submenuDom = scalePoolDom.children("div");
            submenuDom.unbind("click");
            submenuDom.on("click", function(ev){

                var scaleName = $(this).html();
                var env=w.getEnv();
                var port=env[scaleName];
                var modifierModule=new viscomposer.workflow.ModifierModule(true,port.modifier);
                modifierModule.label=scaleName;
                modifierModule.mappingType='scale';
                var workflowDom=$(w.ui.elSelector+' .content');

                modifierModule.pos=[ev.clientX-parseInt($(workflowDom).offset().left),ev.clientY-parseInt($(workflowDom).offset().top)];

                w.addModule(modifierModule);

                w.ui.update();

                $("body > #mappingmenu").css("display", "none");
                menucoverDom.css("display", "none");

                viscomposer.app.tryRender();

                //console.log("workflow updating");
            });


            $("#mappingmenu > .new > div > div").unbind("click");
            $("#mappingmenu > .new > div > div").on("click", function(){

                var mappingType = $(this).attr("id");
                var workflow = that.workflow;
                var modifier = new viscomposer.app.moduleRegistry[mappingType]();
                var module=new viscomposer.workflow.ModifierModule(false,modifier);
                var menuDom = $("#mappingmenu");
                var workflowDom = $(workflow.ui.elSelector + ' .content');
                module.pos = [parseInt(menuDom.css("left")) - parseInt($(workflowDom).offset().left) , parseInt(menuDom.css("top")) - parseInt($(workflowDom).offset().top)];
                $("body > #mappingmenu").css("display", "none");
                menucoverDom.css("display", "none");
                workflow.addModule(module);
                module.mappingType = mappingType;
                workflow.ui.update();
                //console.log("workflow updating");

            });

        }
    });

};

viscomposer.ui.workflowWindow.prototype.dragoverListener = function(){

    var that = this;

    $(that.elSelector).on("dragover", function(ev){

        ev.preventDefault()

    });

};

viscomposer.ui.workflowWindow.prototype.dropListener = function(){

    var that = this;


    $(".workflowWindow-sub#" + that.uuid).on("drop", function(ev){

        var pos = [ev.originalEvent.offsetX, ev.originalEvent.offsetY];

        if(viscomposer.app.dragging.type != 'geometry' && viscomposer.app.dragging.type != 'data')
        {
            var type=viscomposer.app.dragging.type;
            //添加module
            var moduleClass=viscomposer.app.moduleRegistry[type];
            if(moduleClass){
                var module=new moduleClass();
                module.pos=pos;
                that.workflow.addModule(module);
                that.updatePanel();
            }

            viscomposer.app.dragging = {};

        }

    });



};


viscomposer.ui.workflowWindow.prototype.mouseupListener = function(){

    var that = this;

    $(that.elSelector + ' .content').mouseup(function(ev){

        if(viscomposer.app.connector.start && viscomposer.app.connector.flag)
        {

            $(that.elSelector + ' .content').unbind("mousemove");
            var pos = [ev.offsetX, ev.offsetY];

            var start=viscomposer.app.connector.start;
            var dataModule=new viscomposer.workflow.DataModule(start);
            dataModule.pos=pos;
            that.workflow.addModule(dataModule);
            dataModule.pos = pos;
            that.update();
            //console.log("workflow updating");


        }
        else
        {
            $(that.elSelector + ' .content').unbind("mousemove");

        }

        viscomposer.app.connector.start = null;
        viscomposer.app.connector.end = null;
        viscomposer.app.connector.flag = false;
        $("#connect-temp").remove();

    });

};

viscomposer.ui.workflowWindow.prototype.inputAreaDropListener = function() {

    var that = this;

    $(that.elSelector + " .workflowWindow-sub-inputs").on("drop", function(){

        var workflow = that.workflow;

        var dataObj = viscomposer.Object.hashmap.get(viscomposer.app.dragging.id);

        //增加一个数据port
        workflow.addData(dataObj);

        that.updateInputPorts();

    });

};

viscomposer.ui.workflowWindow.prototype.updateInputPorts = function(){

    var that = this;

    var input = that.workflow.getInternalPorts();

    for(var i = 0; i < input.length; i++)
    {
        if(input[i].ui)
        {
            input[i].ui.update();
            //console.log("workflow input updating");
        }
        else
        {
            that.createInputPort(input[i]);
        }
    }



};

viscomposer.ui.workflowWindow.prototype.createInputPort = function(port){

    var that = this;

    var portUI = new viscomposer.ui.workflowWindow.workflowInput(that.elSelector + ' .workflowWindow-sub-inputs', port);

    return portUI;

};

viscomposer.ui.workflowWindow.prototype.updateOutputPorts = function(){

    var that = this;

    var output = that.workflow.getOutputPorts();

    for(var i = 0; i < output.length; i++)
    {

        var ui;
        if(ui=output[i].workflow.externalPortsUI)
        {

            ui.update();
            //console.log("workflow output updating");

        }
        else{

            that.createOutputPort(output[i].workflow);

        }

    }

};

viscomposer.ui.workflowWindow.prototype.createOutputPort = function(workflowTo){

    var that = this;

    return new viscomposer.ui.workflowWindow.workflowOutput(that.elSelector + " .workflowWindow-sub-outputs",workflowTo);

};

viscomposer.ui.workflowWindow.prototype.updatePanel = function(){

    var that = this;

    var workflow = that.workflow;

    var moduleList = workflow.moduleList;

    for(var key in moduleList)
    {

        if(moduleList[key].ui)
        {
            moduleList[key].ui.update();
            //console.log("panel updating");
        }
        else
        {
            that.createPanel(moduleList[key]);
        }

    }

};

viscomposer.ui.workflowWindow.prototype.createPanel = function(module){

    var that = this;

    var panel = viscomposer.app.Factory.createPanel(module, that);

    viscomposer.app.dragging = {};

    return panel;

};

viscomposer.ui.workflowWindow.prototype.updateLinks = function(){

    var that = this;

    var workflow = that.workflow;

    var linkList = workflow.linkList;

    for(var key in linkList)
    {

        if(linkList[key].ui)
        {
            linkList[key].ui.update();
            //console.log("link updating");
        }
        else
        {
            that.createLink(linkList[key]);
        }

    }

};

viscomposer.ui.workflowWindow.prototype.createLink = function(link){

    return new viscomposer.ui.workflowWindow.linkUI(link);

};

viscomposer.ui.workflowWindow.prototype.drawTempLink = function(){

    var that = this;

    var offsetX = $(that.elSelector).offset().left;
    var offsetY = $(that.elSelector).offset().top;

    var portWidth = 14;
    var portHeigth = 14;

    var connector = viscomposer.app.connector;

    if(connector.start)
    {

        var startUUID = connector.start.ui.uuid;

        var startX = $("#" + startUUID).children(".circle").offset().left - offsetX + portWidth/2;
        var startY = $("#" + startUUID).children(".circle").offset().top - offsetY + portHeigth/2;

        var endX = viscomposer.app.mouseX - offsetX;
        var endY = viscomposer.app.mouseY - offsetY;

        var svg = d3.select(that.elSelector + " svg");

        if($("#connect-temp").length == 1)
        {
            $("#connect-temp")
                .attr("x1",startX)
                .attr("y1",startY)
                .attr("x2",endX)
                .attr("y2",endY);
        }
        else
        {
            svg.append("line")
                .attr("id","connect-temp")
                .attr("x1",startX)
                .attr("y1",startY)
                .attr("x2",endX)
                .attr("y2",endY)
                .attr("stroke","black")
                .attr("stroke-dasharray","2,2");
        }

    }

};





