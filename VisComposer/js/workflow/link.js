/**
 * @fileoverview link类
 */

viscomposer.workflow.Link=function(port1,port2){
	viscomposer.Object.call(this);

    this.port1=null;
    this.port2=null;
    this.modifier=null;
    this.workflow=null;

    if(port1&&port2){
        this.connect(port1,port2);
    }
};

viscomposer.workflow.Link.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.workflow.Link.prototype.constructor=viscomposer.workflow.Link;

viscomposer.workflow.Link.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Link();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Link.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);
    this.port1=rhs.port1;
    this.port2=rhs.port2;
    this.modifier=rhs.modifier;
    this.workflow=rhs.workflow;
};

viscomposer.workflow.Link.prototype.destroy=function(){
    this.disconnect();
    this.port1=null;
    this.port2=null;
    this.modifier&&this.modifier.destroy();
    this.modifier=null;
    this.workflow=null;
    viscomposer.Object.prototype.destroy.call(this);
};

viscomposer.workflow.Link.prototype.connect=function(port1,port2){
    this.port1=port1;
    this.port2=port2;
    this.workflow=port1.workflow||port1.module.workflow;

    port1.linkTo[port2.uuid]=this;

    var linkFrom;
    if(linkFrom=port2.linkFrom){
        linkFrom.destroy();
    }
    port2.linkFrom=this;

    this.workflow.linkList[this.uuid]=this;

    this.update();

    port1.onlink&&port1.onlink(port2);
    port2.onlink&&port2.onlink(port1);
}

viscomposer.workflow.Link.prototype.disconnect=function(){
    if(!this.port1||!this.port2){return;}

    var port1=this.port1,
        port2=this.port2;

    delete port1.linkTo[port2.uuid];
    port2.linkFrom=null;

    port1.onlink&&port1.onlink(null);
    port2.onlink&&port2.onlink(null);

    this.gen_removed=true;

    this.port1=this.port2=null;

    $(this.ui.elSelector).remove();
    $("#divforevents-" + this.ui.uuid).remove();
    delete this.ui;

    delete this.workflow.linkList[this.uuid];
};

viscomposer.workflow.Link.prototype.getVarname=function(){
    return this.port1.getVarname();
};

viscomposer.workflow.Link.prototype.getData=function(){    
    var ret=null;
    ret=this.port1.getData();

    return ret;
};

viscomposer.workflow.Link.prototype.update=function(){
}

viscomposer.workflow.Link.prototype.store=function(){
    var obj=viscomposer.Object.prototype.store.call(this);

    obj.objectType='link';

    obj.port1=this.port1.uuid;
    obj.port2=this.port2.uuid;

    return obj;
}

viscomposer.workflow.Link.load=function(hashmap,obj,workflow){
    var link=new viscomposer.workflow.Link();

    hashmap[obj.uuid]=link;

    //link.modifier=obj.modifier&&viscomposer.workflow.Modifier.load(hashmap,obj.modifier,link);

    var port1=hashmap[obj.port1]||viscomposer.Object.hashmap.get(obj.port1);
    var port2=hashmap[obj.port2];
    if(port1&&port2){
        link.connect(port1,port2,workflow);
        return link;
    }else{
        return;
    }
}