viscomposer.scenegraph.Node=(function(){
	var Node=viscomposer.VObject.define("Node",null,function(scenegraph,options){//options:parent,isEmpty,isRoot
		options=options||{};

		this.label=null;
	    this.children=null;
        this.isRoot=null;
	    this.scenegraph=scenegraph;
	    this.parent=options.parent;

		this.label='Node';
	    this.children=[];
	    this.properties={};
	    this.workflow=null;

        //空节点和根节点没有workflow
		if(options.isRoot){
            this.isRoot=true;
		}else{
            this.isRoot=false;
			if(options.isEmpty){
                //空结点
			}else{
				this.workflow=new viscomposer.workflow.Workflow(this,{});
			}
		}
		
		//viscomposer.app.uiManager.updateScenegraph();
	},["label","children","scenegraph","parent","properties","workflow","width"]);

	var prototype=Node.prototype;

	prototype.update=function(/*recursive*/){
		//update self
		//TODO
        this.workflow.update();

        var recursive=true;//TODO

		if(recursive){
			//update children
		    var children=this.children;
		    for(var i=0,ni=children.length;i<ni;++i){
		        children[i].update(recursive);
		    }
		}
	};

	prototype.appendNewForm=function(type){

        switch(type){
            //case 'scatterplot':
            //    var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Scatterplot');
            //    viscomposer.app.selectedNode = node;
            //    var layout=new viscomposer.workflow.Scatterplot({});
            //    var workflow=node.workflow;
            //    workflow.addModule(layout);
            //
            //    var properties={};
            //    properties.underLayout=true;
            //    properties=layout.childProperties(properties);
            //    viscomposer.app.scenegraph.newNode(node,'circle',properties);
            //    break;
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
            //case 'parallelcoordinates':
            //    var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Parallel Coordinates');
            //    viscomposer.app.selectedNode = node;
            //    var layout=new viscomposer.workflow.ParallelCoordinates({});
            //    var workflow=node.workflow;
            //    workflow.addModule(layout);
            //
            //    var properties={};
            //    properties.underLayout=true;
            //    properties=layout.childProperties(properties);
            //    viscomposer.app.scenegraph.newNode(node,'polyline',properties);
            //    break;
            //case 'stackedbarchart':
            //    var node=viscomposer.app.scenegraph.newNode(null,'blankview',{},'Stacked Bar Chart');
            //    viscomposer.app.selectedNode = node;
            //    var layout=new viscomposer.workflow.StackedBarChart({});
            //    var workflow=node.workflow;
            //    workflow.addModule(layout);
            //
            //    var properties={};
            //    properties.underLayout=true;
            //    properties=layout.childProperties(properties);
            //    var node2=viscomposer.app.scenegraph.newNode(node,'blankview',properties);
            //    var workflow2=node2.workflow;
            //
            //    var layout2=new viscomposer.workflow.VerticalArray(properties);
            //    layout2.input[0].value='layout().classHeight';
            //    workflow2.addModule(layout2);
            //
            //    var properties2={};
            //    properties2.underLayout=true;
            //    properties2=layout2.childProperties(properties2);
            //    properties2.color='layout().classColor';
            //    var node3=viscomposer.app.scenegraph.newNode(node2,'rectangle',properties2);
            //    break;
            default:
                //TODO undefined
                //if(viscomposer.app.primitiveRegistry[type]){
                    //prototype.newNode=function(parent,type,properties,predefinedLabel)
                    viscomposer.app.uiManager.scenegraphWindow._scenegraph.newNode(this,type);
                //}
        }

		this.scenegraph.update();
	};

    prototype.getEnv=function(){
        return this.workflow&&this.workflow.getEnv()||{};
    };

    prototype.getEnv_=function(){
        return this.workflow&&this.workflow.getEnv_()||{};
    };

    //store

    //load

	return Node;
})();