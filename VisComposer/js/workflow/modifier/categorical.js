
viscomposer.workflow.CategoricalModifier=function(varname){
    viscomposer.workflow.Modifier.call(this);


    this.varname=varname=varname||'x';
    this.input=[varname];
    this.output=[varname];
    
    this.properties={
        type:'normal',
        valueSet:{},
    }

    this.modifierStr='map['+this.varname+']';
    this.defaultMapValue=0;
}

viscomposer.workflow.CategoricalModifier.prototype=Object.create(viscomposer.workflow.Modifier.prototype);
viscomposer.workflow.CategoricalModifier.prototype.constructor=viscomposer.workflow.CategoricalModifier;

viscomposer.workflow.CategoricalModifier.prototype.clone=function(){
    var newObj=new viscomposer.workflow.CategoricalModifier();
    newObj.copy(this);

    return newObj;
};

viscomposer.workflow.CategoricalModifier.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.workflow.Modifier.prototype.copy.call(this,rhs);

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.workflow.CategoricalModifier.prototype.destroy=function(){
    viscomposer.workflow.Modifier.prototype.destroy.call(this);
};

viscomposer.workflow.CategoricalModifier.prototype.prepare=function(){
    var c20=d3.scale.category20();
    return function(input){
        var data=input[0].data;
        var valueSet0=data&&data.valueSet;
        var valueSet=this.properties.valueSet;
        for(var key in valueSet0){
            if(!valueSet[key]){
                valueSet[key]=c20(key);
            }
        }
    }
}();

viscomposer.workflow.CategoricalModifier.prototype.createTemplate=function(){
    var valueSet=this.properties.valueSet;
    var templateStr=
'function(data){\n'+
'    var map={\n';
    for(var key in valueSet){
        templateStr+=
'        \''+key+'\':\''+valueSet[key]+'\',\n'; 
    }
    templateStr+=
'    };\n'+
'    var modifier=function('+this.input[0]+'){\n'+
'        return {\''+this.output[0]+'\':('+this.modifierStr+')};\n'+
'    };\n'+
'    return modifier;\n'+
'}';
    return templateStr;
}

/*viscomposer.workflow.CategoricalModifier.prototype.testStatistics=function(){
    var prop=this.properties;
    var valueSet=prop.valueSet;
    var stat=this.statistics;
    stat.define='var valueSet=viscomposer.Object.hashmap.get(\''+this.uuid+'\').properties.valueSet;\n';
    stat.compute='valueSet[obj[i][prop]]=valueSet[obj[i][prop]]||'+this.defaultMapValue;
    stat.finish='';

    stat.define+='var map={\n';
    for(var key in valueSet){
        var value=valueSet[key];
        if(typeof(value)==='string'){
            value='\''+value+'\'';
        }
        stat.define+='    '+key+':'+value+',\n';
    }
    stat.define+='};\n';
}
*/
viscomposer.workflow.CategoricalModifier.prototype.store=function(){
    var obj=viscomposer.workflow.Modifier.prototype.store.call(this);

    obj.objectType='modifier_categorical';
    obj.properties={
        type:this.properties.type,
        valueSet:this.properties.valueSet,
    }

    return obj;
}

viscomposer.workflow.CategoricalModifier.load=function(hashmap,obj){
    var modifier=new viscomposer.workflow.CategoricalModifier();
    hashmap[obj.uuid]=modifier;

    modifier.modifierStr=obj.modifierStr;
    modifier.properties={
        type:obj.properties.type,
        valueSet:obj.properties.valueSet,
    }

    return modifier;
}

viscomposer.workflow.Modifier.registeredClass['modifier_categorical']=viscomposer.workflow.CategoricalModifier;