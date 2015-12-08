/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Indicator=function(properties){
    properties=properties||{};
	viscomposer.workflow.Module.call(this);

    this.label='Indicator';
    this.funName='Indicator';
    this.resName='indicator';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('transform');

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;

    inPort1.label='cx';
    inPort1.varname='cx';
    inPort1.module=this;
    inPort1.value='layout().x+layout().width/2';
    input.push(inPort1);

    inPort2.label='cy';
    inPort2.varname='cy';
    inPort2.module=this;
    inPort2.value='layout().y+layout().height/2';
    input.push(inPort2);

    inPort3.label='r';
    inPort3.varname='r';
    inPort3.module=this;
    inPort3.value=5;
    input.push(inPort3);

    inPort4.label='color';
    inPort4.varname='color';
    inPort4.module=this;
    inPort4.value='"#3366dd"';
    input.push(inPort4);

    outPort1.label='output';
    outPort1.varname='indicator';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);
    
    this.type='geometry';
};

viscomposer.workflow.Indicator.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Indicator.prototype.constructor=viscomposer.Indicator;

viscomposer.workflow.Indicator.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Indicator();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Indicator.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
    //this.data=rhs.data&&rhs.data.clone();
};

viscomposer.workflow.Indicator.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label='Indicator';
    this.funName='Indicator';
    this.resName='indicator';

    var input=this.input,output=this.geoOutput;
    input[0].destroy();
    input[0]=null;
    input[1].destroy();
    input[1]=null;
    input[2].destroy();
    input[2]=null;
    output[0].destroy();
    output[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Indicator.prototype.createTemplate=function(){
    var properties=this.properties;
    var uuid=this.uuid;
    //
    var templateStr=
'function(cx,cy,r,color){\n'+
'    var circle=createCircle(cx,cy,r,color,\''+uuid+'\',0,env.transform);\n'+
'    circle.setAttribute("class","intermediate indicator-point");\n'+
'    circle.isIndicator=true;\n'+
'    circle.index=i;\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':circle,\n'+
'        '+this.envOutput[0].varname+':{x:cx,y:cy,width:r,height:r},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Indicator.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_indicator';
    obj.primitiveType='circle';

    return obj;
}