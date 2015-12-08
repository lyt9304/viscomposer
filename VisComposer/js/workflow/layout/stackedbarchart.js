/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.StackedBarChart=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='2-d Coordinates';
    this.funName='StackedBarChart';
    this.resName='stackedBarChart';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort4=new viscomposer.workflow.Port('map');
    var inPort5=new viscomposer.workflow.Port('input');
    var inPort6=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort2=new viscomposer.workflow.Port('geometry');
    var outPort4=new viscomposer.workflow.Port('scale');
    var outPort5=new viscomposer.workflow.Port('scale');
    var outPort6=new viscomposer.workflow.Port('layout');

    var input=this.input,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

    inPort4.label='bar_width';
    inPort4.varname='barWidth';
    inPort4.module=this;
    inPort4.value=32;
    input.push(inPort4);

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

    this.properties={
        scaleX:new viscomposer.workflow.ScaleModifier('x','auto','auto','horizontal'),
        scaleY:new viscomposer.workflow.ScaleModifier('y','auto','auto','vertical'),
    }
    this.properties.scaleY.properties.containZero=true;

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
    this.layoutIcon="resource/image/element/array/coordinates.png";
    this.layoutLabels=[
        ['number','number of bars in chart','layout().num'],
        ['x','position - x coordinate','layout().x'],
        ['y','position - y coordinate','layout().y'],
        ['width','width','layout().width'],
        ['height','height','layout().height'],
    ];
    this.layoutDescription="Bar Chart Layout";
};

viscomposer.workflow.StackedBarChart.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.StackedBarChart.prototype.constructor=viscomposer.StackedBarChart;

viscomposer.workflow.StackedBarChart.prototype.clone=function(){
    var newObj=new viscomposer.workflow.StackedBarChart();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.StackedBarChart.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.StackedBarChart.prototype.destroy=function(){
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
    input[2].destroy();
    input[2]=null;
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

viscomposer.workflow.StackedBarChart.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    var c20=d3.scale.category20();\n'+
'    return function(barWidth,dataX,dataY){\n'+
'        var transform=self();\n'+
'        var width=transform.width;\n'+
'        var height=transform.height;\n'+
'        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
'        dataX=dataX||[];\n'+
'        dataY=dataY||[];\n'+
'        var dataYSum=[];\n'+
'        for(var j=0,nj=dataY.length;j<nj;++j){\n'+
'            dataYSum.push(0);\n'+
'            for(var k=0,nk=dataY[j].length;k<nk;++k){\n'+
'                dataYSum[j]+=dataY[j][k];\n'+
'            }\n'+
'        }\n'+
'        var scaleX=('+viscomposer.util.addIndent(properties.scaleX.createTemplate(),2)+')(dataX);\n'+
'        var scaleY=('+viscomposer.util.addIndent(properties.scaleY.createTemplate(),2)+')(dataYSum);\n'+
'        var axisX=createAxis(scaleX.scale,"bottom",width/50,\''+uuid+'\',no,transform);\n'+
'        axisX.setAttribute("transform","translate("+0+","+height+")");\n'+
'        var axisY=createAxis(scaleY.scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
'        var xs=[],ys=[],widths=[],heights=[],classIndex=[],classColor=[],classHeight=[];\n'+
'        for(var j=0,nj=dataY.length;j<nj;++j){\n'+
'            var curX=scaleX(dataX[j]).x-barWidth/2,curY=height,curH\n'+
'            xs.push(curX);ys.push(height-scaleY(dataYSum[j]).y);\n'+
'            widths.push(barWidth);heights.push(scaleY(dataYSum[j]).y);\n'+
'            classIndex.push([]);classColor.push([]);classHeight.push([]);\n'+
'            for(var k=0,nk=dataY[j].length;k<nk;++k){\n'+
'                var curH=scaleY(dataY[j][k]).y;\n'+
//'                curY-=curH;\n'+
//'                xs.push(curX);ys.push(curY);\n'+
//'                widths.push(barWidth);heights.push(curH);\n'+
'                classIndex[j].push(k);classColor[j].push(c20(k));classHeight[j].push(curH);\n'+
'            }\n'+
'        }\n'+
'        return {\n'+
'            '+this.geoOutput[0].varname+':axisX,\n'+
'            '+this.geoOutput[1].varname+':axisY,\n'+
'            '+this.envOutput[0].varname+':scaleX,\n'+
'            '+this.envOutput[1].varname+':scaleY,\n'+
'            '+this.envOutput[2].varname+':{x:xs,y:ys,height:heights,barWidth:barWidth,num:xs.length,classIndex:classIndex,classColor:classColor,classHeight:classHeight},\n'+
'        };\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.StackedBarChart.prototype.childProperties=function(properties){
    properties=properties||{};
    if(!isNaN(properties.width)){
        this.input[0].value=parseFloat(properties.width);
        properties.width='layout().barWidth';
    }
    properties.x=properties.x||'layout().x';
    properties.y=properties.y||'layout().y';
    properties.width=properties.width||'layout().barWidth';
    properties.height=properties.height||'layout().height';
    properties.color=properties.color||'layout().classColor';

    return properties;
}

viscomposer.workflow.StackedBarChart.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);

    this.properties.scaleX.prepare([this.input[1]]);
    //this.properties.scaleY.prepare([this.input[2]]);
    this.properties.scaleY.inputData={dataType:viscomposer.Attribute.TYPE.QUANTITATIVE};
}

viscomposer.workflow.StackedBarChart.prototype.update=function(){
    viscomposer.workflow.Module.prototype.update.call(this);

    this.properties.scaleX.update();
    this.properties.scaleY.update();
}

viscomposer.workflow.StackedBarChart.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_stackedbarchart';

    obj.properties={
        scaleX:this.properties.scaleX.store(),
        scaleY:this.properties.scaleY.store(),
    }

    return obj;
}

viscomposer.workflow.StackedBarChart.load=function(hashmap,obj){
    var module=new viscomposer.workflow.StackedBarChart();
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

viscomposer.workflow.Module.registeredClass['module_stackedbarchart']=viscomposer.workflow.StackedBarChart;