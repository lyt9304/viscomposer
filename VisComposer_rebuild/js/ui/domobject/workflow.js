/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.WorkflowUI=(function(){
	var WorkflowUI=viscomposer.VObject.define("WorkflowUI","DOMObject",function(workflow){
	    this.obj=workflow;
        workflow.ui=this;
	    this.dom=null;
	    this.update();
	});

    //窗口结构：workflowWindow-->content-->workflowWindow-sub-->inputs/svg/outputs

	var prototype=WorkflowUI.prototype;

	prototype.update = function(){

        this.elSelector = ".workflowWindow-sub#" + this.uuid;

		if(!this.dom)
		{
		    this.createDOM();
		}
		else
		{

		}

		this.updatePanel();
		this.updateInputPorts();
		this.updateOutputPorts();
		this.updateLinks();
		//TODO
	};

	prototype.createDOM=function(){
		this.dom=$.parseHTML(
	        '<div class="workflowWindow-sub" id="'+this.uuid+'">' +
	        '<div class="workflowWindow-sub-inputs"><div class="title">Inputs</div><div class="hr"></div></div>' +
	        '<svg></svg>' +
	        '<div class="workflowWindow-sub-outputs"></div>' +
	        '<div class="content"></div>' +
	        '</div>'
	    );

	    var dom=this.dom;
	    this.container=$(dom).children('.content')[0]
	    var that=this;//that保存Workflowui的引用

        $(dom).appendTo($("#workflowWindow > .content")[0]);

	    $(dom).on("dragover", function(ev){
	        ev.preventDefault();
	    });

        //在content上面画连接线-->connector
	    $(dom).find('.content').mouseup(function(ev){
	    	var connector=viscomposer.app.uiManager.connector;
	        if(connector.start && connector.flag)
	        {
	            $(dom).find('.content').unbind("mousemove");
	            var pos = [ev.offsetX, ev.offsetY];

	            var start=viscomposer.app.uiManager.connector.start;
	            var dataModule=new viscomposer.workflow.DataModule(start);
	            dataModule.pos=pos;
	            that.workflow.addModule(dataModule);
	            dataModule.pos = pos;
	            that.update();
	            //console.log("workflow updating");
	        }
	        else
	        {
	            $(dom).find('.content').unbind("mousemove");
	        }

	        viscomposer.app.uiManager.resetConnector();
	        $("#connect-temp").remove();
	    });


        //drag
	    $(dom).on("drop", function(ev){

	        var pos = [ev.originalEvent.offsetX, ev.originalEvent.offsetY];

	        var dragging=viscomposer.app.uiManager.dragging;
	        var type=dragging.type;
	        if(type != 'geometry' && type != 'data')
	        {
	            //添加module
	            var moduleClass=viscomposer.workflow.Module.registeredClass[type];
	            if(moduleClass){
	                var module=new moduleClass(that.obj);
	                //module.pos=pos;
	                //that.updatePanel();
	                //TODO
	            }

	            viscomposer.app.uiManager.resetDragging();
	        }

	    });

        //拖拽数据到input-panel上面，具体过程为找到自身的workflow，找到dataObj，将dataObj放到workflow中，在更新input-panel的端口
	    $(dom).find(" .workflowWindow-sub-inputs").on("drop", function(event){

            var workflow=viscomposer.app.uiManager.workflowWindow.workflowUIs[event.target.parentNode.getAttribute("id")].obj;

	        var dataObj = viscomposer.VObject.hashmap.get(viscomposer.app.uiManager.dragging.id);

	        //增加一个数据port
	        workflow.addData(dataObj);

	        that.updateInputPorts();

	    });

	    $(dom).mousedown(function(event, a) {

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
	                var workflowDom=$(w.ui.dom).find(' .content');

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
	                var workflowDom = $(workflow.ui.dom).find(' .content');
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
		//TODO
	};

    prototype.updateInputPorts = function(){

        var that = this;

        var input = this.obj.getInternalPorts();

        for(var i = 0; i < input.length; i++)
        {
            if(input[i].ui)
            {
                input[i].ui.update();
                //console.log("workflow input updating");
            }
            else
            {
                input[i].ui=new viscomposer.ui.WorkflowInputPortUI(that.elSelector + ' .workflowWindow-sub-inputs', input[i]);
                //that.createInputPort(input[i]);
            }
        }
    };

    //prototype.createInputPort = function(port){
    //
    //    var that = this;
    //
    //    var portUI = new viscomposer.ui.workflowWindow.workflowInput(that.elSelector + ' .workflowWindow-sub-inputs', port);
    //
    //    return portUI;
    //
    //};

    prototype.updateOutputPorts = function(){

        var that = this;

        var output = that.obj.getOutputPorts();

        for(var i = 0; i < output.length; i++)
        {

            var ui;
            if(ui=output[i].workflow.externalPortsUI)
            {

                ui.update();
                //console.log("workflow output updating");

            }
            else{
                ui=new viscomposer.ui.WorkflowOutputPortUI(that.elSelector + " .workflowWindow-sub-outputs", output[i].workflow);
                //that.createOutputPort(output[i].workflow);

            }

        }

    };

    //prototype.createOutputPort = function(workflowTo){
    //
    //    var that = this;
    //
    //    return new viscomposer.ui.workflowWindow.workflowOutput(that.elSelector + " .workflowWindow-sub-outputs",workflowTo);
    //
    //};

    //prototype.createPanel = function(module){
    //
    //    var that = this;
    //
    //    var panel = viscomposer.app.Factory.createPanel(module, that);
    //
    //    viscomposer.app.dragging = {};
    //
    //    return panel;
    //
    //};

    prototype.updatePanel=function(){
        var moduleList=this.obj.moduleList;
        for(var key in moduleList){
            var module=moduleList[key];
            if(!module.ui){
                var type=module.funName;

                switch(type){
                    case "View":case "Rect":case "Text":
                        module.ui=new viscomposer.ui.PrimitivePanelUI(module,this.obj,type);break;
                    default:
                        module.ui=new viscomposer.ui.ModuleUI(module,this.obj);break;
                }
                viscomposer.app.dragging={};
                //module.ui_.appendTo(this.container);
            }
            module.ui.update();
        }
    };

    prototype.updateLinks = function(){

        var that = this;

        var workflow = that.obj;

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
                //that.createLink(linkList[key]);
                linkList[key].ui=new viscomposer.ui.LinkUI(linkList[key]);
            }
        }

    };

    //prototype.createLink = function(link){
    //
    //    return new viscomposer.ui.workflowWindow.linkUI(link);
    //
    //};

    prototype.drawTempLink = function(){

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





	return WorkflowUI;
})();