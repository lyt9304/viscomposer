/**
 * Created by vag on 2015/3/6.
 */
viscomposer.ui.windows = function(){
    viscomposer.Object.call(this);
    //nav window ImportData 单击导入文件事件
    $(".top-navitem#import").on("click", function(){
        $("#dataimportingwindow").css("display", "block");
    });

    //templates window and resources window 给所有的图标（图元，布局等元素）添加拖拽事件并且记录到dragging对象中
    $(" body > #resources > .content > #form > .content table img, " +
        "body > #resources > .content > #primitive > .content table img, " +
        "body > #resources > .content > #array > .content table img").on("dragstart", function(event){
        var dom = $(event.target);
        viscomposer.app.dragging = {
            type: dom.attr("type"),
            id: dom.attr("id"),
            json: dom.attr("json")
        };

        //这里相当于一次高亮操作
        $("#scenegraphWindow > .title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#scenegraphWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);

    });

    //workflow中的模块图标的拖拽事件
    $("body #modules img").on("dragstart", function(event){
        var dom = $(event.target);
        viscomposer.app.dragging = {
            type: dom.attr("type"),
            id: dom.attr("id"),
            json: dom.attr("json")
        };

        $("#workflowWindow > .title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#workflowWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);

    });

    $("body > #resources > .content > #form > .content table img, " +
        "body > #resources > .content > #primitive > .content table img").on("click", function(){

        //canvas高亮
        $("#canvasWindow > .title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#canvasWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);

        $("body > #resources > .content > #form > .content table td, body > #resources > .content > #primitive > .content table td").removeClass('clicked');
        $(this).parents("td").addClass("clicked");
        viscomposer.app.drawing = $(this).attr("type");
        var painter=$(this).attr("painter");

        viscomposer.Environment.handler.beginPaint(function(properties){
            //var selectedNode = viscomposer.app.selectedNode;
            var selectedNode=properties.parent;
            if(!selectedNode)
            {
                viscomposer.app.scenegraph.newNode(null,viscomposer.app.drawing,properties);
            }else
            {
                selectedNode.graph.newNode(selectedNode, viscomposer.app.drawing,properties);
            }
            viscomposer.app.drawing = null;
            $("body > #resources > .content > #form > .content table td, body > #resources > .content > #primitive > .content table.primitives td").removeClass('clicked');
        },painter);
    });


    //几个右键菜单
    $("#removelinkmenu").on("click", function(){
        $(this).css("display", "none");
        viscomposer.app.toRemove = null;
    });
    $("#removemodulemenu").on("click", function(){
        $(this).css("display", "none");
        viscomposer.app.toRemove = null;
    });

    //color mapping窗口响应
    $("#colormappingwindow .content input").on("change", function(){
        var thisDom = $(this);
        thisDom.siblings("span").html(thisDom.val());
    });
    $("#colormappingwindow .title img").on("click", function(){
        $("#colormappingwindow").css("display", "none");
    });

    $("#canvasWindow > .title > span.fullscreen").on("click", function(){
        $(this).css("display", "none");
        $("#canvasWindow > .title > span.normal").css("display", "block");
        $("#canvasWindow").addClass("fullscreen");
    });
    $("#canvasWindow > .title > span.normal").on("click", function(){
        $(this).css("display", "none");
        $("#canvasWindow > .title > span.fullscreen").css("display", "block");
        $("#canvasWindow").removeClass("fullscreen");
    });

};

viscomposer.ui.windows.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.windows.prototype.constructor = viscomposer.ui.windows;