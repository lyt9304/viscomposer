/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.ParallelCoordinates=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='ParallelCoordinates';
    this.funName='ParallelCoordinates';
    this.resName='parallelCoordinates';
    this.geoOutput=[];
    this.envOutput=[];

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('geometry');
    var outPort3=new viscomposer.workflow.Port('layout');

    var input=this.input,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

    inPort1.label='data';
    inPort1.varname='data';
    inPort1.module=this;
    input.push(inPort1);

    outPort1.label='axes';
    outPort1.varname='axes';
    outPort1.module=this;
    geoOutput.push(outPort1);

    outPort3.label='layout';
    outPort3.varname='layout';
    outPort3.module=this;
    envOutput.push(outPort3);

    this.properties={
        scales:[],
    }
    
    this.type='layout';
    this.layoutIcon="resource/image/element/layout/ParallelCoordinates.png";
    this.layoutLabels=[
        ['number','number of data points','layout().num'],
        ['polyLine','polylines data of each data point','layout().polyLine'],
        ['dimension','dimension number of data points','layout().dim'],
        ['scale','scale of each axis(dimension)','layout().scale'],
    ];
    this.layoutDescription="Parallel Coordinates Layout";
};

viscomposer.workflow.ParallelCoordinates.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.ParallelCoordinates.prototype.constructor=viscomposer.ParallelCoordinates;

viscomposer.workflow.ParallelCoordinates.prototype.clone=function(){
    var newObj=new viscomposer.workflow.ParallelCoordinates();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.ParallelCoordinates.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.ParallelCoordinates.prototype.destroy=function(){
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
    geoOutput[0].destroy();
    geoOutput[0]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
};

viscomposer.workflow.ParallelCoordinates.prototype.createTemplate=function(){
    var properties=this.properties;
    var scales=properties.scales;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    return function(data){\n'+
'        var transform=self();\n'+
'        var width=transform.width;\n'+
'        var height=transform.height;\n'+
'        var no=count++;\n'+
'        data=data||[];\n'+
'        var dataCols=[];\n'+
'        var dim='+scales.length+';\n'+
'        for(var j=0,nj=dim;j<nj;++j){\n'+
'            dataCols.push(getCol(data,j));\n'+
'        }\n'+
'        var scales=[],axes=[],axesXs=[];\n';
    for(var i=0,ni=scales.length;i<ni;++i){
        templateStr+=
'        scales.push(('+viscomposer.util.addIndent(properties.scales[i].createTemplate(),2)+')(dataCols['+i+']));\n'+
'        var axis=createAxis(scales['+i+'].scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
'        var axisX=width*'+i+'/'+(ni-1)+';\n'+
'        axesXs.push(axisX);\n'+
'        axis.setAttribute("transform","translate("+axisX+","+0+")");\n'+
'        axes.push(axis);\n';
    }
    templateStr+=
'        var polys=[];\n'+
'        for(var i=0,ni=data.length;i<ni;++i){\n'+
'            var lineX=[],lineY=[];\n'+
'            for(var j=0,nj=dim;j<nj;++j){\n'+
'                lineX.push(axesXs[j]);lineY.push(scales[j](dataCols[j][i])["axis_"+j]);\n'+
'            }\n'+
'            polys.push({x:lineX,y:lineY});\n'+
'        }\n'+
'        return {\n'+
'            '+this.geoOutput[0].varname+':axes,\n'+
'            '+this.envOutput[0].varname+':{polyLine:polys,num:data.length,dim:dim,xs:axesXs},\n'+
'        };\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.ParallelCoordinates.prototype.childProperties=function(properties){
    properties=properties||{};
    properties.x=properties.x||'layout().x';
    properties.y=properties.y||'layout().y';

    return properties;
}

viscomposer.workflow.ParallelCoordinates.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);

    var data=this.input[0].data;
    if(data){
        var dataTypes=[];
        for(var key in data.cols){
            dataTypes.push(data.cols[key]._dataType);
        }
        var scales=this.properties.scales;
        if(scales.length>dataTypes.length){
            for(var i=dataTypes.length;i<scales.length;++i){
                scales[i].destroy();
            }
        }
        scales.length=dataTypes.length;
        for(var i=0,ni=scales.length;i<ni;++i){
            if(!scales[i]){
                scales[i]=new viscomposer.workflow.ScaleModifier('axis_'+i,'auto','auto','vertical');
            }
            scales[i].prepare([{data:{dataType:dataTypes[i]}}]);
        }
    }
}

viscomposer.workflow.ParallelCoordinates.prototype.update=function(){
    viscomposer.workflow.Module.prototype.update.call(this);

    var scales=this.properties.scales;
    for(var i=0,ni=scales.length;i<ni;++i){
        scales[i].update();
    }
}

viscomposer.workflow.ParallelCoordinates.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_parallelcoordinates';

    obj.properties={
        scales:[],
    };
    var properties=this.properties;
    for(var i=0,ni=properties.scales.length;i<ni;++i){
        obj.properties.scales.push(properties.scales[i].store());
    }

    return obj;
}

viscomposer.workflow.ParallelCoordinates.load=function(hashmap,obj){
    var module=new viscomposer.workflow.ParallelCoordinates();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;

    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);

    module.properties={
        scales:[],
    };
    var properties=obj.properties;
    for(var i=0,ni=properties.scales.length;i<ni;++i){
        module.properties.scales.push(properties.scales[i].store());
    }
    return module;
}

viscomposer.workflow.Module.registeredClass['module_parallelcoordinates']=viscomposer.workflow.ParallelCoordinates;