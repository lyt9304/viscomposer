/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Scatterplot=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='2-d Coordinates';
    this.funName='Coordinates';
    this.resName='coordinates';
    this.geoOutput=[];
    this.envOutput=[];

    /*var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');*/
    var inPort5=new viscomposer.workflow.Port('input');
    var inPort6=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('geometry');
    //var outPort3=new viscomposer.workflow.Port('transform');
    var outPort4=new viscomposer.workflow.Port('scale');
    var outPort5=new viscomposer.workflow.Port('scale');
    var outPort6=new viscomposer.workflow.Port('layout');

    var input=this.input,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

    /*inPort1.label='x';
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
    input.push(inPort4);*/

    inPort5.label='data/x';
    inPort5.varname='dataX';
    inPort5.module=this;
    input.push(inPort5);

    inPort6.label='data/y';
    inPort6.varname='dataY';
    inPort6.module=this;
    input.push(inPort6);

    outPort1.label='x_axis';
    outPort1.varname='x_axis';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort2.label='y_axis';
    outPort2.varname='y_axis';
    outPort2.module=this;
    geoOutput.push(outPort2);

    /*outPort3.label='transform';
    outPort3.varname='transform';
    outPort3.module=this;
    envOutput.push(outPort3);*/

    this.properties={
        scaleX:new viscomposer.workflow.ScaleModifier('x','auto','auto','horizontal'),
        scaleY:new viscomposer.workflow.ScaleModifier('y','auto','auto','vertical'),
    }

    outPort4.label='scaleX';
    outPort4.varname='scaleX';
    outPort4.module=this;
    outPort4.modifier=this.properties.scaleX;
    envOutput.push(outPort4);

    outPort5.label='scaleY';
    outPort5.varname='scaleY';
    outPort5.module=this;
    outPort5.modifier=this.properties.scaleY;
    envOutput.push(outPort5);

    this.properties.scaleX.refName=outPort4.varname;
    this.properties.scaleY.refName=outPort5.varname;

    outPort6.label='layout';
    outPort6.varname='layout';
    outPort6.module=this;
    envOutput.push(outPort6);
    
    this.type='layout';
    this.layoutIcon="resource/image/element/array/Coordinates.png";
    this.layoutLabels=[
        ['number','number of data points','layout().num'],
        ['x','position - x coordnate','layout().x'],
        ['y','position - y coordnate','layout().y']
    ];
    this.layoutDescription="2-d Distribution Layout";
};

viscomposer.workflow.Scatterplot.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Scatterplot.prototype.constructor=viscomposer.Scatterplot;

viscomposer.workflow.Scatterplot.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Scatterplot();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Scatterplot.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Scatterplot.prototype.destroy=function(){
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
    input[1].destroy();
    input[1]=null;
    /*input[2].destroy();
    input[2]=null;
    input[3].destroy();
    input[3]=null;
    input[4].destroy();
    input[4]=null;
    input[5].destroy();
    input[5]=null;*/
    geoOutput[0].destroy();
    geoOutput[0]=null;
    geoOutput[1].destroy();
    geoOutput[1]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
    envOutput[1].destroy();
    envOutput[1]=null;
    envOutput[2].destroy();
    envOutput[2]=null;
    envOutput[3].destroy();
    envOutput[4]=null;
};

viscomposer.workflow.Scatterplot.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    return function(dataX,dataY){\n'+
'        var transform=self();\n'+
'        var width=transform.width;\n'+
'        var height=transform.height;\n'+
'        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
'        dataX=dataX||[];\n'+
'        dataY=dataY||[];\n'+
'        var scaleX=('+viscomposer.util.addIndent(properties.scaleX.createTemplate(),2)+')(dataX);\n'+
'        var scaleY=('+viscomposer.util.addIndent(properties.scaleY.createTemplate(),2)+')(dataY);\n'+
'        var axisX=createAxis(scaleX.scale,"bottom",width/50,\''+uuid+'\',no,transform);\n'+
'        axisX.setAttribute("transform","translate("+0+","+height+")");\n'+
'        var axisY=createAxis(scaleY.scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
//'        axisY.setAttribute("transform","translate("+x+","+y+")");\n'+
'        var xs=[],ys=[];\n'+
'        for(var i=0,ni=dataX.length;i<ni;++i){\n'+
'            xs.push(scaleX(dataX[i]).x);ys.push(scaleY(dataY[i]).y);\n'+
'        }\n'+
'        return {\n'+
'            '+this.geoOutput[0].varname+':axisX,\n'+
'            '+this.geoOutput[1].varname+':axisY,\n'+
//'            '+this.envOutput[0].varname+':transform,\n'+
'            '+this.envOutput[0].varname+':scaleX,\n'+
'            '+this.envOutput[1].varname+':scaleY,\n'+
'            '+this.envOutput[2].varname+':{x:xs,y:ys,num:dataX.length},\n'+
'        };\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.Scatterplot.prototype.childProperties=function(properties){
    properties=properties||{};
    properties.x=properties.x||'layout().x';
    properties.y=properties.y||'layout().y';

    return properties;
}

viscomposer.workflow.Scatterplot.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);

    this.properties.scaleX.prepare([this.input[0]]);
    this.properties.scaleY.prepare([this.input[1]]);
    /*this.properties.scaleX.prepare([this.input[4]]);
    this.properties.scaleY.prepare([this.input[5]]);*/
}

viscomposer.workflow.Scatterplot.prototype.update=function(){
    viscomposer.workflow.Module.prototype.update.call(this);

    this.properties.scaleX.update();
    this.properties.scaleY.update();
}

viscomposer.workflow.Scatterplot.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_scatterplot';

    obj.properties={
        scaleX:this.properties.scaleX.store(),
        scaleY:this.properties.scaleY.store(),
    }

    return obj;
}

viscomposer.workflow.Scatterplot.load=function(hashmap,obj){
    var module=new viscomposer.workflow.Scatterplot();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);

    module.properties={
        scaleX:viscomposer.workflow.Modifier.load(hashmap,obj.properties.scaleX),
        scaleY:viscomposer.workflow.Modifier.load(hashmap,obj.properties.scaleY),
    }

    module.envOutput[0].modifier=module.properties.scaleX;
    module.envOutput[1].modifier=module.properties.scaleY;
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_scatterplot']=viscomposer.workflow.Scatterplot;