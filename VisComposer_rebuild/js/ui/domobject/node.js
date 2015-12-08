viscomposer.ui.NodeUI=(function(){
	var NodeUI=viscomposer.VObject.define("NodeUI","DOMObject",function(node){
	    this.obj=node;
	    this.dom=null;
        //this.parentDom=node.parent.ui.container;
	    this.update();
	});

	var prototype=NodeUI.prototype;

    //dom:新结点的html
    //container:新节点的容器，用于放子节点

	prototype.update = function(){
	    var node = this.obj;

	    if(!node.workflow)
	    {
	        this.emptyNode();
	    }
	    else
	    {
	        if(!this.dom)
	        {
	        	this.createDOM();
	        }
            viscomposer.app.uiManager.updateWorkflow(node.workflow);

            //that.updateWorkflow();
            //for(var i = 0; i < node.children.length; i++)
            //{
            //    var tempNode = node.children[i];
            //    if(tempNode.ui)
            //    {
            //        tempNode.ui.update();
            //    }
            //    else
            //    {
            //        that.createNode("#" + that.uuid + ' > .graph', node.children[i]);
            //    }
            //}
	    }

        console.log("lyt:"+this.dom.innerHTML);
	    //var dataselector = this.node.dataSelectorStr || '';
	    //$(dom).children(".dataselector > span").html(dataselector);
        //
	    //this.updateLayout();
	    //TODO
	};

	
	prototype.createDOM=function(){
		var node=this.obj;
		//create dom
	    this.dom=$.parseHTML('<div class="node"' +
                'id=' + node.uuid+ ' style="width:"'+ 470 + 'px;>'+
	            '<div class="dataselector">&nbsp;&nbsp;&nbsp;&nbsp;<span></span></div>' +
	            '<div class="link"><img src="resource/image/scenegraphlink.png"></div>' +
	            '<div class="main">' +
	            '<div class="label">' +
	            '<div class="text">' + node.label + '</div>' +
	            '<div class="message">' +
	            '<img src="resource/image/element/primitive/frame.png">' +
	            //TODO
	            '&nbsp;&nbsp;X&nbsp;&nbsp;<span>'+
                1+
                '</span>' +
	            '</div></div>' +
	            '<div class="layout close">' +
	            '</div></div>' +
	            '<div class="graph"></div>' +
	            '</div>');
		var dom=this.dom;
		this.container=$(dom).children(".graph");

        $(dom).appendTo(node.parent.ui.container);

        //$(node.parent.ui_.container).append(dom);


	    //add listeners
	    var that=this;

        //单击结点显示对应的workflow
	    $(dom).children('.main').on("click", function(ev){
	        ev.stopPropagation();
	        viscomposer.app.selectedNode = node;
	        $("#workflowWindow > .title span").html('Transformation(' + node.label + ')');
	        $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
	        $(this).addClass("clicked");
	        $(this).children('.layout').addClass("clicked");
	        $(this).children('.label').addClass("clicked");
	        $(".workflowWindow-sub").css("display", "none");
	        viscomposer.app.uiManager.updateWorkflow(node.workflow);
	        $(node.workflow.ui.dom).css("display", "block");
	    });


        //双击切换close和open
	    $(dom).children('.main').on("dblclick", function(ev){
	        var layoutDom = $(this).children('.layout');
	        var titleHtml = layoutDom.children(".name").html()||"";
	        var close = layoutDom.hasClass("close");
	        if(close)
	        {
	            layoutDom.removeClass("close");
	            layoutDom.addClass("open");
	            layoutDom.children(".name").html("Composition:" + titleHtml);
	        }else{
	            layoutDom.removeClass("open");
	            layoutDom.addClass("close");
	            layoutDom.children(".name").html("Composition:" + titleHtml);   
	        }
	    });


        //拖拽添加新结点
	    $(dom).children(".main > .label, .main > .layout").on("dragover", function(ev){
	        ev.preventDefault();
	    });

	    $(dom).children(".main").on("drop", function(ev){
	        ev.stopPropagation();
	        //var type = viscomposer.app.dragging.type;
	        var workflow=node.workflow;

	        $(this).children(".label").click();

	        // node dropping
	        node.appendNewForm();
	        //viscomposer.app.tryRender();
	        //TODO
	    });

        //右键点击标签，显示创建template或者删除
	    $(dom).children(".main > .label").mousedown(function(event, a){
	        event.stopPropagation();
	        /*if(event.which == 3 || a == 'right'){
	            $(dom).children(".main > .label").click();
	            var menuDom = $("#savenodemenu");
	            $("body > .menu").css("display", "none");
	            menuDom.css({
	                "left": event.clientX,
	                "top": event.clientY,
	                "display": "block"
	            });
	            var menucoverDom = $("body > .menucover");
	            menucoverDom.css("display", "block");
	            menucoverDom.on("click", function(){
	                $("body > .menu").css("display", "none");
	                $(this).css("display", "none");
	            });
	            menuDom.children(".save").unbind("click");
	            menuDom.children(".save").on("click", function(){
	                var str=JSON.stringify(that.node.store());
	                menuDom.css("display", "none");
	                var templatesNum = $("body > #resources > .content > #layout > .content img").length;
	                if(templatesNum % 2 == 0)
	                {
	                    $("body > #resources > .content > #layout table").append("<tr><td></td><td></td></tr>")
	                }
	                $($("body > #resources > .content > #layout table td")[templatesNum]).append('<img src="resource/image/element/layout/Userdefined.png" type="json" json="' + encodeURIComponent(str) + '">');
	                menucoverDom.css("display", "none");
	                var imgsDom = $("body > #resources > .content > #layout > .content table img, body > #resources > .content > #primitive > .content table img");
	                imgsDom.unbind("dragstart");
	                imgsDom.on("dragstart", function(event){
	                    var dom = $(event.target);
	                    viscomposer.app.dragging = {
	                        type: dom.attr("type"),
	                        id: dom.attr("id"),
	                        json: dom.attr("json")
	                    }
	                });
	            });
	        }*/
	        //TODO
	    });

        //右键点击link
	    $(dom).children(".link").mousedown(function(event, a){
	        event.stopPropagation();

	        /*if(event.which == 3 || a == 'right'){
	            var thisNode = that.node;
	            var thisWorkflow = thisNode.workflow;
	            $(dom).children(".label").click();
	            var menuDom = $("body > #datadistribution");
	            menuDom.css({
	                "left": event.clientX,
	                "top": event.clientY,
	                "display": "block"
	            });
	            var menucoverDom = $("body > .menucover");
	            menucoverDom.css("display", "block");
	            menucoverDom.on("click", function(){

	                menuDom.css("display", "none");
	                menucoverDom.css("display", "none");

	            });
	            menuDom.html('');
	            var inputPorts = thisWorkflow.getInternalPorts();
	            for(var i = 0; i < inputPorts.length; i++)
	            {
	                var port = inputPorts[i];
	                if(port.imported)
	                {
	                    continue;
	                }
	                else
	                {
	                    var label = port.label;
	                    menuDom.append('<div class="item">' + label + ' ----> 100rows' + '</div>')
	                }
	            }
	        }*/
	        //TODO
	    });

        $(that.elSelector + " > .main").on("drop", function(ev){
            ev.stopPropagation();
            var type = viscomposer.app.dragging.type;
            var node = that.node;
            var workflow=node.workflow;

            //$(that.elSelector + ' > .main > .label').click();
            //
            //// node dropping
            //
            //switch(type){
            //    case 'scatterplot':
            //        properties={};
            //        properties.underLayout=workflow&&workflow.hasLayout();
            //        if(workflow&&workflow.layoutModule){
            //            properties=workflow.layoutModule.childProperties(properties);
            //        }
            //        var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Scatterplot');
            //        viscomposer.app.selectedNode = node;
            //        var layout=new viscomposer.workflow.Scatterplot(properties);
            //        var workflow=node.workflow;
            //        workflow.addModule(layout);
            //        var header=workflow.header;
            //        header.addPort('x','x');
            //        header.addPort('y','y');
            //        workflow.addLink(header.input[0].port2,layout.input[0]);
            //        workflow.addLink(header.input[1].port2,layout.input[1]);
            //
            //        properties={};
            //        properties.underLayout=true;
            //        properties=layout.childProperties(properties);
            //
            //        viscomposer.app.scenegraph.newNode(node,'circle',properties);
            //
            //        break;
            //    case 'barchart':
            //        properties={};
            //        properties.underLayout=workflow&&workflow.hasLayout();
            //        if(workflow&&workflow.layoutModule){
            //            properties=workflow.layoutModule.childProperties(properties);
            //        }
            //        var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Bar Chart');
            //        viscomposer.app.selectedNode = node;
            //        var layout=new viscomposer.workflow.BarChart(properties);
            //        var workflow=node.workflow;
            //        workflow.addModule(layout);
            //        var header=workflow.header;
            //        header.addPort('x','x');
            //        header.addPort('y','y');
            //        workflow.addLink(header.input[0].port2,layout.input[1]);
            //        workflow.addLink(header.input[1].port2,layout.input[2]);
            //
            //        properties={};
            //        properties.underLayout=true;
            //        properties=layout.childProperties(properties);
            //        viscomposer.app.scenegraph.newNode(node,'rectangle',properties);
            //        break;
            //    case 'stackedbarchart':
            //        properties={};
            //        properties.underLayout=workflow&&workflow.hasLayout();
            //        if(workflow&&workflow.layoutModule){
            //            properties=workflow.layoutModule.childProperties(properties);
            //        }
            //        var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Stacked Bar Chart');
            //        viscomposer.app.selectedNode = node;
            //        var layout=new viscomposer.workflow.StackedBarChart(properties);
            //        var workflow=node.workflow;
            //        workflow.addModule(layout);
            //        var header=workflow.header;
            //        header.addPort('x','x');
            //        header.addPort('y','y');
            //        workflow.addLink(header.input[0].port2,layout.input[1]);
            //        workflow.addLink(header.input[1].port2,layout.input[2]);
            //
            //        properties={};
            //        properties.underLayout=true;
            //        properties=layout.childProperties(properties);
            //        var node2=viscomposer.app.scenegraph.newNode(node,'blankview',properties);
            //        var workflow2=node2.workflow;
            //
            //        var layout2=new viscomposer.workflow.VerticalArray(properties);
            //        layout2.input[0].value='layout().classHeight';
            //        workflow2.addModule(layout2);
            //
            //        var properties2={};
            //        properties2.underLayout=true;
            //        properties2=layout2.childProperties(properties2);
            //        properties2.color='layout().classColor';
            //        var node3=viscomposer.app.scenegraph.newNode(node2,'rectangle',properties2);
            //        break;
            //
            //    default:
            //        if(viscomposer.app.primitiveRegistry[type]){
            //            //primitive
            //            var properties={};
            //            var workflow=node.workflow;
            //            properties.underLayout=workflow&&workflow.hasLayout();
            //            if(workflow&&workflow.layoutModule){
            //                properties=workflow.layoutModule.childProperties(properties);
            //            }
            //            var node = viscomposer.app.scenegraph.newNode(that.node,viscomposer.app.dragging.type,properties);
            //            viscomposer.app.selectedNode = node;
            //            viscomposer.app.tryRender();
            //        }else{
            //            var moduleClass=viscomposer.app.layoutRegistry[type];
            //            if(moduleClass){
            //                //layout
            //                var module=new moduleClass(properties);
            //                node.workflow.addModule(module);
            //            }
            //        }
            //}
            //
            //viscomposer.app.tryRender();

        });


	};

	prototype.emptyNode = function(){
	    var node = this.obj;
	    var that = this;
	    var dom=this.dom;

	    var newDom=$.parseHTML(
	        '<div class="node">' +
	        '<div class="dataselector"><span></span></div>' +
	        '<div class="link"><img src="resource/image/scenegraphlink.png"></div>' +
	        '<div class="main empty"><div class="label"><span>Drop Here</span></div></div>' +
	        '<div class="graph"></div>' +
	        '</div>');
	   	dom&&($(dom).replaceWith(newDom).remove());
	   	dom=this.dom=newDom;

	    $(dom).children(".main").on("click", function(ev){

	        /*ev.stopPropagation();
	        viscomposer.app.disableRender();
	        viscomposer.app.selectedNode = node;
	        $("#workflowWindow > .title span").html('Transformation(' + node.label + ')');
	        $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
	        $(this).addClass("clicked");
	        $(this).children('.layout').addClass("clicked");
	        $(this).children('.label').addClass("clicked");
	        $(".workflowWindow-sub").css("display", "none");*/
	        //TODO

	    });

	    $(dom).children(".main > .label").on("drop", function(ev){

	        ev.stopPropagation();
	        //viscomposer.app.disableRender();

	        //empty node dropping
	        node.appendNewForm();
	        //TODO

	        that.dom.remove();
	        that.dom = null;
	        //viscomposer.app.enableRender();
	        //viscomposer.app.tryRender();
	        //TODO
	    });
	};

	return NodeUI;
})();