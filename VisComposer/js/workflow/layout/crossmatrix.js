/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.CrossMatrix=function(properties){
    properties=properties||{};
    viscomposer.workflow.Module.call(this);

    this.label='Grid';
    this.funName='Grid';
    this.resName='grid';
    //this.geoOutput=[];
    this.envOutput=[];

/*    var inPort1=new viscomposer.workflow.Port('map');
    var inPort2=new viscomposer.workflow.Port('map');
    var inPort3=new viscomposer.workflow.Port('map');
    var inPort4=new viscomposer.workflow.Port('map');*/
    var inPort5=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');
    var outPort2=new viscomposer.workflow.Port('output');/*
    var outPort3=new viscomposer.workflow.Port('transform');*/
    var outPort4=new viscomposer.workflow.Port('layout');

    var input=this.input,
        output=this.output,
        geoOutput=this.geoOutput,
        envOutput=this.envOutput;

/*    inPort1.label='x';
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

    inPort5.label='dim';
    inPort5.varname='dim';
    inPort5.module=this;
    inPort5.value=1;
    input.push(inPort5);

    outPort1.label='index';
    outPort1.varname='index';
    outPort1.module=this;
    output.push(outPort1);

    /*outPort3.label='transform';
    outPort3.varname='transform';
    outPort3.module=this;
    envOutput.push(outPort3);*/

    outPort4.label='layout';
    outPort4.varname='layout';
    outPort4.module=this;
    envOutput.push(outPort4);
    
    this.type='layout';
    this.layoutIcon="resource/image/element/array/grid.png";
    this.layoutLabels=[
        ['number','number of grids','layout().num'],
        ['row','row index (starts from 0)','layout().row'],
        ['col','col index (starts from 0)','layout().col'],
        ['x','position - x coordinate','layout().x'],
        ['y','position - y coordinate','layout().y'],
        ['width','width','layout().width'],
        ['height','height','layout().height'],
    ];
    this.layoutDescription="Array Layout - Grid";
};

viscomposer.workflow.CrossMatrix.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.CrossMatrix.prototype.constructor=viscomposer.CrossMatrix;

viscomposer.workflow.CrossMatrix.prototype.clone=function(){
    var newObj=new viscomposer.workflow.CrossMatrix();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.CrossMatrix.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.CrossMatrix.prototype.destroy=function(){
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
/*    input[1].destroy();
    input[1]=null;
    input[2].destroy();
    input[2]=null;
    input[3].destroy();
    input[3]=null;
    input[4].destroy();
    input[4]=null;
    input[5].destroy();
    input[5]=null;*/
    output[0].destroy();
    output[0]=null;
    output[1].destroy();
    output[1]=null;
    envOutput[0].destroy();
    envOutput[0]=null;
    /*envOutput[1].destroy();
    envOutput[1]=null;*/
};

viscomposer.workflow.CrossMatrix.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var uuid=this.uuid;
    var templateStr=
'(function(){\n'+
'    var count=0;\n'+
'    return function(dim){\n'+
'        var transform=self();\n'+
'        var width=transform.width;\n'+
'        var height=transform.height;\n'+
'        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
'        var cellWidth=width/dim;\n'+
'        var cellHeight=height/dim;\n'+
'        var xs=[],ys=[],widths=[],heights=[],indexs=[],rows=[],cols=[];\n'+
'        for(var i=0,ni=dim;i<ni;++i){\n'+
'            for(var j=0,nj=dim;j<nj;++j){\n'+
'                xs.push(i*cellWidth);ys.push(j*cellHeight);\n'+
//'                widths.push(cellWidth);heights.push(cellHeight);\n'+
'                indexs.push({col:i,row:j});rows.push(j);cols.push(i);\n'+
'            }\n'+
'        }\n'+
'        return {\n'+
'            '+this.output[0].varname+':indexs,\n'+
//'            '+this.envOutput[0].varname+':transform,\n'+
'            '+this.envOutput[0].varname+':{x:xs,y:ys,width:cellWidth,height:cellHeight,row:rows,col:cols,num:dim*dim,colNum:dim,rowNum:dim},\n'+
'        };\n'+
'    }\n'+
'}())';
    return templateStr;
};

viscomposer.workflow.CrossMatrix.prototype.childProperties=function(properties){
    properties=properties||{};
    properties.x=properties.x||'layout().x';
    properties.y=properties.y||'layout().y';
    properties.width=properties.width||'layout().width';
    properties.height=properties.height||'layout().height';

    return properties;
}

viscomposer.workflow.CrossMatrix.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);
    obj.objectType='module_crossmatrix';

    return obj;
}

viscomposer.workflow.CrossMatrix.load=function(hashmap,obj){
    var module=new viscomposer.workflow.CrossMatrix();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;
    
    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_crossmatrix']=viscomposer.workflow.CrossMatrix;