/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Sort=function(data){
	viscomposer.workflow.Module.call(this);

    this.label='Sort';
    this.funName='Sort';
    this.resName='data_sorted';

    var inPort1=new viscomposer.workflow.Port('input');
    var outPort1=new viscomposer.workflow.Port('output');

    var input=this.input,output=this.output;

    inPort1.label='input';
    inPort1.varname='input';
    inPort1.module=this;
    input.push(inPort1);

    outPort1.label='data_sorted';
    outPort1.varname='data_sorted';
    outPort1.module=this;
    output.push(outPort1);
    
    this.properties={
        direction:'ascend',
        type:'none',
        cols:{},
    }

    this.update();
};

viscomposer.workflow.Sort.prototype=Object.create(viscomposer.workflow.Module.prototype);
viscomposer.workflow.Sort.prototype.constructor=viscomposer.Sort;

viscomposer.workflow.Sort.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Sort();
    newObj.copy(this);

    return newObj;
}

viscomposer.workflow.Sort.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Module.prototype.copy.call(this,rhs);
};

viscomposer.workflow.Sort.prototype.destroy=function(){
    viscomposer.workflow.Module.prototype.destroy.call(this);
};

viscomposer.workflow.Sort.prototype.prepare=function(){
    viscomposer.workflow.Module.prototype.prepare.call(this);
}

viscomposer.workflow.Sort.prototype.update=function(){
    var data=this.input[0].getData();
    var properties=this.properties;
    var cols=properties.cols;
    if(data){
        if(data instanceof viscomposer.data.ObjectArrayData){
            properties.type='objectarray';
            for(var key in data.cols){
                cols[key]=data.cols[key]['_dataType'];
            }
        }else if(data instanceof viscomposer.data.ArrayData){
            properties.type='array';
            var key=data.label;
            cols[key]=data.dataType;
        }else if(data instanceof viscomposer.data.ObjectData){
            properties.type='object';
            for(var key in data.cols){
                cols[key]=data.cols[key]['_dataType'];
            }
        }else if(data instanceof viscomposer.data.Data){
            properties.type='data';
            var key=data.label;
            cols[key]=data.dataType;
        }else{
            properties.type='none';
            console.error('error: wrong data type');
        }
    }
};

viscomposer.workflow.Sort.prototype.createTemplate=function(){
    var properties=this.properties;
    //
    var key=properties.selectedCol;
    var exp;

    var templateStr=
'function(input){\n';
    var col=properties.cols[key];
    if(col){
        switch(properties.direction){
        case 'none':
        default:
            templateStr+=
'    var compareFunc=function(a,b){return 0;}\n';
            break;
        case 'descend':
            templateStr+=
'    var compareFunc=function(a,b){if(typeof(a["'+key+'"])==="number"){return a["'+key+'"]-b["'+key+'"];}else{return a["'+key+'"].localeCompare(b["'+key+'"]);}}\n';
            break;
        case 'ascend':
            templateStr+=
'    var compareFunc=function(a,b){if(typeof(a["'+key+'"])==="number"){return b["'+key+'"]-a["'+key+'"];}else{return -(a["'+key+'"].localeCompare(b["'+key+'"]));}}\n';
            break;
        }
    }else{
            templateStr+=
'    var compareFunc=function(a,b){return 0;}\n';
    }

    templateStr+=
'    var output=input.sort(compareFunc);\n'+
'    return {'+this.output[0].varname+':output};\n'+
'}\n';

    return templateStr;
};


viscomposer.workflow.Sort.prototype.store=function(){
    var obj=viscomposer.workflow.Module.prototype.store.call(this);

    obj.objectType='module_sort';
    
    obj.properties={
        type:this.properties.type,
        cols:this.properties.cols,
    }

    return obj;
}

viscomposer.workflow.Sort.load=function(hashmap,obj){
    var module=new viscomposer.workflow.Sort();
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

viscomposer.workflow.Module.registeredClass['module_sort']=viscomposer.workflow.Sort;