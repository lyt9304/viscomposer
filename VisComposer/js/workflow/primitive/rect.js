/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Rect=function(properties){
    properties=properties||{};
	viscomposer.workflow.Module.call(this);

    this.label='Rect';
    this.funName='Rect';
    this.resName='rect';
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

    inPort1.label='x';
    inPort1.varname='x';
    inPort1.module=this;
    inPort1.value=properties.x||(properties.underLayout?'layout().x':0);
    input.push(inPort1);

    inPort2.label='y';
    inPort2.varname='y';
    inPort2.module=this;
    inPort2.value=properties.y||(properties.underLayout?'layout().y':0);
    input.push(inPort2);

    inPort3.label='width';
    inPort3.varname='width';
    inPort3.module=this;
    inPort3.value=properties.width||(properties.underLayout?'layout().width':500);
    input.push(inPort3);

    inPort4.label='height';
    inPort4.varname='height';
    inPort4.module=this;
    inPort4.value=properties.height||(properties.underLayout?'layout().height':500);
    input.push(inPort4);

    inPort5.label='color';
    inPort5.varname='color';
    inPort5.module=this;
    inPort5.value=properties.color||'"#3366dd"';
    input.push(inPort5);

    inPort6.label='style';
    inPort6.varname='style';
    inPort6.module=this;
    inPort6.value='""';
    input.push(inPort6);

    outPort1.label='rect';
    outPort1.varname='rect';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);

	//this.data=data&&data.clone();
    
    this.type='geometry';
};

viscomposer.workflow.Rect.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Rect.prototype.constructor=viscomposer.Rect;

viscomposer.workflow.Rect.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Rect();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Rect.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
    //this.data=rhs.data&&rhs.data.clone();
};

viscomposer.workflow.Rect.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label='Rect';
    this.funName='Rect';
    this.resName='rect';

    var input=this.input,output=this.geoOutput;
    input[0].destroy();
    input[0]=null;
    input[1].destroy();
    input[1]=null;
    input[2].destroy();
    input[2]=null;
    input[3].destroy();
    input[3]=null;
    output[0].destroy();
    output[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Rect.prototype.createTemplate=function(){
    var properties=this.properties;
    var uuid=this.uuid;
    //
    var templateStr=
'function(x,y,width,height,color,style){\n'+
'    var rect=createRect(x,y,width,height,color,style,\''+uuid+'\',0,env.transform);\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':rect,\n'+
'        '+this.envOutput[0].varname+':{x:x,y:y,width:width,height:height},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Rect.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='rect';

    return obj;
}