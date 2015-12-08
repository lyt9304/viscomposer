/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Counter=function(data){
    viscomposer.workflow.Module.call(this);

    this.label='Counter';
    this.funName='Counter';
    this.resName='count';

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');
    var outPort2=new viscomposer.workflow.Port('output');
    var outPort3=new viscomposer.workflow.Port('output');

    var input=this.input,output=this.output;

    inPort1.label='data';
    inPort1.varname='data';
    inPort1.module=this;
    input.push(inPort1);

    outPort1.label='x';
    outPort1.varname='x';
    outPort1.module=this;
    output.push(outPort1);
    outPort2.label='count';
    outPort2.varname='count';
    outPort2.module=this;
    output.push(outPort2);
    outPort3.label='range';
    outPort3.varname='range';
    outPort3.module=this;
    output.push(outPort3);

    this.properties={
        sectionNum:5,
    }
};

viscomposer.workflow.Counter.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Counter.prototype.constructor=viscomposer.Counter;

viscomposer.workflow.Counter.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Filter();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Counter.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Counter.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.Counter.prototype.update=function(){
    var data=this.input[0].getData();
}

viscomposer.workflow.Counter.prototype.createTemplate=function(){
    var properties=this.properties;
    var sectionNum=properties.sectionNum;
    //
    var input=this.input;
    var output=this.output;

    var templateStr=
'function(data){\n'+
'    var minmax=getMinMax(data);\n'+
'    var min=minmax[0],max=minmax[1];\n'+
'    var x=[],count=[],range=[],lastX=min,curX;\n'+
'    var sectionNum='+sectionNum+';\n'+
'    for(var i=0;i<sectionNum;++i){\n'+
'        curX=(min+(max-min)*(i+1)/(sectionNum-1));\n'+
'        x.push((min+(max-min)*(i+0.5)/(sectionNum-1)));\n'+
//'        x.push(lastX+"-"+curX);\n'+
'        range.push({min:lastX,max:curX});\n'+
'        lastX=curX;\n'+
'        count.push(0);\n'+
'    }\n'+
'    for(var i=0,ni=data.length;i<ni;++i){\n'+
'        ++count[parseInt((data[i]-min)/(max-min)*(sectionNum-1))];\n'+
'    }\n'+
'    return {'+this.output[0].varname+':x,'+this.output[1].varname+':count,'+this.output[2].varname+':range};\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Counter.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_counter';

    obj.properties={
        sectionNum:this.properties.sectionNum,
    }

    return obj;
}

viscomposer.workflow.Counter.load=function(hashmap,obj){
    var module=new viscomposer.workflow.Counter();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;
    
    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);

    module.properties={
        sectionNum:obj.properties.sectionNum,
    }
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_counter']=viscomposer.workflow.Counter;