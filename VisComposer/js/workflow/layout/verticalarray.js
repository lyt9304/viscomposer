/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.VerticalArray=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='Vertical Array';
    this.funName='VerticalArray';
    this.resName='verticalArray';
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('layout');

    var input=this.input,
        output=this.output,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

    inPort1.label='height';
    inPort1.varname='height';
    inPort1.module=this;
    inPort1.value=1;
    input.push(inPort1);

    outPort1.label='layout';
    outPort1.varname='layout';
    outPort1.module=this;
    envOutput.push(outPort1);
    
    this.type='layout';
    this.layoutIcon="resource/image/element/array/vertical.png";
    this.layoutLabels=[
        ['number','number of grids','layout().num'],
        ['y','position - y coordinate','layout().y'],
        ['height','height','layout().height'],
    ];
    this.layoutDescription="Array Layout - Vertical";
};

viscomposer.workflow.VerticalArray.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.VerticalArray.prototype.constructor=viscomposer.VerticalArray;

viscomposer.workflow.VerticalArray.prototype.clone=function(){
    var newObj=new viscomposer.workflow.VerticalArray();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.VerticalArray.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.VerticalArray.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label=null;
    this.funName=null;
    this.resName=null;

    var input=this.input,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

    input[0].destroy();
    input[0]=null;
    output[0].destroy();
    output[0]=null;
    output[1].destroy();
    output[1]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.VerticalArray.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    return function(weight){\n'+
'        var transform=self();\n'+
'        var width=transform.width;\n'+
'        var height=transform.height;\n'+
'        var no=count++;\n'+
'        var weightSum=0;\n'+
'        for(var i=0,ni=weight.length;i<ni;++i){\n'+
'            weightSum+=weight[i];\n'+
'        }\n'+
'        var ys=[],heights=[],curY=0;\n'+
'        for(var i=0,ni=weight.length;i<ni;++i){\n'+
'            var curHeight=height*weight[i]/weightSum;\n'+
'            ys.push(curY);curY+=curHeight;\n'+
'            heights.push(curHeight);\n'+
'        }\n'+
'        return {\n'+
'            '+this.envOutput[0].varname+':{x:0,y:ys,width:width,height:heights,num:weight.length},\n'+
'        };\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.VerticalArray.prototype.childProperties=function(properties){
    properties=properties||{};
    properties.x=properties.x||'0';
    properties.y=properties.y||'layout().y';
    properties.width=properties.width||'parent().width';
    properties.height=properties.height||'layout().height';

    return properties;
}

viscomposer.workflow.VerticalArray.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_verticalarray';

    return obj;
}

viscomposer.workflow.VerticalArray.load=function(hashmap,obj){
    var module=new viscomposer.workflow.VerticalArray();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;
    
    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_verticalarray']=viscomposer.workflow.VerticalArray;