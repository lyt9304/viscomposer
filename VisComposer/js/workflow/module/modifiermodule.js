/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.ModifierModule=function(ref,modifier){
	viscomposer.workflow.Module.call(this);

    this.label='ModifierModule';
    this.funName='ModifierModule';
    this.resName='output';

    this.ref=ref;
    this.modifier=modifier;


    if(modifier){
        var input=this.input,output=this.output;
        for(var i=0,ni=modifier.input.length;i<ni;++i){
            var inputI=modifier.input[i];
            var port=new viscomposer.workflow.Port('map');
            port.label=port.varname=inputI;
            port.module=this;
            input.push(port);
        }
        
        for(var i=0,ni=modifier.output.length;i<ni;++i){
            var inputI=modifier.output[i];
            var port=new viscomposer.workflow.Port('output');
            port.label=port.varname=inputI;
            port.module=this;
            output.push(port);
        }
    }
};

viscomposer.workflow.ModifierModule.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.ModifierModule.prototype.constructor=viscomposer.Filter;

viscomposer.workflow.ModifierModule.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Filter();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.ModifierModule.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.ModifierModule.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.ModifierModule.prototype.getModifier=function(){
    if(this.ref){
        return this.modifier;
    }else{
        var objStruct=modifier.split('.');
        var obj=this.workflow.getEnv();
        for(var i=1,ni=objStruct.length;i<ni;++i){
            obj=obj[objStruct[i]];
        }
        return obj.modifier;
    }
};

viscomposer.workflow.ModifierModule.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);

    this.modifier.prepare(this.input);
}

viscomposer.workflow.ModifierModule.prototype.update=function(){
    viscomposer.workflow.Module.prototype.update.call(this);

    this.modifier.update();
}

viscomposer.workflow.ModifierModule.prototype.createTemplate=function(){
    var templateStr='';
    var modifier=this.modifier;
    if(this.ref){
        templateStr+=
'(function(){\n'+
'    return function(){\n'+
'        var tmp=env.'+this.modifier.refName+'.apply(this,arguments);\n'+
'        return{\n';
        for(var i=0,ni=this.output.length;i<ni;++i){
            templateStr+=
'            '+this.output[i].varname+':tmp["'+modifier.output[i]+'"],\n'; 
        }
        templateStr+=
'        };\n'+
'    }\n'+
'})()\n';
    }else{
        templateStr+=
'(function(){\n'+
'    var modifier='+viscomposer.util.addIndent(modifier.createTemplate(),1)+'();\n'+
'    return function(){\n'+
'        var tmp=modifier.apply(this,arguments);\n'+
'        return{\n';
        for(var i=0,ni=this.output.length;i<ni;++i){
            templateStr+=
'            '+this.output[i].varname+':tmp["'+modifier.output[i]+'"],\n'; 
        }
        templateStr+=
'        };\n'+
'    }\n'+
'})()\n';
    }

    return templateStr;
};

viscomposer.workflow.ModifierModule.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_modifier';
    if(obj.ref=this.ref){
        obj.modifier=this.modifier.uuid;
    }else{
        obj.modifier=this.modifier.store();
    }

    return obj;
}

viscomposer.workflow.ModifierModule.load=function(hashmap,obj){
    var module=new viscomposer.workflow.ModifierModule();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    if(module.ref=obj.ref){
        module.modifier=hashmap[obj.modifier];
    }else{
        module.modifier=viscomposer.workflow.Modifier.load(hashmap,obj.modifier);
    }
    
    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_modifier']=viscomposer.workflow.ModifierModule;