/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Polyline=function(properties){
    properties=properties||{};
    var polyLine=properties.polyLine||{};
	viscomposer.workflow.Module.call(this);

    this.label='Polyline';
    this.funName='Polyline';
    this.resName='polyline';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('transform');

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;

    inPort1.label='x';
    inPort1.varname='x';
    inPort1.module=this;
    inPort1.value=polyLine.x||(properties.underLayout?'layout().polyLine.x':'[]');
    input.push(inPort1);

    inPort2.label='y';
    inPort2.varname='y';
    inPort2.module=this;
    inPort2.value=polyLine.y||(properties.underLayout?'layout().polyLine.y':'[]');
    input.push(inPort2);

    inPort3.label='color';
    inPort3.varname='color';
    inPort3.module=this;
    inPort3.value='"#3344dd"';
    input.push(inPort3);

    inPort4.label='line_width';
    inPort4.varname='lineWidth';
    inPort4.module=this;
    inPort4.value=1;
    input.push(inPort4);

    outPort1.label='output';
    outPort1.varname='polyline';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);
    
    this.type='geometry';
};

viscomposer.workflow.Polyline.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Polyline.prototype.constructor=viscomposer.Polyline;

viscomposer.workflow.Polyline.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Polyline();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Polyline.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
    //this.data=rhs.data&&rhs.data.clone();
};

viscomposer.workflow.Polyline.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label='Polyline';
    this.funName='Polyline';
    this.resName='polyline';

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;
    input[0].destroy();
    input[0]=null;
    input[1].destroy();
    input[1]=null;
    input[2].destroy();
    input[2]=null;
    input[3].destroy();
    input[3]=null;
    geoOutput[0].destroy();
    geoOutput[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Polyline.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var templateStr=
'function(x,y,color,lineWidth){\n'+
'    var polyline=createPolyline(x,y,color,lineWidth,\''+this.uuid+'\',0,env.transform);\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':polyline,\n'+
'        '+this.envOutput[0].varname+':{},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Polyline.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='polyline';

    return obj;
}