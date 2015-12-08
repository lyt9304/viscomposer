/**
 * @fileoverview port类
 */

viscomposer.workflow.Port=function(type){
	viscomposer.Object.call(this);

	this.label=null;
    this.varname=null;
    this.module=null;
    this.workflow=null;
    this.type=type||'none';

    this.data=null;

    if(!type){
        console.log('warning: type not defined.');
    }

    var linkType;
    switch(type){
    case 'input':case 'map':
        linkType='input';break;
    case 'output':case 'geometry':case 'transform':case 'data':case 'scale':case 'layout':
        linkType='output';break;
    default:
        linkType='none';
    }

    this.linkType=linkType||'none';
    this.linkFrom=null;
    this.linkTo={};
    this.onlink=null;
};

viscomposer.workflow.Port.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.workflow.Port.prototype.constructor=viscomposer.workflow.Port;

viscomposer.workflow.Port.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Port(this.type);
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Port.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);
    this.label=rhs.label;
    this.varname=rhs.varname;
    this.module=rhs.module;
    this.workflow=rhs.workflow;
    this.type=rhs.type;
    this.data=rhs.data;
    this.linkType=rhs.linkType;
    this.linkFrom=rhs.linkFrom;
    this.linkTo=rhs.linkTo;
    this.onlink=rhs.onlink;
};

viscomposer.workflow.Port.prototype.destroy=function(){
    this.disconnectAll();
    this.label=null;
    this.varname=null;
    this.module=null;
    this.workflow=null;
    this.type=null;
    this.data=null;
    this.linkType=null;
    this.linkFrom=null;
    this.linkTo=null;
    this.onlink=null;
    viscomposer.Object.prototype.destroy.call(this);
};

viscomposer.workflow.Port.prototype.getVarname=function(){
    switch(this.linkType){
    case 'input':
        var ret=this.linkFrom&&this.linkFrom.getVarname();
        if(ret===undefined||ret===null||ret===''){
            ret=this.value;
        };
        return ret;
    case 'output':
        var ret=this.gen_varname;
        if(ret===undefined||ret===null){
            ret=this.varname;
        }
        return ret;
    default:
        return 'undefined';
    }
};

viscomposer.workflow.Port.prototype.getData=function(){
    switch(this.linkType){
    case 'input':
        var ret=this.linkFrom&&this.linkFrom.getData();
        if(ret===undefined||ret===null||ret===''){
            ret=this.value;
            if(ret===undefined||ret===null||ret===''){
                ret=this.defaultValue;
            };
        };
        break;
    case 'output':
        if(this.type==='data'){
            if(this.dataInfo){
                ret=this.data=new viscomposer.data.DataFactory(this.dataInfo.data);
            }else if(this.data){
                ret=this.data;
            }else{
                return null;
            }
        }else{
            ret=this.data;
        }
        break;
    default:
        return 'undefined';
    }

    return viscomposer.data.DataFactory(ret);
};

viscomposer.workflow.Port.prototype.prepare=function(){
    switch(this.linkType){
    case 'input':
        break;
    case 'output':
        for(var key in this.linkTo){
            var link=this.linkTo[key];
            link.port2.data=this.data;
        }
        this.data=null;
        break;
    }
}

viscomposer.workflow.Port.prototype.update=function(data){
    switch(this.linkType){
    case 'input':
        //this.module.update();
        break;
    case 'output':
        /*for(var key in this.linkTo){
            var link=this.linkTo[key];
            link.update();
        }*/
        if(!this.data){
            this.data=viscomposer.data.DataFactory(data);
        }else{
            this.data.update(data);
        }
        break;
    }
}

viscomposer.workflow.Port.prototype.submit=function(){
    //this.update();
    viscomposer.app.tryRender();
}

viscomposer.workflow.Port.prototype.disconnectAll=function(){
    this.linkFrom&&this.linkFrom.destroy()
    var linkTo;
    if(linkTo=this.linkTo){
        for(var key in linkTo){
            var link=this.linkTo[key];
            link.destroy();
        }
    }
}

viscomposer.workflow.Port.prototype.store=function(){
    var obj=viscomposer.Object.prototype.store.call(this);

    obj.objectType='Port';
    obj.label=this.label;
    obj.varname=this.varname;
    obj.type=this.type;
    obj.linkType=this.linkType;
    obj.onlink=this.onlink&&this.onlink.toString();
    if(this.imported){obj.imported=true;}

    obj.value=this.value;

    return obj;
}

viscomposer.workflow.Port.load=function(hashmap,obj){
    var port=new viscomposer.workflow.Port(obj.type);
    hashmap[obj.uuid]=port;

    port.label=obj.label;
    port.varname=obj.varname;
    if(obj.onlink){
        port.onlink=viscomposer.Environment.build(obj.onlink);
    }
    port.value=obj.value;
    if(obj.imported){port.imported=true;}

    return port;
}