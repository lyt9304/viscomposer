/**
 * @fileoverview workflow模块类
 */

viscomposer.workflow.Module=function(){
	viscomposer.Object.call(this);

    this.label='Module';
    this.funName='Module';
    this.resName='result';
	this.input=[];
	this.output=[];
    this.geoOutput=null;
    this.envOutput=null;
    this.properties={};
    this.ui=null;

    this.type='normal';
};

viscomposer.workflow.Module.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.workflow.Module.prototype.constructor=viscomposer.workflow.Module;

viscomposer.workflow.Module.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Module();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Module.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);

    this.label=rhs.label;
    this.funName=rhs.funName;
    this.resName=rhs.resName;

    this.input.forEach(function(port){port.destroy();});
    var input=this.input=[];
    rhs.input.forEach(function(port){input.push(port.clone());});

    this.output.forEach(function(port){port.destroy();});
    var output=this.output=[];
    rhs.output.forEach(function(port){output.push(port.clone());});

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.workflow.Module.prototype.destroy=function(){
    this.disconnectAll();

    this.label=null;
    this.funName=null;
    this.resName=null;

    var input=this.input;
    for(var i=0,ni=input.length;i<ni;++i){
        var port=input[i];
        port.destroy();
    }

    var output=this.output;
    if(this.geoOutput){output=output.concat(this.geoOutput);}
    if(this.envOutput){output=output.concat(this.envOutput);}
    for(var i=0,ni=output.length;i<ni;++i){
        var port=output[i];
        port.destroy();
    }
    
    this.input=null;
    this.output=null;
    this.geoOutput=null;
    this.envOutput=null;

    viscomposer.util.deleteObject(this.properties);
    this.properties=null;

    delete this.workflow.moduleList[this.uuid];

    viscomposer.Object.prototype.destroy.call(this);
};

viscomposer.workflow.Module.prototype.prepare=function(){
    var varnames={};
    var output=this.output;
    if(this.geoOutput){output=output.concat(this.geoOutput);}
    if(this.envOutput){output=output.concat(this.envOutput);}
    for(var i=0,ni=output.length;i<ni;++i){
        var port=output[i];
        port.varname=viscomposer.util.processConflict(output[i].varname,varnames);
        port.prepare();
    }
}

viscomposer.workflow.Module.prototype.update=function(){
}

viscomposer.workflow.Module.prototype.submit=function(){
    this.update();
    viscomposer.app.tryRender();
};

viscomposer.workflow.Module.prototype.createTemplate=function(){
    return 'function(input){return {};}';
};

viscomposer.workflow.Module.prototype.childProperties=function(properties){
    properties=properties||{};
    return properties;
}

viscomposer.workflow.Module.prototype.hasTransform=function(){
    if(!this.envOutput){return false;}
    var envOutput=this.envOutput;
    for(var i=0,ni=envOutput.length;i<ni;++i){
        if(envOutput[i].varname=='transform'){
            return true;
        }
    }
    return false;
}

viscomposer.workflow.Module.prototype.disconnectAll=function(){
    var input=this.input;
    for(var i=0,ni=input.length;i<ni;++i){
        var port=input[i];
        port.disconnectAll();
    }

    var output=this.output;
    if(this.geoOutput){output=output.concat(this.geoOutput);}
    if(this.envOutput){output=output.concat(this.envOutput);}
    for(var i=0,ni=output.length;i<ni;++i){
        var port=output[i];
        port.disconnectAll();
    }
};

viscomposer.workflow.Module.prototype.store=function(){
    var obj=viscomposer.Object.prototype.store(this);

    obj.objectType='module';

    obj.label=this.label;
    obj.funName=this.funName;
    obj.resName=this.resName;

    var input=obj.input=[];
    for(var i=0,ni=this.input.length;i<ni;++i){
        input.push(this.input[i].store());
    }

    var output=obj.output=[];
    for(var i=0,ni=this.output.length;i<ni;++i){
        output.push(this.output[i].store());
    }

    if(this.geoOutput){
        var geoOutput=obj.geoOutput=[];
        for(var i=0,ni=this.geoOutput.length;i<ni;++i){
            geoOutput.push(this.geoOutput[i].store());
        }
    }else{
        obj.geoOutput=null;
    }

    if(this.envOutput){
        var envOutput=obj.envOutput=[];
        for(var i=0,ni=this.envOutput.length;i<ni;++i){
            envOutput.push(this.envOutput[i].store());
        }
    }else{
        obj.envOutput=null;
    }

    obj.createTemplate=this.createTemplate.toString();

    return obj;
}

viscomposer.workflow.Module.registeredClass={};

viscomposer.workflow.Module.load=function(hashmap,obj){
    var registeredClass=viscomposer.workflow.Module.registeredClass[obj.objectType];
    if(registeredClass){
        return registeredClass.load(hashmap,obj);
    }

    var module=new viscomposer.workflow.Module();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);
    //module.createTemplate=viscomposer.Environment.build(obj.createTemplate);
    
    return module;
}

viscomposer.workflow.Module.loadPorts=function(hashmap,obj,module){
    var input=module.input=[];
    for(var i=0,ni=obj.input.length;i<ni;++i){
        var port=viscomposer.workflow.Port.load(hashmap,obj.input[i]);
        port.module=module;
        input.push(port);
    }

    var output=module.output=[];
    for(var i=0,ni=obj.output.length;i<ni;++i){
        var port=viscomposer.workflow.Port.load(hashmap,obj.output[i]);
        port.module=module;
        output.push(port);
    }

    if(obj.geoOutput){
        var geoOutput=module.geoOutput=[];
        for(var i=0,ni=obj.geoOutput.length;i<ni;++i){
            var port=viscomposer.workflow.Port.load(hashmap,obj.geoOutput[i]);
            port.module=module;
            geoOutput.push(port);
        }
    }else{
        module.geoOutput=null;
    }

    if(obj.envOutput){
        var envOutput=module.envOutput=[];
        for(var i=0,ni=obj.envOutput.length;i<ni;++i){
            var port=viscomposer.workflow.Port.load(hashmap,obj.envOutput[i]);
            port.module=module;
            envOutput.push(port);
        }
    }else{
        module.envOutput=null;
    }
}