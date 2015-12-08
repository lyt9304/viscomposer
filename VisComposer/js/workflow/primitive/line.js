/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Line=function(properties){
    properties=properties||{};
	viscomposer.workflow.Module.call(this);

    this.label='Line';
    this.funName='Line';
    this.resName='line';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');
    var inPort5=new viscomposer.workflow.Port('map');
    var inPort6=new viscomposer.workflow.Port('map');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('transform');

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;

    inPort1.label='x1';
    inPort1.varname='x1';
    inPort1.module=this;
    inPort1.value=properties.x1||(properties.underLayout?'layout().x':0);
    input.push(inPort1);

    inPort2.label='y1';
    inPort2.varname='y1';
    inPort2.module=this;
    inPort2.value=properties.y1||(properties.underLayout?'layout().y':0);
    input.push(inPort2);

    inPort3.label='x2';
    inPort3.varname='x2';
    inPort3.module=this;
    inPort3.value=properties.x2||(properties.underLayout?'layout().x+100':100);
    input.push(inPort3);

    inPort4.label='y2';
    inPort4.varname='y2';
    inPort4.module=this;
    inPort4.value=properties.y2||(properties.underLayout?'layout().y+100':100);
    input.push(inPort4);

    inPort5.label='width';
    inPort5.varname='width';
    inPort5.module=this;
    inPort5.value=properties.lineWidth||2;
    input.push(inPort5);

    inPort6.label='color';
    inPort6.varname='color';
    inPort6.module=this;
    inPort6.value='"#3366dd"';
    input.push(inPort6);

    outPort1.label='output';
    outPort1.varname='line';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);
    
    this.type='geometry';
};

viscomposer.workflow.Line.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Line.prototype.constructor=viscomposer.Line;

viscomposer.workflow.Line.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Line();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Line.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Line.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label=null;
    this.funName=null;
    this.resName=null;

    var input=this.input,geoOutput=this.geoOutput,envOutput=this.envOutput;
    input[0].destroy();
    input[0]=null;
    input[1].destroy();
    input[1]=null;
    input[2].destroy();
    input[2]=null;
    input[3].destroy();
    input[3]=null;
    input[4].destroy();
    input[4]=null;
    input[5].destroy();
    input[5]=null;
    geoOutput[0].destroy();
    geoOutput[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Line.prototype.createTemplate=function(){
    var properties=this.properties;
    var uuid=this.uuid;
    //
    var templateStr=
'function(x1,y1,x2,y2,width,color){\n'+
'    var line=createLine(x1,y1,x2,y2,width,color,\''+uuid+'\',0,env.transform);\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':line,\n'+
'        '+this.envOutput[0].varname+':{x:x1,y:y1,width:x2-x1,height:y2-y1},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Line.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='line';

    return obj;
}