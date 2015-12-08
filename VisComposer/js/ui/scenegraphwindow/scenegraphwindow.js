/**
 * Created by vag on 2015/3/5.
 */

viscomposer.ui.scenegraphWindow = function(graph){
    viscomposer.Object.call(this);
    this.graph = graph;
    this.graph.ui = this;
    this.elSelector = "#scenegraphWindow";
    this.update();
    this.rootListener();
    this.clickListener();
    this.dragoverListener();
};

viscomposer.ui.scenegraphWindow.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.scenegraphWindow.prototype.constructor = viscomposer.ui.scenegraphWindow;

viscomposer.ui.scenegraphWindow.prototype.update = function(){
    var that = this;
    var roots = that.graph.roots;
    for(var i = 0; i < roots.length; i++)
    {
        if(roots[i].ui)
        {
            roots[i].ui.update();
        }
        else
        {
            that.createNode(roots[i]);
        }
    }
    if(viscomposer.app.selectedNode)
    {
        $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
        $(viscomposer.app.selectedNode.ui.elSelector + ' > .main > .label').addClass("clicked");
        $(viscomposer.app.selectedNode.ui.elSelector + ' > .main > .layout').addClass("clicked");
        $(viscomposer.app.selectedNode.ui.elSelector + ' > .main').addClass("clicked");
        $(".workflowWindow-sub").css("display", "none");
        $(".workflowWindow-sub#" + viscomposer.app.selectedNode.workflow.ui.uuid).css("display", "block");
    }
    that.updateNodeSize('root');
    var properties = that.graph.properties;
    var color = properties.color;
    var h = properties.height;
    var w = properties.width;
    var rootDom = $("#scenegraphWindow > .content > .label > .wrap");
    rootDom.children('.color').val(color);
    rootDom.children('.colorbtn').css("background-color", color);
    rootDom.children('.width').children("input").val(w);
    rootDom.children('.height').children("input").val(h);
};

viscomposer.ui.scenegraphWindow.prototype.rootListener = function(){
    var that = this;
    var properties = this.graph.properties;
    var wrapDom = $("#graph-root").siblings(".label").children(".wrap");
    wrapDom.children("input[type='color']").on("change", function(ev){
        properties.color = $(this).val();
        viscomposer.app.tryRender();
    });
    wrapDom.children(".width").children("input").on("change", function(ev){
        properties.width = $(this).val();
        viscomposer.app.tryRender();
    });
    wrapDom.children(".height").children("input").on("change", function(ev){
        properties.height = $(this).val();
        viscomposer.app.tryRender();
    });

    $("#scenegraphWindow > .content > .label").on("drop", function(ev){
        ev.stopPropagation();

        //root dropping
        var type=viscomposer.app.dragging.type;
        viscomposer.app.disableRender();

        switch(type){
        case 'scatterplot':
            var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Scatterplot');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.Scatterplot({});
            var workflow=node.workflow;
            workflow.addModule(layout);
            
            var properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'circle',properties);
            break;
        case 'barchart':
            var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Bar Chart');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.BarChart({});
            var workflow=node.workflow;
            workflow.addModule(layout);
            
            var properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'rectangle',properties);
            break;
        case 'parallelcoordinates':
            var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Parallel Coordinates');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.ParallelCoordinates({});
            var workflow=node.workflow;
            workflow.addModule(layout);
            
            var properties={};
            properties.underLayout=true;
            properties=layout.childProperties(properties);
            viscomposer.app.scenegraph.newNode(node,'polyline',properties);
            break;
        case 'stackedbarchart':
            var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Stacked Bar Chart');
            viscomposer.app.selectedNode = node;
            var layout=new viscomposer.workflow.StackedBarChart({});
            var workflow=node.workflow;
            workflow.addModule(layout);

            var properties={};
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
                viscomposer.app.scenegraph.newNode(null,type);
            }
        }

        viscomposer.app.enableRender();

    });

};

viscomposer.ui.scenegraphWindow.prototype.createNode = function(node){

    return new viscomposer.ui.scenegraphWindow.node("#graph-root", node);

};


viscomposer.ui.scenegraphWindow.prototype.clickListener = function(){
    var that = this;
    $(that.elSelector + " > .content").on("click", function(){
        $(that.elSelector + " .label, " + that.elSelector + ' .layout, ' + that.elSelector + ' .main').removeClass("clicked");
        $(".workflowWindow-sub").css("display", "none");
    });
};

viscomposer.ui.scenegraphWindow.prototype.dragoverListener = function(){

    var that = this;

    $(that.elSelector + " > .content").on("dragover", function(ev){
        ev.preventDefault();
    });
};


viscomposer.ui.scenegraphWindow.prototype.updateNodeSize = function(node){

    var padding = 5;
    var children, childrenNum;
    if(node == 'root')
    {
        children = this.graph.roots;
        childrenNum = children.length;
        if(childrenNum > 0)
        {
            var rootWidth = 470;
            var childrenNodeWidth = (rootWidth - padding * (childrenNum-1)) / childrenNum;
            $("#graph-root > .node").width(childrenNodeWidth);
            for(var i = 0; i < children.length; i++)
            {
                this.updateNodeSize(children[i]);
            }
        }
        else
        {
            return false;
        }
    }
    else
    {
        children = node.children;
        childrenNum = children.length;
        if(childrenNum > 0)
        {
            var nodeWidth = $(node.ui.elSelector).width();
            var childrenNodeWidth = (nodeWidth - padding * (childrenNum-1)) / childrenNum;
            //console.log(childrenNodeWidth);
            $(node.ui.elSelector + ' > .graph > .node').width(childrenNodeWidth);
            for(var i = 0; i < children.length; i++)
            {
                this.updateNodeSize(children[i]);
            }
        }
        else
        {
            return false;
        }
    }
};



