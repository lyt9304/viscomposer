viscomposer.ui.Manager=(function(){

	var manager = function(){
        this.mousePos = [0, 0];
        this.connector = {
            start: null,
            end: null,
            flag: false //拉出来的线是否能生成一个新的模块
        };
        this.dragging = {
            category: null,
            type: null,
            id: null,
            json: null,
        };
        this.drawing = null;
        this.toRemove = null;
        this.selectedNode = null;
        this.renderEnabled = null;
        this.dom = null;
        this.resourcesWindow = new viscomposer.ui.ResourcesWindow();
        this.workflowWindow = new viscomposer.ui.WorkflowWindow();
        this.scenegraphWindow = new viscomposer.ui.ScenegraphWindow();
        //_canvasWindow = new viscomposer.ui.CanvasWindow();

        this.uiInit();
        this.listener();
	};

	var prototype = manager.prototype;

    prototype.uiInit = function(){
        this.dom = $("body")[0];
        //把所有弹出窗居中；
        $(this.dom).find(".window").css('left', function(){
            return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
        });
    };

    prototype.listener = function(){
        var dom = this.dom;
        var that = this;
        //记录鼠标位置
        $(dom).on("mousemove", function(ev){
            //ev.stopPropagation();
            that.mousePos = [ev.clientX, ev.clientY];
        });
        //document.oncontextmenu=function(){
        //    return false;
        //};
        document.onselectstart=function(){
            return false;
        };
        //document.onbeforecopy=function(){
        //    return false;
        //};
        document.onselect=function(){
            if(document.selection)
                document.selection.empty();
        };
        //document.oncopy=function(){
        //    document.selection.empty();
        //};
        //键盘按键相应
        $(dom).on("keyup", function(evt){
            evt.stopPropagation();
            //按ECS键的效果：remove正在创建的link、....
            if (evt.keyCode == 27)
            {
                this.resetConnector();
                //TODO
            }
        });
        //导航栏按钮相应
        //$(dom).on("click", ".top-navitem", function(){
        //    var id = $(this).attr("id");
        //    if(id == 'import'){
        //        $("#dataimportingwindow").css("display", "block");
        //    }else{
        //        //TODO
        //    }
        //});
    };

    prototype.loadScenegraph = function(scenegraph){
        this.scenegraphWindow.loadScenegraph(scenegraph);
    };

    prototype.updateCanvas = function(){
        //_canvasWindow.update();
        //TODO rendering
    };

    prototype.resetDragging = function(){
        this.dragging = {
            category: null,
            type: null,
            id: null,
            json: null,
        };
    };

    prototype.resetConnector = function(){
        this.connector = {
            start: null,
            end: null,
            flag: false,
        }
    };

    prototype.enableRender=function(){
        this.renderEnabled = true;
    };

    prototype.disableRender=function(){
        this.renderEnabled = false;
    };

	prototype.resourceItemDragstart = function(ev){
        this.dragging = {
            category: ev.target.getAttribute("category") || null,
            type: ev.target.getAttribute("type") || null,
            id: ev.target.getAttribute("id") || null,
            json: ev.target.getAttribute("json") || null
        };
        this.scenegraphWindow.highlight();
	};

    prototype.resourceItemClick = function(ev){
        this.canvasWindow.highlight();
        this.drawing = event.target.getAttribute("type");
        var painter = event.target.getAttribute("painter");
        //TODO beginPaint
    };

    prototype.moduleItemDragstart = function(ev){
        this.dragging = {
            category: 'module',
            type: ev.target.getAttribute("type") || null,
            id: ev.target.getAttribute("id") || null,
            json: ev.target.getAttribute("json") || null
        };
        this.workflowWindow.highlight();
    };

    prototype.dataItemDragstart = function(ev){
        this.dragging = {
            category: "data",
            type: ev.target.getAttribute("type") || null,
            id: ev.target.getAttribute("id") || null,
            json: ev.target.getAttribute("json") || null
        };
        this.workflowWindow.highlight();
    };


    return manager;
})();