/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.WorkflowUI=(function(){
	var WorkflowUI=viscomposer.VObject.define("WorkflowUI","DOMObject",function(workflow){
	    this.workflow = workflow;
        workflow.ui=this;
	    this.dom = null;
		this.container = null;
		this.inputsDom = null;
		this.outputsDom = null;
		this.uiInit();
		this.listener();
	    this.update();
	});

	var prototype = WorkflowUI.prototype;

	prototype.uiInit = function(){
		this.dom = $.parseHTML(
			'<div class="workflowUI" id="'+this.uuid+'">' +
			'<div class="inputs"><div class="title">Inputs</div><div class="hr"></div></div>' +
			'<svg></svg>' +
			'<div class="outputs"></div>' +
			'<div class="content"></div>' +
			'</div>'
		);
		var dom = this.dom;
		this.container = $(dom).children('.content')[0];
		this.inputsDom = $(dom).children(".inputs");
		this.outputsDom = $(dom).children(".outputs");
		$(dom).appendTo($("#workflowWindow > .content")[0]);
	};

	prototype.listener = function(){
		var dom = this.dom;
		var workflow = this.workflow;
		var that = this;
		$(dom).on("mouseup", function(ev){
			var connector = viscomposer.app.uiManager.connector;
			if(connector.start && connector.flag){
				var pos = [ev.offsetX, ev.offsetY];
				var start = connector.start;
				var workflow = that.workflow;
				var dataModule = workflow.addModule("func", "data");
				dataModule.loadData(start.dataInfo);
				var dataUI = new viscomposer.ui.DataUI(dataModule, workflow);
				dataUI.pos = pos;
				dataUI.update();
				var dataInput = dataModule.inputs[0];
				workflow.addLink(start, dataInput);
				that.update();
			}
			that.stopDrawTempLine();
		});
		$(dom).on("dragover", function(ev){
			ev.preventDefault();
		});
		//$(dom).on("drop", function(ev){
		//	var pos = [ev.originalEvent.offsetX, ev.originalEvent.offsetY];
		//	var dragging = viscomposer.app.uiManager.dragging;
		//	var type = dragging.type;
		//	//TODO
		//	alert('Add Module!');
		//});
		$(this.inputsDom).on("drop", function(ev){
			ev.stopPropagation();
			var dragging = viscomposer.app.uiManager.dragging;
			var dataItem = viscomposer.VObject.hashmap.get(dragging.id);
			var dataObj = dataItem.module;
			workflow.addData(dataObj);
			that.updateInputs();
		});
	};

	prototype.update = function(){
		//update 自己的ui
		//update inputs
		this.updateInputs();
		//updata outputs
		//update modules
		var workflow = this.workflow;
		var moduleList = workflow.moduleList;
		for(var key in moduleList){
			var module = moduleList[key];
			if(module.ui){
				module.ui.update();
			}else{
				var moduleRegistry = viscomposer.registry[module.category + 'UI'];
				new moduleRegistry[module.type](module, workflow);
			}
		}
		//update links
		this.updateLinks();
	};

	prototype.updateInputs = function(){
		var workflow = this.workflow;
		var importedDataInputs = workflow.header.importedDataInputs;
		for(var i = 0, l = importedDataInputs.length; i < l; i++){
			if(importedDataInputs[i].ui){
				importedDataInputs[i].ui.update();
			}else{
				new viscomposer.ui.WorkflowInputUI(importedDataInputs[i]);
			}
		}
		var inputs = workflow.header.inputs;
		for(i = 0, l = inputs.length; i < l; i++){
			inputs[i].update();
		}
	};

	prototype.updateLinks = function(){
		var linkList = this.workflow.linkList;
		for(var key in linkList){
			if(linkList[key].ui){
				linkList[key].ui.update();
			}else{
				new viscomposer.ui.LinkUI(linkList[key]);
			}
		}
	};

	prototype.drawTempLine = function(){
		var dom = this.dom;
		var that = this;
		var offsetX = $(dom).offset().left;
		var offsetY = $(dom).offset().top;
		$(dom).on("mousemove", function(ev){
			var portWidth = 14;
			var portHeigth = 14;
			var endX = viscomposer.app.uiManager.mousePos[0] - offsetX;
			var endY = viscomposer.app.uiManager.mousePos[1] - offsetY;
			var connector = viscomposer.app.uiManager.connector;
			if(connector.start){
				var startUI = connector.start.ui;
				var startX = $(startUI.dom).children(".circle").offset().left - offsetX + portWidth/2;
				var startY = $(startUI.dom).children(".circle").offset().top - offsetY + portHeigth/2;
				var svg = $(dom).find("svg");
				var tempLineDom = $(svg).find("#connect-temp");
				console.log("drawing....");
				if(tempLineDom.length == 1) { //临时画的线已经存在
					d3.select(tempLineDom[0]).attr("x1",startX)
						.attr("y1",startY)
						.attr("x2",endX)
						.attr("y2",endY);
				}else{
					d3.select(svg[0]).append("line")
						.attr("id","connect-temp")
						.attr("x1",startX)
						.attr("y1",startY)
						.attr("x2",endX)
						.attr("y2",endY)
						.attr("stroke","black")
						.attr("stroke-dasharray","2,2");
				}
			}
		});

	};

	prototype.stopDrawTempLine = function(){
		var dom = this.dom;
		viscomposer.app.uiManager.connector = {
			start: null,
			end: null,
			flag: false
		};
		$(dom).unbind("mousemove");
		$(dom).find("#connect-temp").remove();
	};

	return WorkflowUI;
})();