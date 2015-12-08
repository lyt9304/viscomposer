/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.ColSelector=function(data){
	viscomposer.workflow.Module.call(this);

    this.label='ColSelector';
    this.funName='ColSelector';
    this.resName='data_selected';

    var inPort1=new viscomposer.workflow.Port('input');
    var inPort2=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');

    var input=this.input,output=this.output;

    var me=this;
    inPort1.label='data';
    inPort1.varname='data';
    inPort1.module=this;
    input.push(inPort1);
    inPort2.label='col';
    inPort2.varname='col';
    inPort2.module=this;
    input.push(inPort2);

    outPort1.label='output';
    outPort1.varname='output';
    outPort1.module=this;
    output.push(outPort1);
};

viscomposer.workflow.ColSelector.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.ColSelector.prototype.constructor=viscomposer.ColSelector;

viscomposer.workflow.ColSelector.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Filter();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.ColSelector.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.ColSelector.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.ColSelector.prototype.addInputPort=function(label){
    label=label||'col';

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
};

viscomposer.workflow.ColSelector.prototype.addOutputPort=function(label){
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
};

viscomposer.workflow.ColSelector.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var data=this.input[0].data;
    var attrs=data&&data.attributes||[];
    var input=this.input;
    var output=this.output;

    var templateStr=
'function(data){\n'+
'    var colName=[';
    for(var i=0,ni=attrs.length;i<ni;++i){
        if(i>0){templateStr+=',';}
        templateStr+='\''+attrs[i].label+'\'';
    }
    templateStr+='];\n'+
'    var output=[];\n'+
'    for(var j=0,nj='+output.length+';j<nj;++j){\n'+
'        output.push(getCol(data,arguments[j+1]));\n'+
'    }\n'+
'    return {';
    for(var i=0,ni=output.length;i<ni;++i){
        templateStr+=output[i].varname+':output['+i+'],';
    }
    templateStr+=
'    }\n'+
'}';
    return templateStr;
};

viscomposer.workflow.ColSelector.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_colselector';

    return obj;
}

viscomposer.workflow.ColSelector.load=function(hashmap,obj){
    var module=new viscomposer.workflow.ColSelector();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;
    
    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);

    module.properties={};
    module.properties.functionStr=obj.properties.functionStr;
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_colselector']=viscomposer.workflow.ColSelector;