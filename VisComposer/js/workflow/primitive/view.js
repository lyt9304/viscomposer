/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.View=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='View';
    this.funName='View';
    this.resName='view';
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');
    var outPort1=new viscomposer.workflow.Port('transform');

    var input=this.input,output=this.envOutput;

    inPort1.label='x';
    inPort1.varname='x';
    inPort1.module=this;
    inPort1.value=properties.x||(properties.underLayout?'layout().x':30);
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

    outPort1.label='transform';
    outPort1.varname='transform';
    outPort1.module=this;
    output.push(outPort1);
    
    this.type='geometry';
};

viscomposer.workflow.View.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.View.prototype.constructor=viscomposer.View;

viscomposer.workflow.View.prototype.clone=function(){
    var newObj=new viscomposer.workflow.View();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.View.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.View.prototype.destroy=function(){
    this.destroy();
    viscomposer.workflow.Module.prototype.destroy.call(this);

    this.label='View';
    this.funName='View';
    this.resName='view';

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
};

viscomposer.workflow.View.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    return function(x,y,width,height){\n'+
'        var transform=createTransform(x,y,width,height,\''+uuid+'\',count++,env.transform);\n'+
'        return {'+this.envOutput[0].varname+':transform};\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.View.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_primitive';
    obj.primitiveType='view';

    return obj;
}

viscomposer.workflow.primitiveClass={
    'view':viscomposer.workflow.View,
    'circle':viscomposer.workflow.Circle,
    'rect':viscomposer.workflow.Rect,
    'path':viscomposer.workflow.Path,
    'text':viscomposer.workflow.Text,
    'line':viscomposer.workflow.Line,
    'polyline':viscomposer.workflow.Polyline,
};

viscomposer.workflow.View.load=function(hashmap,obj){
    var module=new viscomposer.workflow.primitiveClass[obj.primitiveType]();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    var input=module.input;
    for(var i=0,ni=obj.input.length;i<ni;++i){
        hashmap[obj.input[i].uuid]=input[i];
    }

    var output=module.output;
    for(var i=0,ni=obj.output.length;i<ni;++i){
        hashmap[obj.output[i].uuid]=output[i];
    }

    if(obj.geoOutput){
        var geoOutput=module.geoOutput;
        for(var i=0,ni=obj.geoOutput.length;i<ni;++i){
            hashmap[obj.geoOutput[i].uuid]=geoOutput[i];
        }
    }

    if(obj.envOutput){
        var envOutput=module.envOutput;
        for(var i=0,ni=obj.envOutput.length;i<ni;++i){
            hashmap[obj.envOutput[i].uuid]=envOutput[i];
        }
    }
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_primitive']=viscomposer.workflow.View;