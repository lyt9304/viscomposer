viscomposer.ui.ScenegraphWindow=(function(){
	var _scenegraph=null;

    //dom:scenegraphWindow
    //graphRoot:graph-root

	var ScenegraphWindow=function(){
		this.dom=$("#scenegraphWindow")[0];
		this.graphRoot=$("#graph-root")[0];
	};

	var prototype=ScenegraphWindow.prototype;

	Object.defineProperty(prototype,"scenegraph",{
		get:function(){return _scenegraph;},
		set:function(x){_scenegraph=x;}
	});

	prototype.init=function(scenegraph_in){

		this._scenegraph=scenegraph_in;
        var scenegraph=this._scenegraph;
		var dom=this.dom;
		this.update();
		/* 添加事件响应 */
		var that=this;

		//root node
		var properties = scenegraph.properties;

	    var wrapDom = $(this.graphRoot).siblings(".label").children(".wrap");

	    wrapDom.children("input[type='color']").on("change", function(ev){
	        properties.color = $(this).val();
	        that.updateRoot();
	        scenegraph.updateCanvas();
	        //viscomposer.app.tryRender();
	        //TODO
	    });
	    wrapDom.children(".width").children("input").on("change", function(ev){
	        properties.width = $(this).val();
	        that.updateRoot();
	        scenegraph.updateCanvas();
	        //viscomposer.app.tryRender();
	        //TODO
	    });
	    wrapDom.children(".height").children("input").on("change", function(ev){
	        properties.height = $(this).val();
	        that.updateRoot();
	        scenegraph.updateCanvas();
	        //viscomposer.app.tryRender();
	        //TODO
	    });

		//blank space
	    $(dom).children(".content").on("click", function(){
	        $(dom).find(".label, .layout, .main").removeClass("clicked");
	        $(".workflowWindow-sub").css("display", "none");
	    }).on("dragover", function(ev){
	        ev.preventDefault();
	    }).children(".label").on("drop", function(ev){
	        ev.stopPropagation();

            console.log("onDrop");

	        //viscomposer.app.disableRender();
            console.log("draggingtype:"+viscomposer.app.uiManager.dragging.type);



	        scenegraph.root.appendNewForm(viscomposer.app.uiManager.dragging.type);
	        //viscomposer.app.enableRender();*/
	        //TODO

	    });

	    this.update();
	};

	prototype.update=function(){
        var scenegraph = this._scenegraph;
		if(!scenegraph){return;}
	    var that = this;
	    //if(viscomposer.app.selectedNode)
	    //{
	    //    $("#scenegraphWindow > .content .label, #scenegraphWindow > .content .layout, #scenegraphWindow > .content .main").removeClass("clicked");
	    //    $(viscomposer.app.selectedNode.ui.elSelector + ' > .main > .label').addClass("clicked");
	    //    $(viscomposer.app.selectedNode.ui.elSelector + ' > .main > .layout').addClass("clicked");
	    //    $(viscomposer.app.selectedNode.ui.elSelector + ' > .main').addClass("clicked");
	    //    $(".workflowWindow-sub").css("display", "none");
	    //    $(".workflowWindow-sub#" + viscomposer.app.selectedNode.workflow.ui.uuid).css("display", "block");
	    //}
	    //TODO
        //$("#graph-root").html("");
        //console.log("after clear graph-root");

	    this.updateRoot();
	    this.updateNodeSize(scenegraph.root);
	};

	prototype.updateNode=function(node){
        //如果node没有定义就return
        //如果node的ui_没有定义就新建
        if(node===null||node===undefined){return;}
        if(node.ui){
			node.ui.update();
        }else{
			var ui=new viscomposer.ui.NodeUI(node);
			//var parentDom=node.parent.ui_.container;
			//ui.appendTo(parentDom);
			node.ui=ui;
        }

        //递归更新子节点
		var children=node.children;
		for(var i=0,ni=children.length;i<ni;++i){
			this.updateNode(children[i]);
		}
	};

	prototype.updateRoot=function(){
        //修改canvas根节点的数据
        var scenegraph = this._scenegraph;
	    var properties = scenegraph.properties;
	    var color = properties.color;
	    var h = properties.height;
	    var w = properties.width;
		var rootDom=$("#scenegraphWindow > .content > .label > .wrap");
	    rootDom.children('.color').val(color);
	    rootDom.children('.colorbtn').css("background-color", color);
	    rootDom.children('.width').children("input").val(w);
	    rootDom.children('.height').children("input").val(h);

	    var rootNode=scenegraph.root;
    	if(!rootNode.ui){
    		rootNode.ui={dom:this.graphRoot,container:this.graphRoot};
    	}
		var children=rootNode.children;
		for(var i=0,ni=children.length;i<ni;++i){
			this.updateNode(children[i]);
		}
	};

	prototype.updateNodeSize = function(node){
		if(!node){
			return;
		}
	    var padding = 5;
	    var dom=node.ui.dom;
	    var container=node.ui.container;
        var children = node.children;
        var childrenNum = children.length;
        if(childrenNum > 0)
        {

            var nodeWidth = $(dom).width();
            var childrenNodeWidth = (nodeWidth - padding * (childrenNum-1)) / childrenNum;
            $(container).children(".node").width(childrenNodeWidth);
            for(var i = 0,ni=children.length; i < ni; i++)
            {
                this.updateNodeSize(children[i]);
            }
        }
	};

    prototype.highlight = function(){
        var dom = this.dom;
        $(dom).children(".title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#scenegraphWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);
    };

	//prototype.addNode=function(node){
	//	var parent=node.parent;
	//	if(parent===undefined||parent===null){
	//		var ui={
	//			dom:this.graphRoot,
	//			container:this.graphRoot,
	//			children:[]
	//		};
	//		return ui;
	//	}else{
	//		var ui=new viscomposer.ui.NodeUI(node);
	//		ui.appendTo(parent.ui.container);
	//		return ui;
	//	}
	//};

	return ScenegraphWindow;
})();