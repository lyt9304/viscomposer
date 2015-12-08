/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Text=function(properties){
    properties=properties||{};
	viscomposer.workflow.Module.call(this);

    this.label='Text';
    this.funName='Text';
    this.resName='text';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');
    var inPort5=new viscomposer.workflow.Port('map');
    var inPort6=new viscomposer.workflow.Port('map');
    var inPort7=new viscomposer.workflow.Port('map');
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

    inPort3.label='text';
    inPort3.varname='text';
    inPort3.module=this;
    inPort3.value='text';
    input.push(inPort3);

    inPort4.label='rotate';
    inPort4.varname='rotate';
    inPort4.module=this;
    inPort4.value='0';
    input.push(inPort4);

    inPort5.label='font_size';
    inPort5.varname='fontSize';
    inPort5.module=this;
    inPort5.value='10';
    input.push(inPort5);

    inPort6.label='font_family';
    inPort6.varname='fontFamily';
    inPort6.module=this;
    inPort6.value='"Impact"';
    input.push(inPort6);

    inPort7.label='color';
    inPort7.varname='color';
    inPort7.module=this;
    inPort7.value='"#3366dd"';
    input.push(inPort7);

    outPort1.label='output';
    outPort1.varname='text';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='transform';
    outPort2.varname='transform';
    outPort2.module=this;
    envOutput.push(outPort2);
    
    this.type='geometry';
};

viscomposer.workflow.Text.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Text.prototype.constructor=viscomposer.Circle;

viscomposer.workflow.Text.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Text();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Text.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Text.prototype.destroy=function(){
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
    input[6].destroy();
    input[6]=null;
    geoOutput[0].destroy();
    geoOutput[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.Text.prototype.createTemplate=function(){
    var properties=this.properties;
    var uuid=this.uuid;
    //
    var templateStr=
'function(x,y,text,rotate,fontSize,fontFamily,color){\n'+
'    var textObj=createText(x,y,text,rotate,fontSize,fontFamily,color,\''+uuid+'\',0,env.transform);\n'+
'    return {\n'+
'        '+this.geoOutput[0].varname+':textObj,\n'+
'        '+this.envOutput[0].varname+':{x:x,y:y,width:0,height:0},\n'+
'    };\n'+
'}';
    return templateStr;
};

viscomposer.workflow.Text.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='text';

    return obj;
}