
viscomposer.workflow.DirectModifier=function(varname1,varname2){
    viscomposer.workflow.Modifier.call(this);

    this.input=[varname1||'x'];
    this.output=[varname2||'f_x'];
    this.modifierStr=varname1;
    this.submit();
}

viscomposer.workflow.DirectModifier.prototype=Object.create(viscomposer.workflow.Modifier.prototype);
viscomposer.workflow.DirectModifier.prototype.constructor=viscomposer.workflow.ScaleModifier;

viscomposer.workflow.DirectModifier.prototype.clone=function(){
    var newObj=new viscomposer.workflow.DirectModifier(obj.input[0],obj.output[0]);
    newObj.copy(this);

    return newObj;
};

viscomposer.workflow.DirectModifier.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Modifier.prototype.copy.call(this,rhs);

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.workflow.DirectModifier.prototype.destroy=function(){
    viscomposer.workflow.Modifier.prototype.destroy.call(this);
};

viscomposer.workflow.DirectModifier.prototype.submit=function(){
    this.update();

    viscomposer.app.tryRender();
}

viscomposer.workflow.DirectModifier.prototype.createTemplate=function(){
    var templateStr=
'function(){\n'+
'    return function('+this.input[0]+'){\n'+
'        return {'+this.output[0]+':'+this.modifierStr+'};\n'+
'    };\n'+
'}';
    return templateStr;
}

viscomposer.workflow.DirectModifier.prototype.store=function(){
    var obj=viscomposer.workflow.Modifier.prototype.store.call(this);

    obj.objectType='modifier_direct';

    return obj;
}

viscomposer.workflow.DirectModifier.load=function(hashmap,obj){
    var modifier=new viscomposer.workflow.DirectModifier(obj.input[0],obj.output[0]);
    hashmap[obj.uuid]=modifier;

    modifier.modifierStr=obj.modifierStr;

    return modifier;
}

viscomposer.workflow.Modifier.registeredClass['modifier_direct']=viscomposer.workflow.DirectModifier;