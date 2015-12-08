/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Path=function(properties){
    properties=properties||{};
	viscomposer.workflow.Module.call(this);

    this.label='Path';
    this.funName='Path';
    this.resName='path';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('transform');

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;

    inPort1.label='d';
    inPort1.varname='d';
    inPort1.module=this;
    input.push(inPort1);

    inPort2.label='style';
    inPort2.varname='style';
    inPort2.module=this;
    input.push(inPort2);

    outPort1.label='output';
    outPort1.varname='path';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);
    
    this.type='geometry';
};

viscomposer.workflow.Path.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Path.prototype.constructor=viscomposer.Path;

viscomposer.workflow.Path.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Path();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Path.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
    //this.data=rhs.data&&rhs.data.clone();
};

viscomposer.workflow.Path.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label='Path';
    this.funName='Path';
    this.resName='path';

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;
    input[0].destroy();
    input[0]=null;
    input[1].destroy();
    input[1]=null;
    geoOutput[0].destroy();
    geoOutput[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Path.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var templateStr=
'function(d,style){\n'+
'    var path=createPath(d,style,'+this.uuid+',0,env.transform);\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':path,\n'+
'        '+this.envOutput[0].varname+':{},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Path.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='path';

    return obj;
}