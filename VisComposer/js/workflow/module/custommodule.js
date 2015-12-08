/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.CustomModule=function(data){
	viscomposer.workflow.Module.call(this);

    this.label='CustomModule';
    this.funName='CustomModule';
    this.resName='output';
    this.properties.functionStr='function(/* input1, input2, ... */){\n'+
    '    // write code here\n'+
    '    return {\n'+
    '        // write outputs here\n'+
    '        output1:null, // output1\n'+
    '        output2:null, // output2\n'+
    '    };\n'+
    '}';
};

viscomposer.workflow.CustomModule.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.CustomModule.prototype.constructor=viscomposer.Filter;

viscomposer.workflow.CustomModule.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Filter();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.CustomModule.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
    //this.data=rhs.data&&rhs.data.clone();
};

viscomposer.workflow.CustomModule.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.CustomModule.prototype.addInputPort=function(label){
    label=label||'input';

    var port=new viscomposer.workflow.Port('input');
    port.label=port.varname=label;
    port.module=this;
    var input=this.input;
    input.push(port);

    var labels={},varnames={};
    for(var i=0,ni=input.length;i<ni;++i){
        var port=input[i];
        port.label=viscomposer.util.processConflict(port.label,labels);
        port.varname=viscomposer.util.processConflict(port.varname,varnames);
    }
    return port;
}

viscomposer.workflow.CustomModule.prototype.addOutputPort=function(label){
    label=label||'output';

    var port=new viscomposer.workflow.Port('output');
    port.label=port.varname=label;
    port.module=this;
    var output=this.output;
    output.push(port);

    var labels={},varnames={};
    for(var i=0,ni=output.length;i<ni;++i){
        var port=output[i];
        port.label=viscomposer.util.processConflict(port.label,labels);
        port.varname=viscomposer.util.processConflict(port.varname,varnames);
    }

    return port;
}

viscomposer.workflow.CustomModule.prototype.createTemplate=function(){
    return this.properties.functionStr;
};

viscomposer.workflow.CustomModule.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_custom';

    obj.properties={};
    obj.properties.functionStr=this.properties.functionStr;

    return obj;
}

viscomposer.workflow.CustomModule.load=function(hashmap,obj){
    var module=new viscomposer.workflow.CustomModule();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);

    module.properties={};
    module.properties.functionStr=obj.properties.functionStr;
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_custom']=viscomposer.workflow.CustomModule;