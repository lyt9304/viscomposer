
viscomposer.workflow.Modifier=function(){
    viscomposer.Object.call(this);

    this.input=[];
    this.output=[];
    this.properties={};
    this.modifierStr='';
    /*this.statistics={
        define:'',
        compute:'',
        finish:'',
    }*/

    //viscomposer.workflow.Modifier.lib[this.uuid]=this;
}

viscomposer.workflow.Modifier.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.workflow.Modifier.prototype.constructor=viscomposer.workflow.Modifier;

//viscomposer.workflow.Modifier.lib={};

viscomposer.workflow.Modifier.prototype.clone=function(){
    var newObj=new viscomposer.workflow.Modifier();
    newObj.copy(this);

    return newObj;
};

viscomposer.workflow.Modifier.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.workflow.Modifier.prototype.destroy=function(){
    viscomposer.util.deleteObject(this.properties);
    this.properties=null;
    this.modifierStr=null;
    viscomposer.util.deleteObject(this.statistics);
    this.statistics=null;

    //delete viscomposer.workflow.Modifier.lib[this.uuid];

    viscomposer.Object.prototype.destroy.call(this);
};

viscomposer.workflow.Modifier.prototype.update=function(){
}


viscomposer.workflow.Modifier.prototype.prepare=function(input){
}


viscomposer.workflow.Modifier.prototype.submit=function(){
    //this.update();
    viscomposer.app.tryRender();
}

viscomposer.workflow.Modifier.prototype.createTemplate=function(){
    var templateStr=
'function(){\n';
    var paraStr='';
    for(var i=0,ni=this.input.length;i<ni;++i){
        if(i>0){paraStr+=',';}
        paraStr+=this.input[i];
    }
    templateStr+=
'    return function('+paraStr+'){\n'+
'        return '+this.modifierStr+';\n'+
'    };\n'+
'}';
    return templateStr;
}

/*viscomposer.workflow.Modifier.prototype.createTemplate=function(){
    this.testStatistics();
    var properties=this.properties;

    var templateStr=
'function(obj,loop'+(properties.noProp?'':',prop')+'){\n';
    var stat=this.statistics;
    if(stat.define.length>0||stat.compute.length>0||stat.finish.length>0){
        templateStr+=
'    '+viscomposer.util.addIndent(stat.define,1);
        if(stat.compute.length>0){
            templateStr+=
'    for(var i=0;i<loop;++i){\n'+
'        '+viscomposer.util.addIndent(stat.compute,2)+
'    }\n';
        }
        templateStr+=stat.finish;
    }
    var paraStr='';
    for(var i=0,ni=this.input.length;i<ni;++i){
        if(i>0){paraStr+=',';}
        paraStr+=this.input[i];
    }
    templateStr+=
'    var modifier=function('+paraStr+'){\n'+
'        return ('+this.modifierStr.replace(/\(\)/g,'')+');\n'+
'    };\n';
    for(var i=0,ni=stat.expose.length;i<ni;++i){
        var varname=stat.expose[i];
    templateStr+=
'    modifier.'+varname+'='+varname+';\n';
    }
    templateStr+=
'    return modifier;\n'+
'}';

    return templateStr;
}

viscomposer.workflow.Modifier.prototype.testStatistics=function(){

    var properties=this.properties;
    var propStr=properties.noProp?"":"[prop]";

    var str=
"(function(){"+
    "var stat={};"+
    "stat.define='';"+
    "stat.compute='';"+
    "stat.finish='';"+
    "stat.expose=[];"+
    "var used={"+
        "min:false,max:false,"+
        "sum:false,avg:false,"+
    "};"+
    "var min=function(){"+
        "if(used.min){return;}"+
        "stat.define+='var min=obj[0]"+propStr+";\\n';"+
        "stat.compute+='if(obj[i]"+propStr+"<min){min=obj[i]"+propStr+";}\\n';"+
        "used.min=true;"+
        "stat.expose.push('min');"+
    "};"+
    "var max=function(){"+
        "if(used.max){return;}"+
        "stat.define+='var max=obj[0]"+propStr+";\\n';"+
        "stat.compute+='if(obj[i]"+propStr+">max){max=obj[i]"+propStr+";}\\n';"+
        "used.max=true;"+
        "stat.expose.push('max');"+
    "};"+
    "var sum=function(){"+
        "if(used.sum){return;}"+
        "stat.define+='var sum=0;\\n';"+
        "stat.compute+='sum+=obj[i]"+propStr+";\\n';"+
        "used.sum=true;"+
        "stat.expose.push('sum');"+
    "};"+
    "var avg=function(){"+
        "if(used.avg){return;}"+
        "sum();"+
        "stat.finish+='var avg=sum/loop;\\n';"+
        "used.avg=true;"+
        "stat.expose.push('avg');"+
    "};";
    for(var i=0,ni=this.input.length;i<ni;++i){
        str+="var "+this.input[i]+"=0;";
    }
    str+=this.modifierStr+';'+
    "return stat;"+
"})()";

    try{
        var stat=this.statistics=viscomposer.Environment.build(str);
    }catch(e){
        console.log(e.stack.split('\n').slice(0,2).join('\n'));
    }

    --stat.define.length;
    --stat.compute.length;
    --stat.finish.length;
}*/

viscomposer.workflow.Modifier.prototype.store=function(){
    var obj=viscomposer.Object.prototype.store.call(this);

    obj.objectType='modifier';

    obj.modifierStr=this.modifierStr;

    return obj;
}

viscomposer.workflow.Modifier.registeredClass={};

viscomposer.workflow.Modifier.load=function(hashmap,obj){
    var registeredClass=viscomposer.workflow.Modifier.registeredClass[obj.objectType];
    if(registeredClass){
        return registeredClass.load(hashmap,obj);
    }

    var modifier=new viscomposer.workflow.Modifier();
    hashmap[obj.uuid]=modifier;

    modifier.modifierStr=obj.modifierStr;

    return modifier;
}