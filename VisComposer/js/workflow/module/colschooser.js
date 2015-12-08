/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.ColChooser=function(data){
	viscomposer.workflow.Module.call(this);

    this.label='ColChooser';
    this.funName='ColChooser';
    this.resName='data';

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');

    var input=this.input,output=this.output;

    inPort1.label='input';
    inPort1.varname='input';
    inPort1.module=this;
    input.push(inPort1);

    outPort1.label='data';
    outPort1.varname='data';
    outPort1.module=this;
    output.push(outPort1);
    
    this.properties={
        type:'none',
        cols:{},
    }

    this.update();
};

viscomposer.workflow.ColChooser.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.ColChooser.prototype.constructor=viscomposer.ColChooser;

viscomposer.workflow.ColChooser.prototype.clone=function(){
    var newObj=new viscomposer.workflow.ColChooser();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.ColChooser.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.ColChooser.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.ColChooser.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);
}

viscomposer.workflow.ColChooser.prototype.update=function(){
    var data=this.input[0].getData();
    var properties=this.properties;
    var cols=properties.cols;
    if(data){
        if(data instanceof viscomposer.data.ObjectArrayData){
            properties.type='objectarray';
            for(var key in data.cols){
                cols[key]={
                    dataType:data.cols[key]['_dataType'],
                    selected:false,
                };
            }
        }else if(data instanceof viscomposer.data.ArrayData){
            properties.type='array';
            var key=data.label;
            cols[key]={
                dataType:data.dataType,
                selected:false,
            }
        }else if(data instanceof viscomposer.data.ObjectData){
            properties.type='object';
            for(var key in data.cols){
                cols[key]={
                    dataType:data.cols[key]['_dataType'],
                    selected:false,
                }
            }
        }else if(data instanceof viscomposer.data.Data){
            properties.type='data';
            var key=data.label;
            cols[key]={
                dataType:data.dataType,
                selected:false,
            }
        }else{
            properties.type='none';
            console.error('error: wrong data type');
        }
    }
};

viscomposer.workflow.ColChooser.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var exp;

    var templateStr=
'function(input){\n'+
'    var output=[];\n'+
'    for(var i=0,ni=input.length;i<ni;++i){\n'+
'        var record={\n';
    for(var key in properties.cols){
        var col=properties.cols[key];
        if(col.selected){
        templateStr+=
'            \''+key+'\':input[i][\''+key+'\'],\n'+
'        var record={\n';
        }
    }
    templateStr+=
'        };\n'+
'        output.push(record);\n'+
'    }\n'+
'    return {'+this.output[0].varname+':output};\n'+
'}';

    return templateStr;
};


viscomposer.workflow.ColChooser.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_colchooser';
    
    obj.properties={
        type:this.properties.type,
        cols:this.properties.cols,
    }

    return obj;
}

viscomposer.workflow.ColChooser.load=function(hashmap,obj){
    var module=new viscomposer.workflow.ColChooser();
    hashmap[obj.uuid]=module;

    module.label=obj.label;
    module.funName=obj.funName;
    module.resName=obj.resName;
    
    module.properties={
        type:obj.properties.type,
        cols:obj.properties.cols,
    }

    viscomposer.workflow.Module.loadPorts(hashmap,obj,module);
    
    return module;
}

viscomposer.workflow.Module.registeredClass['module_colchooser']=viscomposer.workflow.ColChooser;