
viscomposer.workflow.ScaleModifier=function(varname,dataRange,viewRange,orient){
    viscomposer.workflow.Modifier.call(this);

    this.varname=varname=varname||'x';
    this.input=[varname];
    this.output=[varname];
    this.properties={
        autoDataRange:(dataRange===undefined||dataRange===null),
        dataRange:dataRange||[0,300],
        viewRange:viewRange||[0,300]||'auto',
        orient:orient||'vertical',
        offset:0,
        containZero:false,
    }
    this.modifierStr='scale(x)';
    this.submit();
}

viscomposer.workflow.ScaleModifier.prototype=Object.create(viscomposer.workflow.Modifier.prototype);
viscomposer.workflow.ScaleModifier.prototype.constructor=viscomposer.workflow.ScaleModifier;

viscomposer.workflow.ScaleModifier.prototype.clone=function(){
    var newObj=new viscomposer.workflow.ScaleModifier();
    newObj.copy(this);

    return newObj;
};

viscomposer.workflow.ScaleModifier.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Modifier.prototype.copy.call(this,rhs);

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.workflow.ScaleModifier.prototype.destroy=function(){
    viscomposer.workflow.Modifier.prototype.destroy.call(this);
};

viscomposer.workflow.ScaleModifier.prototype.submit=function(){
    viscomposer.app.tryRender();
}

viscomposer.workflow.ScaleModifier.prototype.prepare=function(input){
    this.inputData=input[0].data;
}

viscomposer.workflow.ScaleModifier.prototype.createTemplate=function(){
    var properties=this.properties;
    var dataRange=properties.dataRange;
    var viewRange=properties.viewRange;
    var orient=properties.orient;
    var offset=properties.offset;
    var domainStr,rangeStr,range0Str;
    var isQuant=(!this.inputData)||(this.inputData.dataType==viscomposer.Attribute.TYPE.QUANTITATIVE);
    if(viewRange==='auto'){
        if(orient=='vertical'){
            if(properties.reverse){
                range0Str='[(transform.height||env.transform.height),0]';
                rangeStr='[(transform.height||env.transform.height)+'+offset+','+offset+']';
            }else{
                range0Str='[0,(transform.height||env.transform.height)]';
                rangeStr='['+offset+',(transform.height||env.transform.height)+'+offset+']';
            }
        }else{
            range0Str='[0,(transform.width||env.transform.width)]';
            rangeStr='['+offset+',(transform.width||env.transform.width)+'+offset+']';
        }
    }else{
        rangeStr='['+viewRange[0]+','+viewRange[1]+']';
    }
    if(dataRange==='auto'){
        if(isQuant){
            if(properties.containZero){
                domainStr='((function(){var x=getMinMax(data);return [min(0,x[0]),x[1]];})())';
            }else{
                domainStr='getMinMax(data,undefined,0.1)';
            }
        }else{
            domainStr='getValueSet(data)';
        }
    }else{
        domainStr='['+dataRange[0]+','+dataRange[1]+']';
    }
    var templateStr=
'function(data){\n'+
'    var domain='+domainStr+';\n'+
'    viscomposer.Object.hashmap.get(\''+this.uuid+'\').properties._minmax=domain;\n'+
'    var range='+rangeStr+';\n'+
'    var range0='+range0Str+';\n';
    if(isQuant){
        if(properties.log){
            templateStr+=
'    var scale=d3.scale.log().domain(domain).range(range);\n';
        }else{
            templateStr+=
'    var scale=d3.scale.linear().domain(domain).range(range);\n';
}
    }else{
        templateStr+=
'    var scale=d3.scale.ordinal().domain((domain.unshift(" "),domain.push(" "),domain)).rangePoints(range,2);\n';
    }
    templateStr+=
'    var modifier=function(x){\n'+
'        return {'+this.output[0]+':('+this.modifierStr+')};\n'+
'    };\n';
    if(isQuant){
        templateStr+=
'    modifier.scale=d3.scale.linear().domain([scale.invert(range0[0]),scale.invert(range0[1])]).range(range0);\n';
    }else{
        templateStr+=
'    modifier.scale=scale;\n';
    }
    templateStr+=
'    return modifier;\n'+
'}';
    return templateStr;
}

viscomposer.workflow.ScaleModifier.prototype.store=function(){
    var obj=viscomposer.workflow.Modifier.prototype.store.call(this);

    obj.objectType='modifier_scale';
    obj.varname=this.varname;
    obj.properties={
        dataRange:this.properties.dataRange,
        viewRange:this.properties.viewRange,
        orient:this.properties.orient,
    };

    return obj;
}

viscomposer.workflow.ScaleModifier.load=function(hashmap,obj){
    var prop=obj.properties;
    var modifier=new viscomposer.workflow.ScaleModifier(obj.varname.varname,prop.dataRange,prop.viewRange,prop.orient);
    hashmap[obj.uuid]=modifier;

    modifier.varname=obj.varname;
    modifier.modifierStr=obj.modifierStr;

    return modifier;
}

viscomposer.workflow.Modifier.registeredClass['modifier_scale']=viscomposer.workflow.ScaleModifier;