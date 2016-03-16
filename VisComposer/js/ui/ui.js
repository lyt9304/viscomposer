/**
 * Created by vag on 2015/3/2.
 */

viscomposer.ui = function(){

    viscomposer.Object.call(this);

    //把所有弹出窗居中；
    $(".window").css('left', function(){

        return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;

    });

//    $( document ).tooltip({
//        track: true
//    });

    document.oncontextmenu=function(){
        return false;
    };

    document.onselectstart=function(){
        return false;
    };
    /*document.onbeforecopy=function(){
        return false;
    };
    document.onselect=function(){
        if(document.selection)
            document.selection.empty();
    };
    document.oncopy=function(){
        document.selection.empty();
    };*/

    var that = this;
    $("body").mousemove(function(ev){

        viscomposer.app.mouseX = ev.clientX;
        viscomposer.app.mouseY = ev.clientY;

    }).keyup(function(){

        if (event.keyCode == 27)
        {
            viscomposer.app.connector.start = null;
            viscomposer.app.connector.end = null;
            viscomposer.app.connector.flag = false;
            $("#connect-temp").remove();

            viscomposer.app.toRemove = null;

            $("body > .menu").css("display", "none");
            $("body > .menucover").css("display", "none");

            $("#canvasWindow").removeClass("fullscreen");
            $("#canvasWindow > .title > span.fullscreen").css("display", "block");

        }


    });

    $(window).resize(function(){

        for(var i in that.workflowWindows)
        {
            that.workflowWindows[i].updateLinks();
        }

        //把所有弹出窗居中；
        $(".window").css('left', function(){

            return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;

        });

    });

    $("#mappingmenu > div, #canvasmenu > div").on("mouseover", function(){
        $(this).children(".submenu").css("display", "block");
    }).on("mouseout", function(){
        $(this).children(".submenu").css("display", "none");
    });


    this.windows = new viscomposer.ui.windows();
    this.dataWindow = new viscomposer.ui.dataWindow();

    var sceneGraph = new viscomposer.scenegraph.SceneGraph();
    viscomposer.app.scenegraph=sceneGraph;
    this.scenegraphWindow = new viscomposer.ui.scenegraphWindow(sceneGraph);

    this.workflowWindows = {};


};

viscomposer.ui.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.prototype.constructor = viscomposer.ui;

viscomposer.ui.prototype.windows = null;
viscomposer.ui.prototype.dataWindow = null;
viscomposer.ui.prototype.workflowWindows = {};
viscomposer.ui.prototype.scenegraphWindow = null;

viscomposer.ui.prototype.dragstart = function(event){

    var item = {};

    item.type = $(event.target).attr("type");
    item.id = $(event.target).attr("id") || null;
    item.json = $(event.target).attr("json");

    viscomposer.app.dragging = item;

};

viscomposer.ui.prototype.update = function(){

    this.dataWindow.update();
    //console.log("window updating");
    this.scenegraphWindow.update();
    //console.log("window updating");
    var workflowWindows = this.workflowWindows;
    for(var key in workflowWindows)
    {
        workflowWindows[key].update();
        //console.log("workflow updating");
    }

};
viscomposer.ui.highlightModule = function(module){
    var workflow = module.workflow;
    var workflowWindow = workflow.ui;
    viscomposer.app.selectedNode = workflow.node;
    $(workflow.node.ui.elSelector).click();
    $("#workflowWindow > .title span").html('Transformation(' + workflow.node.label + ')');
    $(".workflowWindow-sub").css("display", 'none');
    $(".workflowWindow-sub#" + workflowWindow.uuid).css("display", 'block');
    $(".workflowWindow-sub#" + workflowWindow.uuid + " .module").removeClass("module-clicked");
    $(".workflowWindow-sub#" + workflowWindow.uuid + " .module#" + module.ui.uuid).addClass("module-clicked");
    workflowWindow.update();
};

