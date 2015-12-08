viscomposer.ui.Manager=(function(){

	var resourcesWindow = null,
        scenegraphWindow = null,
        canvasWindow = null,
        workflowWindow = null,
		mousePos = [0, 0],
		connector = {
			start: null,
			end: null,
			flag: false //拉出来的线是否能生成一个新的模块
		},
		dragging = {
            type: null,
            id: null,
            json: null,
        },
        drawing = null,
        toRemove = null,
        renderEnabled=false;


	var manager = function(){
		this.dom = $("body");
        resourcesWindow = new viscomposer.ui.ResourcesWindow();
        workflowWindow = new viscomposer.ui.WorkflowWindow();
        scenegraphWindow = new viscomposer.ui.ScenegraphWindow();
        canvasWindow = new viscomposer.ui.CanvasWindow();
        this.uiSetup();
        this.listener();
	};

	var prototype = manager.prototype;

	Object.defineProperties(prototype, {
        dataWindow: {
            get:function(){return dataWindow;},
            set:function(x){dataWindow=x;}
        },//数据窗口
        scenegraphWindow: {
            get:function(){return scenegraphWindow;},
            set:function(x){scenegraphWindow=x;}
        },//场景图窗口
        canvasWindow: {
            get:function(){return canvasWindow;},
            set:function(x){canvasWindow=x;}
        },//绘制窗口
        workflowWindow: {
            get:function(){return workflowWindow;},
            set:function(x){workflowWindow=x;}
        },//工作流窗口
        resourcesWindow: {
            get:function(){return resourcesWindow;},
            set:function(x){resourcesWindow=x;}
        },//工作流窗口
		mousePos: {
			get: function(){ return mousePos; },
			set: function(x){ mousePos[0] = x[0]; mousePos[1] = x[1]; }
		},//鼠标位置
		connector: {
			get: function(){ return connector; },
			set: function(x){ connector.start = x.start; connector.end = x.end; connector.flag = x.flag; }
		},//记录未完成的链接线段信息
		dragging: {
			get: function(){ return dragging; },
			set: function(x){ dragging.type = x.type; dragging.id = x.id; dragging.json = x.json; }
		},//记录拖拽资源的信息
		drawing: {
			get: function(){ return drawing; },
			set: function(x){ drawing = x; }
		},//记录点击了那个资源
        toRemove: {
            get: function(){ return toRemove; },
			set: function(x){ toRemove = x; }
        },//记录要移除的module
        renderEnabled: {
            get: function(){ return renderEnabled; },
            set: function(x){ renderEnabled = x; }
        },
    });

    prototype.uiSetup = function(){
        var uiDom = this.dom;
        //把所有弹出窗居中；
        uiDom.find(".window").css('left', function(){
            return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
        });
        uiDom.on("click", '#removelinkmenu', function(){
            $(this).css("display", "none");
            toRemove = null;
        });
        uiDom.on("click", '#removemodulemenu', function(){
            $(this).css("display", "none");
            toRemove = null;
        });
        uiDom.on("click", '#colormappingwindow .content input', function(){
            var thisDom = $(this);
            thisDom.siblings("span").html(thisDom.val());
        });
        uiDom.on("click", '#colormappingwindow .title img', function(){
            $("#colormappingwindow").css("display", "none");
        });
        uiDom.on("click", '#canvasWindow > .title > span.fullscreen', function(){
            $(this).css("display", "none");
            $("#canvasWindow > .title > span.normal").css("display", "block");
            $("#canvasWindow").addClass("fullscreen");
        });
        uiDom.on("click", '#canvasWindow > .title > span.normal', function(){
            $(this).css("display", "none");
            $("#canvasWindow > .title > span.fullscreen").css("display", "block");
            $("#canvasWindow").removeClass("fullscreen");
        });
        //TODO
    };

    prototype.listener = function(){
        document.oncontextmenu=function(){
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
        var uiDom = this.dom;
        //记录鼠标位置
        uiDom.on("mousemove", function(ev){
            ev.stopPropagation();
            mousePos = [ev.clientX, ev.clientY];
        });
        //键盘按键相应
        uiDom.on("keyup", function(evt){
            evt.stopPropagation();
            //按ECS键的效果：remove正在创建的link、....
            if (evt.keyCode == 27)
            {
                connector.start = null;
                connector.end = null;
                connector.flag = false;
                /*$("#connect-temp").remove();

                 viscomposer.app.toRemove = null;

                 $("body > .menu").css("display", "none");
                 $("body > .menucover").css("display", "none");

                 $("#canvasWindow").removeClass("fullscreen");
                 $("#canvasWindow > .title > span.fullscreen").css("display", "block");*/
                //TODO
            }
        });
        //窗口resize相应
        uiDom.on("resize", function(){
            //console.log("lyt:"+this);
            //var uiDom = this.dom;
            //var uiDom=$("body");
            //uiDom.children(".window").css('left', function(){
            //    console.log("counting");
            //    return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
            //});
            // for(var i in that.workflowWindows)
            // {
            //     that.workflowWindows[i].updateLinks();
            // }
            //TODO

            //that.updateCanvas();
        });
        //导航栏按钮相应
        uiDom.on("click", ".top-navitem", function(){
            var id = $(this).attr("id");
            if(id == 'import'){
                $("#dataimportingwindow").css("display", "block");
            }else{
                //TODO
            }
        });
        //TODO

    };


    prototype.resetDragging = function(){
        dragging = {
            type: null,
            id: null,
            json: null,
        };
    };

    prototype.resetConnector = function(){
        connector.start = null;
        connector.end = null;
        connector.flag = false;
    };

    //prototype.updateCanvas=function(){
   	//	//把所有弹出窗居中
	//    $(".window").css('left', function(){
	//        return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
	//    });
	//};

    prototype.createScenegraph=function(scenegraphObj){
        //当外部创建好scenegraph了之后，会使用这个函数来更新scenegraphwindow中的scenegraph
		this.scenegraphWindow.init(scenegraphObj);
    };

    prototype.updateScenegraph=function(){
		scenegraphWindow.update();
    };

	prototype.updateWorkflow=function(workflow){
        //这个updateWorkflow是更新window下的显示，如果结点有workflow的ui那么久显示，没有就新建一个ui
        console.log("uiManerger->updateWorkflow:"+workflow);
		if(!workflow.ui){
			workflow.ui=new viscomposer.ui.WorkflowUI(workflow);
            workflowWindow.workflowUIs[workflow.ui.uuid]=workflow.ui;
			//workflow.ui_.appendTo($("#workflowWindow > .content")[0]);
		}
		workflow.ui.update();
        //TODO: workflowWindow.update();
	};

    prototype.updateCanvas=function(){
        //set width/height/color
        //TODO

        if(!renderEnabled){return;}
        this.disableRender();

        try{
            this.scenegraphWindow._scenegraph.run(simplify);
            this.scenegraphWindow._scenegraph.run(simplify);
        }catch(e){
            console.log(e.stack.split('\n').slice(0,2).join('\n'));
        }
        this.updateScenegraph();
        this.enableRender();

    };

    prototype.enableRender=function(){
        renderEnabled=true;
    };

    prototype.disableRender=function(){
        renderEnabled=false;
    };

	prototype.resourcesDragstart = function(ev){
        dragging.type = event.target.getAttribute("type");
        dragging.id = event.target.getAttribute("id") || null;
        dragging.json = event.target.getAttribute("json")||null;
        scenegraphWindow.highlight();
	};
    prototype.resourcesClick = function(ev){
        canvasWindow.highlight();
        drawing = event.target.getAttribute("type");
        var painter = event.target.getAttribute("painter");
        console.log(drawing + '      ' + painter);
        //viscomposer.Environment.handler.beginPaint(function(properties){
        //    //var selectedNode = viscomposer.app.selectedNode;
        //    var selectedNode=properties.parent;
        //    if(!selectedNode)
        //    {
        //        viscomposer.app.scenegraph.newNode(null,viscomposer.app.drawing,properties);
        //    }else
        //    {
        //        selectedNode.graph.newNode(selectedNode, viscomposer.app.drawing,properties);
        //    }
        //    viscomposer.app.drawing = null;
        //    $("body > #resources > .content > #layout > .content table td, body > #resources > .content > #primitive > .content table.primitives td").removeClass('clicked');
        //},painter);
        //TODO beginPaint
    };

    prototype.modulesDragstart = function(ev){
        dragging.type = event.target.getAttribute("type");
        dragging.id = event.target.getAttribute("id") || null;
        dragging.json = event.target.getAttribute("json")||null;
        workflowWindow.highlight();
    };

    return manager;
})();