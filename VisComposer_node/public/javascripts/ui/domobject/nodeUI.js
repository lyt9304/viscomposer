viscomposer.ui.NodeUI = (function(){

	var NodeUI = viscomposer.VObject.define("NodeUI","DOMObject",function(node){
		this.node = node;
		node.ui = this;
		this.dom = null;
		this.container = null;
		this.properties = {
			width: 470,
		};
		this.uiInit();
		this.listener();
		this.update();
	});

	var prototype = NodeUI.prototype;

	prototype.uiInit = function(){
		var node = this.node;
		var properties = node.properties;
		if(node.isRoot){
			this.dom = $.parseHTML(
				'<div class="root" id="' + this.uuid + '">' +
					'<div class="label">' +
						'<div class="text">CANVAS</div>' +
						'<div class="wrap">' +
							'<input type="color" id="rcolor" value="#ffffff">' +
							'<div id="rcolorbtn" class="colorbtn"></div>' +
							'<div class="width">width:<input type="text" value="" id="rwidth"></div>' +
							'<div class="height">height:<input type="text" value="" id="rheight"></div>' +
						'</div>' +
					'</div>' +
					'<div class="graph"></div>' +
				'</div>\n');
			this.container = $(this.dom).children(".graph");
			$(this.dom).appendTo($('#scenegraphWindow > .content'));
			$(this.dom).css("width", this.properties.width);
			$(this.dom).find('#rcolor').attr("value", properties.bgColor);
			$(this.dom).find('#rcolorbtn').css('background-color', properties.bgColor);
			$(this.dom).find('#rwidth').val(properties.width);
			$(this.dom).find('#rheight').val(properties.height);
		}else{
			var scenegraph = node.scenegraph;
			var root = scenegraph.root;
			var rootContainer = root.ui.container;
			this.dom = $.parseHTML(
				'<div class="node" id="' + this.uuid + '">' +
					'<div class="dataselector">&nbsp;&nbsp;&nbsp;&nbsp;<span></span></div>' +
					'<div class="link"><img src="/images/scenegraphlink.png"></div>' +
					'<div class="main">' +
						'<div class="label">' +
							'<div class="text">' + node.label + '</div>' +
							'<div class="message">' +
								'<img src="/images/element/primitive/frame.png">' +
								'&nbsp;&nbsp;X&nbsp;&nbsp;<span>' + 1 + '</span>' +
							'</div>' +
						'</div>' +
						'<div class="array close"></div>' +
					'</div>' +
					'<div class="graph"></div>' +
				'</div>\n');
			this.container = $(this.dom).children(".graph");
			$(this.dom).appendTo((node.parent ? node.parent.ui.container : rootContainer));
		}
	};

	prototype.listener = function(){
		var that = this;
		var node = this.node;
		var dom = this.dom;
		var arrayDom = $(dom).children(".main").children(".array");
		if(node.isRoot){
			var properties = node.properties;
			$(dom).on("change", "#rcolor", function(){
				properties.bgColor = $(this).val();
				node.update();
			});
			$(dom).on("change", "#rwidth", function(){
				properties.width = $(this).val();
				node.update();
			});
			$(dom).on("change", "#rheight", function(){
				properties.height = $(this).val();
				node.update();
			});
		}
		$(dom).children('.main').on("click", function(ev){
			ev.stopPropagation();
			viscomposer.app.uiManager.scenegraphWindow.scenegraphUI.setSelectedNode(node);
		});
		$(dom).children('.main').on("dbclick", function(ev){
			var arrayDom = $(this).children('.array');
			var titleHtml = arrayDom.children(".name").html()||"";
			var close = arrayDom.hasClass("close");
			if(close){
				arrayDom.removeClass("close");
				arrayDom.addClass("open");
			}else{
				arrayDom.removeClass("open");
				arrayDom.addClass("close");
			}
		});
		$(dom).children(".main").children(".label").on("dragover", function(ev){
			ev.preventDefault();
		});
		$(dom).children(".main").children(".label").on("drop", function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			var dragging = viscomposer.app.uiManager.dragging;
			var newNode = null;
			switch (dragging.category){
				case 'form':
					newNode =node.appendForm(dragging.type);break;
				case 'primitive':
					newNode =node.appendNode(dragging.type);break;
				case 'array':
					//todo
					break;
				default :
					break;
			}
			that.update();
			that.node.scenegraph.ui.setSelectedNode(newNode);
		});
		$(arrayDom).on("drop", function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			var node = that.node;
			var workflow = node.workflow;
			var arrayModule = workflow.arrayModule;
			var replace = true;
			if(arrayModule != undefined && arrayModule != null){
				replace = confirm('Replace this array?');
			}
			if(replace){
				var dragging = viscomposer.app.uiManager.dragging;
				workflow.addModule(dragging.category, dragging.type);
				that.updateArray();
			}
			arrayDom.removeClass("empty");
		});
		$(arrayDom).on("dblclick", function(ev){
			var node = that.node;
			var workflow = node.workflow;
			var arrayModule = workflow.arrayModule;
			var close = arrayDom.hasClass('close');
			if(close){
				arrayDom.removeClass("close");
				arrayDom.addClass("open");
			}else{
				arrayDom.removeClass("open");
				arrayDom.addClass("close");
			}
		});
	};

	prototype.update = function(){
		var node = this.node;
		var properties = node.properties;
		var dom = this.dom;
	    if(!node.workflow){
	        this.makeEmpty();
	    }else{
			//update自己的ui
			$(dom).css("width", this.properties.width);
			if(node.isRoot){
				$(dom).find('#rcolor').attr("value", properties.bgColor);
				$(dom).find('#rcolorbtn').css('background-color', properties.bgColor);
				$(dom).find('#rwidth').val(properties.width);
				$(dom).find('#rheight').val(properties.height);
			}else{
				this.updateArray();
			}
			//update workflow的ui
			if(!node.isRoot){
				var workflow = node.workflow;
				if(workflow.ui){
					workflow.ui.update();
				}else{
					new viscomposer.ui.WorkflowUI(workflow);
				}
			}
			//update儿子的ui
			var padding = 4;
			var childrenNum = node.children.length;
			var childWidth = (this.properties.width - padding * (childrenNum - 1)) / childrenNum;
            for(var i = 0; i < childrenNum; i++){
                var tNode = node.children[i];
                if(tNode.ui){
					tNode.ui.properties.width = childWidth;
					tNode.ui.update();
                }else{
					var tNodeUI = new viscomposer.ui.NodeUI(tNode);
					tNodeUI.properties.width = childWidth;
					tNodeUI.update();
                }
            }
	    }
	};

	prototype.updateArray = function(){
		var node = this.node;
		var workflow = node.workflow;
		var arrayDom = $(this.dom).children(".main").children(".array");
		if(workflow && !node.isRoot){
			var module = workflow.arrayModule;
			if(module){
				var labels = module.arrayLabels;
				var arrayHtml = '';
				arrayHtml += '<div class="name">Composition:' + module.label + '</div>' +
							'<div class="content"><img src="' + module.arrayIcon + '"><div class="list">';
				for(var i = 0, ni = labels.length;i < ni; ++i){
					arrayHtml += '\n<div class="item" draggable="true" title="' + labels[i][1] + '" value="' + labels[i][2] + '">' + labels[i][0] + '</div>';
				}
				arrayHtml+= '</div></div>';
				arrayDom.html(arrayHtml);
				arrayDom.attr("title", module.arrayDescription).attr("height", 20);
			}else{
				arrayDom.html('<img src="/images/icon/zhankai.png">');
				arrayDom.attr("title", "Drag a composition here.");
				arrayDom.addClass("empty");
			}
		}
	};

	prototype.makeEmpty = function(){
		//TODO
	};

	return NodeUI;
})();