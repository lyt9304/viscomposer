/**
 * @fileoverview 场景树节点类
 */

viscomposer.scenegraph.Node=function(graph,parent,empty){
	viscomposer.Object.call(this);

    this.label='Node';
    this.children=[];
    this.properties={};
    if(!empty){
        this.workflow=new viscomposer.workflow.Workflow(this);
    }

    this.graph=graph;
    this.parent=parent;
};

viscomposer.scenegraph.Node.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.scenegraph.Node.prototype.constructor=viscomposer.scenegraph.Node;

viscomposer.scenegraph.Node.prototype.clone=function(){
    var newObj=new viscomposer.scenegraph.Node(this.graph);
    newObj.copy(this);

    return newObj;
}

viscomposer.scenegraph.Node.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);

    this.label=rhs.label;

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.scenegraph.Node.prototype.destroy=function(){
    viscomposer.Object.prototype.destroy.call(this);

    this.label='Node';
    this.children=[];
    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    this.workflow&&this.workflow.destroy();
    this.workflow=null;
};

viscomposer.scenegraph.Node.prototype.update=function(){
    this.workflow.update();

    var children=this.children;
    for(var i=0,ni=this.children.length;i<ni;++i){
        children[i].update();
    }
}

viscomposer.scenegraph.Node.prototype.getEnv=function(){
    return this.workflow&&this.workflow.getEnv()||{};
}
viscomposer.scenegraph.Node.prototype.getEnv_=function(){
    return this.workflow&&this.workflow.getEnv_()||{};
}

viscomposer.scenegraph.Node.prototype.store=function(){
    var obj=viscomposer.Object.prototype.store.call(this);

    obj.workflow=this.workflow&&this.workflow.store();
    var children=obj.children=[];
    for(var i=0,ni=this.children.length;i<ni;++i){
        children.push(this.children[i].store());
    }

    return obj;
}

viscomposer.scenegraph.Node.load=function(hashmap,obj,graph,parent){
    var node=new viscomposer.scenegraph.Node(graph,parent);

    node.workflow=obj.workflow&&viscomposer.workflow.Workflow.load(hashmap,obj.workflow);
    if(node.workflow){
        node.workflow.node=node;
    }

    var children=node.children=[];
    for(var i=0,ni=obj.children.length;i<ni;++i){
        children.push(viscomposer.scenegraph.Node.load(hashmap,obj.children[i],graph,parent));
    }

    return node;
};