/**
 * Created by vag on 2015/3/15.
 */

viscomposer.ui.scenegraphWindow.node = function(parentDom, node){

    viscomposer.Object.call(this);
    this.node = node;
    node.ui = this;
    this.parentDom = parentDom;
    this.dom=null;
    this.elSelector = ".node#" + this.uuid;
    this.update();

};

viscomposer.ui.scenegraphWindow.node.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.scenegraphWindow.node.prototype.constructor = viscomposer.ui.scenegraphWindow.node;

viscomposer.ui.scenegraphWindow.node.prototype.update = function(){

    var that = this;
    var node = that.node;

    if(!node.workflow)
    {
        that.emptyNode();
    }

    else
    {
        if($(this.elSelector).length==0)
        {
            this.createDom();
            this.clickListener();
            this.dblclickListener();
            this.dragoverListener();
            this.dropListener();
            this.rightClickListener();
            this.linkRightClickListener();
        }
        that.updateWorkflow();
        for(var i = 0; i < node.children.length; i++)
        {
            var tempNode = node.children[i];
            if(tempNode.ui)
            {
                tempNode.ui.update();
            }
            else
            {
                that.createNode("#" + that.uuid + ' > .graph', node.children[i]);
            }

        }
    }

    var dataselector = that.node.dataSelectorStr || '';
    $(that.elSelector + ' > .dataselector > span').html(dataselector);

    that.updateLayout();

};

viscomposer.ui.scenegraphWindow.node.prototype.emptyNode = function(){
    var node = this.node;
    var that = this;
    $(this.elSelector).remove();
    $(this.parentDom).append(
        '\n<div class="node" id="' + that.uuid + '">' +
        '<div class="dataselector"><span></span></div>' +
        '<div class="link"><img src="resource/image/scenegraphlink.png"></div>' +
        '<div class="main empty"><div class="label"><span>Drop Here</span></div></div>' +
        '<div class="graph"></div>' +
        '</div>');


    $(this.elSelector + " > .main").on("click", function(ev){

        ev.stopPropagation();
        viscomposer.app.disableRender();
        viscomposer.app.selectedNode = that.node;
        $("#workflowWindow > .title span").html('Transformation(' + that.node.label + ')');
        $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
        $(this).addClass("clicked");
        $(this).children('.layout').addClass("clicked");
        $(this).children('.label').addClass("clicked");
        $(".workflowWindow-sub").css("display", "none");

    });

    $(this.elSelector + " > .main > .label").on("drop", function(ev){

        ev.stopPropagation();
        viscomposer.app.disableRender();

        //empty node dropping

        var type = viscomposer.app.dragging.type;
        var node = that.node;
        var parent = node.parent;

        switch(type){
        case 'scatterplot':
            var workflow = node.workflow = new viscomposer.workflow.Workflow(node);
            workflow.header.filter=node.filter;
            node.type='blankview';
            node.label=viscomposer.util.processConflict2("Scatterplot",node.graph.nodeNames);

            properties={};
            properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();
            if(parent&&parent.workflow&&parent.workflow.layoutModule){
                properties=parent.workflow.layoutModule.childProperties(properties);
            }
            var view=new viscomposer.workflow.View(properties);
            workflow.addModule(view);

            var layout=new viscomposer.workflow.Scatterplot(properties);
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[0]);
            workflow.addLink(header.input[1].port2,layout.input[1]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'circle',properties);
        case 'barchart':
            var workflow = node.workflow = new viscomposer.workflow.Workflow(node);
            workflow.header.filter=node.filter;
            node.type='blankview';
            node.label=viscomposer.util.processConflict2("Bar Chart",node.graph.nodeNames);

            properties={};
            properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();
            if(parent&&parent.workflow&&parent.workflow.layoutModule){
                properties=parent.workflow.layoutModule.childProperties(properties);
            }
            var view=new viscomposer.workflow.View(properties);
            workflow.addModule(view);

            var layout=new viscomposer.workflow.BarChart(properties);
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[1]);
            workflow.addLink(header.input[1].port2,layout.input[2]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'rectangle',properties);
            break;
        case 'stackedbarchart':
            var workflow = node.workflow = new viscomposer.workflow.Workflow(node);
            workflow.header.filter=node.filter;
            node.type='blankview';
            node.label=viscomposer.util.processConflict2("Stacked Bar Chart",node.graph.nodeNames);

            properties={};
            properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();
            if(parent&&parent.workflow&&parent.workflow.layoutModule){
                properties=parent.workflow.layoutModule.childProperties(properties);
            }
            var view=new viscomposer.workflow.View(properties);
            workflow.addModule(view);

            var layout=new viscomposer.workflow.StackedBarChart(properties);
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[1]);
            workflow.addLink(header.input[1].port2,layout.input[2]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            var node2=viscomposer.app.scenegraph.newNode(node,'blankview',properties);
            var workflow2=node2.workflow;

            var layout2=new viscomposer.workflow.VerticalArray(properties);
            layout2.input[0].value='layout().classHeight';
            workflow2.addModule(layout2);

            var properties2={};
            properties2.underLayout=true;
            properties2=layout2.childProperties(properties2);
            properties2.color='layout().classColor';
            var node3=viscomposer.app.scenegraph.newNode(node2,'rectangle',properties2);
            break;

        default:

            var moduleClass=viscomposer.app.primitiveRegistry[type];
            if(moduleClass){
                var workflow = node.workflow = new viscomposer.workflow.Workflow(node);
                workflow.header.filter=node.filter;
                node.type=type;
                node.label=viscomposer.util.processConflict2(node.type,node.graph.nodeNames);

                var properties={};
                properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();
                if(parent&&parent.workflow&&parent.workflow.layoutModule){
                    properties=parent.workflow.layoutModule.childProperties(properties);
                }

                var module=new moduleClass(properties);
                workflow.addModule(module);
            }
        }

        $(that.elSelector).remove();
        that.dom = null;
        viscomposer.app.enableRender();
        viscomposer.app.tryRender();

    });


};

viscomposer.ui.scenegraphWindow.node.prototype.updateWorkflow = function(){
    var that = this;
    var node = that.node;
    $(that.elSelector + ' > .main > .label .message span').html(node.workflow.properties.num); 
    if(node.workflow.ui)
    {
        node.workflow.ui.update();
    }
    else
    {
        var newWorkflowWindow = new viscomposer.ui.workflowWindow(node.workflow);
    }
};

viscomposer.ui.scenegraphWindow.node.prototype.createDom = function(){
    var that = this;
    var node = that.node;
    this.dom=$(that.parentDom)
        .append('\n<div class="node" id="' + that.uuid + '">' +
            '<div class="dataselector">&nbsp;&nbsp;&nbsp;&nbsp;<span></span></div>' +
            '<div class="link"><img src="resource/image/scenegraphlink.png"></div>' +
            '<div class="main">' +
            '<div class="label">' +
            '<div class="text">' + node.label + '</div>' +
            '<div class="message">' +
            '<img src="' + viscomposer.app.imgPool[node.type] + '">' +
            '&nbsp;&nbsp;X&nbsp;&nbsp;<span></span>' +
            '</div></div>' +
            '<div class="layout close">' +
            '</div></div>' +
            '<div class="graph"></div>' +
            '</div>')[0];

};

viscomposer.ui.scenegraphWindow.node.prototype.updateLayout = function(){
    var that = this;
    var layoutHtml = '';
    var node = that.node;
    var workflow=node.workflow;
    if(workflow)
    {
        var module=workflow.layoutModule;
        $(that.elSelector + ' > .main > .layout').unbind("drop");
        if(module){
            var labels=module.layoutLabels;
            layoutHtml = '<div class="name">Composition:' + module.label + '</div>' +
                '<div class="content"><img src="' + module.layoutIcon + '"><div class="list">';
            for(var i=0,ni=labels.length;i<ni;++i){
                layoutHtml+='\n<div class="item" draggable="true" title="'+labels[i][1]+'" value="'+labels[i][2]+'">'+labels[i][0]+'</div>';
            }
            layoutHtml+=
                '</div></div>';
            $(that.elSelector + ' > .main > .layout').html(layoutHtml).attr("title",module.layoutDescription);
            $(that.elSelector + ' > .main > .layout').css("height", 20);
            $(that.elSelector + ' > .main > .layout').on("drop", function(){
                //layout dropping
                var type=viscomposer.app.dragging.type;
                var node=that.node;
                var properties={};
                var workflow=node.workflow;
                properties.underLayout=workflow&&workflow.hasLayout();
                if(workflow&&workflow.layoutModule){
                    properties=workflow.layoutModule.childProperties(properties);
                }
                if(viscomposer.app.layoutRegistry[type]){
                    viscomposer.app.scenegraph.newNode(that.node,type,properties);
                }
            });

            $(".layout > .content > .list .item").unbind("dragstart").on("dragstart", function(){
                viscomposer.app.draggingVar = $(this).attr("value");
            });
            $(that.elSelector + ' > .main > .layout').removeClass("empty");

        }
        else
        {
            layoutHtml += '<img src="resource/image/icon/zhankai.png">';
            $(that.elSelector + ' > .main > .layout').html(layoutHtml).attr("title","Drag a composition here.");
            $(that.elSelector + ' > .main > .layout').addClass("empty");
            $(that.elSelector + ' > .main > .layout').on("drop", function(){
                //empty layout dropping
                var moduleClass=viscomposer.app.layoutRegistry[viscomposer.app.dragging.type];
                if(moduleClass){
                    var node=that.node;
                    var properties={};
                    var parent=node.parent;
                    properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();
                    if(parent&&parent.workflow&&parent.workflow.layoutModule){
                        properties=node.parent.workflow.layoutModule.childProperties(properties);
                    }
                    var module=new moduleClass(properties);
                    that.node.workflow.addModule(module);
                }
            });
        }
        if(module || node.children.length>0)
        {
            $(that.elSelector + ' > .main > .layout').css("display", 'block');
        }
        else{
            $(that.elSelector + ' > .main > .layout').css("display", 'none');
        }
    }

};

viscomposer.ui.scenegraphWindow.node.prototype.clickListener = function(){

    var that = this;

    $(that.elSelector + ' > .main').on("click", function(ev){

        ev.stopPropagation();
        viscomposer.app.selectedNode = that.node;
        $("#workflowWindow > .title span").html('Transformation(' + that.node.label + ')');
        $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
        $(this).addClass("clicked");
        $(this).children('.layout').addClass("clicked");
        $(this).children('.label').addClass("clicked");
        $(".workflowWindow-sub").css("display", "none");
        $(".workflowWindow-sub#" + that.node.workflow.ui.uuid).css("display", "block");
        that.node.workflow.ui.update();

    });

};

viscomposer.ui.scenegraphWindow.node.prototype.rightClickListener = function(){

    var that = this;
    $(that.elSelector + ' > .main > .label').mousedown(function(event, a){
        event.stopPropagation();
        if(event.which == 3 || a == 'right'){
            $(that.elSelector + ' > .main > .label').click();
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
//                var uriContent="data:application/octet-stream,"+encodeURIComponent(str);
//                var newWindow=window.open(uriContent,'neuesDokument');
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
        }
    });
};

viscomposer.ui.scenegraphWindow.node.prototype.linkRightClickListener = function(){

    var that = this;

    $(that.elSelector + ' > .link').mousedown(function(event, a){

        event.stopPropagation();

        if(event.which == 3 || a == 'right'){
            var thisNode = that.node;
            var thisWorkflow = thisNode.workflow;
            $(that.elSelector + ' > .label').click();
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
        }
    });
};

viscomposer.ui.scenegraphWindow.node.prototype.dblclickListener = function(){
    var that = this;
    var node = that.node;
    $(that.elSelector + ' > .main').on("dblclick", function(ev){
        var layoutDom = $(that.elSelector + ' > .main > .layout');
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
};

viscomposer.ui.scenegraphWindow.node.prototype.dragoverListener = function(){
    var that = this;
    $(that.elSelector + " > .main > .label, " + that.elSelector + ' > .main > .layout').on("dragover", function(ev){
        ev.preventDefault();
    });
};

viscomposer.ui.scenegraphWindow.node.prototype.dropListener = function(){

    var that = this;
    $(that.elSelector + " > .main").on("drop", function(ev){
        ev.stopPropagation();
        var type = viscomposer.app.dragging.type;
        var node = that.node;
        var workflow=node.workflow;

        $(that.elSelector + ' > .main > .label').click();

        // node dropping

        switch(type){
        case 'scatterplot':
            properties={};
            properties.underLayout=workflow&&workflow.hasLayout();
            if(workflow&&workflow.layoutModule){
                properties=workflow.layoutModule.childProperties(properties);
            }
            var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Scatterplot');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.Scatterplot(properties);
            var workflow=node.workflow;
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[0]);
            workflow.addLink(header.input[1].port2,layout.input[1]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);

            viscomposer.app.scenegraph.newNode(node,'circle',properties);

            break;
        case 'barchart':
            properties={};
            properties.underLayout=workflow&&workflow.hasLayout();
            if(workflow&&workflow.layoutModule){
                properties=workflow.layoutModule.childProperties(properties);
            }
            var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Bar Chart');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.BarChart(properties);
            var workflow=node.workflow;
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[1]);
            workflow.addLink(header.input[1].port2,layout.input[2]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'rectangle',properties);
            break;
        case 'stackedbarchart':
            properties={};
            properties.underLayout=workflow&&workflow.hasLayout();
            if(workflow&&workflow.layoutModule){
                properties=workflow.layoutModule.childProperties(properties);
            }
            var node=viscomposer.app.scenegraph.newNode(node,'blankview',properties,'Stacked Bar Chart');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.StackedBarChart(properties);
            var workflow=node.workflow;
            workflow.addModule(layout);
            var header=workflow.header;
            header.addPort('x','x');
            header.addPort('y','y');
            workflow.addLink(header.input[0].port2,layout.input[1]);
            workflow.addLink(header.input[1].port2,layout.input[2]);

            properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            var node2=viscomposer.app.scenegraph.newNode(node,'blankview',properties);
            var workflow2=node2.workflow;

            var layout2=new viscomposer.workflow.VerticalArray(properties);
            layout2.input[0].value='layout().classHeight';
            workflow2.addModule(layout2);

            var properties2={};
            properties2.underLayout=true;
            properties2=layout2.childProperties(properties2);
            properties2.color='layout().classColor';
            var node3=viscomposer.app.scenegraph.newNode(node2,'rectangle',properties2);
            break;

        default:
            if(viscomposer.app.primitiveRegistry[type]){
                //primitive
                var properties={};
                var workflow=node.workflow;
                properties.underLayout=workflow&&workflow.hasLayout();
                if(workflow&&workflow.layoutModule){
                    properties=workflow.layoutModule.childProperties(properties);
                }
                var node = viscomposer.app.scenegraph.newNode(that.node,viscomposer.app.dragging.type,properties);
                viscomposer.app.selectedNode = node;
                viscomposer.app.tryRender();
            }else{                
                var moduleClass=viscomposer.app.layoutRegistry[type];
                if(moduleClass){
                    //layout
                    var module=new moduleClass(properties);
                    node.workflow.addModule(module);
                }
            }
        }

        viscomposer.app.tryRender();

    });

};

viscomposer.ui.scenegraphWindow.node.prototype.createNode = function(parentDom, node){

    return new viscomposer.ui.scenegraphWindow.node(parentDom, node);

};
