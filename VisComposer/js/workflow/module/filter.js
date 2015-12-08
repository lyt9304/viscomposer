/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Filter=function(data){
	viscomposer.workflow.Module.call(this);

    this.label='Filter';
    this.funName='Filter';
    this.resName='data_filtered';

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');

    var input=this.input,output=this.output;

    inPort1.label='input';
    inPort1.varname='input';
    inPort1.module=this;
    input.push(inPort1);

    outPort1.label='data_filtered';
    outPort1.varname='data_filtered';
    outPort1.module=this;
    output.push(outPort1);
    
    this.properties={
        type:'none',
        cols:{},
    }

    this.update();
};

viscomposer.workflow.Filter.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Filter.prototype.constructor=viscomposer.Filter;

viscomposer.workflow.Filter.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Filter();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Filter.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Filter.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.Filter.prototype.mergeCol=function(thisCol,mergeCol,dataType){
    thisCol=thisCol||{'_dataType':viscomposer.Attribute.TYPE.QUANTITATIVE};
    if(thisCol._dataType||dataType==viscomposer.Attribute.TYPE.CATEGORICAL){
        thisCol._dataType=dataType;
    }
    for(var key in mergeCol){
        if(key=='_dataType'||key=='_min'||key=='_max'){
            continue;
        }else{
            if(thisCol[key]===undefined||thisCol[key]===null){
                thisCol[key]=thisCol[key]||true;
            }
            //thisCol[key]+=mergeCol[key];
        }
    }
    return thisCol;
};

viscomposer.workflow.Filter.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);
}

viscomposer.workflow.Filter.prototype.update=function(){
    var data=this.input[0].getData();
    var properties=this.properties;
    var cols=properties.cols;
    if(data){
        if(data instanceof viscomposer.data.ObjectArrayData){
            properties.type='objectarray';
            for(var key in data.cols){
                cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
            }
        }else if(data instanceof viscomposer.data.ArrayData){
            properties.type='array';
            var key=data.label;
            cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
        }else if(data instanceof viscomposer.data.ObjectData){
            properties.type='object';
            for(var key in data.cols){
                cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
            }
        }else if(data instanceof viscomposer.data.Data){
            properties.type='data';
            var key=data.label;
            cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
        }else{
            properties.type='none';
            console.error('error: wrong data type');
        }
    }
};

viscomposer.workflow.Filter.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var key=properties.selectedCol;
    var exp;

    var templateStr=
'function(input){\n'+
'    var output=[];\n';
    if(properties.code){
        templateStr+=
    '    for(var i=0,ni=input.length;i<ni;++i){\n';
        for(var key in properties.cols){
            templateStr+=
    '        var '+key+'=input[i][\''+key+'\'];\n';
        }
        templateStr+=
    '        if('+properties.code+'){\n'+
    '            output.push(input[i]);\n'+
    '        }\n'+
    '    }\n'+
    '    return {'+this.output[0].varname+':output};\n'+
    '}';
    }else{
        var col=properties.cols[key];
        if(col){
            switch(col._dataType){
            case viscomposer.Attribute.TYPE.QUANTITATIVE:
                exp='(value>=('+properties._min+'))&&(value<=('+properties._max+'))';
                break;
            case viscomposer.Attribute.TYPE.CATEGORICAL:
                templateStr+=
        '    var validValues={';
                for(var value in col){
                    if(value=='_dataType'||value=='_min'||value=='_max'){
                        continue;
                    }else{
                        if(col[value]){
                            templateStr+='\''+value+'\':true,';
                        }
                    }
                }
                templateStr+='};\n';
                exp='validValues[value]';
                break;
            default:
                exp='false';
            }
        }else{
            exp='false';
        }

        templateStr+=
    '    for(var i=0,ni=input.length;i<ni;++i){\n'+
    '        var value=input[i][\''+key+'\'];\n'+
    '        if('+exp+'){\n'+
    '            output.push(input[i]);\n'+
    '        }\n'+
    '    }\n'+
    '    return {'+this.output[0].varname+':output};\n'+
    '}';
    }

    return templateStr;
};


viscomposer.workflow.Filter.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_filter';
    
    obj.properties={
        type:this.properties.type,
        cols:this.properties.cols,
    }

    return obj;
}

viscomposer.workflow.Filter.load=function(hashmap,obj){
    var module=new viscomposer.workflow.Filter();
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

viscomposer.workflow.Module.registeredClass['module_filter']=viscomposer.workflow.Filter;