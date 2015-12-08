/**
 * @fileoverview 数据类基类
 */

viscomposer.data.Data=function(data){
    viscomposer.Object.call(this);

    this.label='data';

    this.prepare();
    if(data!==undefined&&data!==null){
        this.update(data);
    }
};

viscomposer.data.Data.dataList={};

viscomposer.data.Data.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.data.Data.prototype.constructor=viscomposer.data.Data;

viscomposer.data.Data.prototype.clone=function(){
    var newObj=new viscomposer.data.Data();
    newObj.copy(this);

    return newObj;
};

viscomposer.data.Data.prototype.copy=function(rhs){
    if(!rhs){return;}

    viscomposer.Object.prototype.copy.call(this,rhs);
    //this.data=rhs.data;
    this.label=rhs.label;
    this.valueSet={};
};

viscomposer.data.Data.prototype.destroy=function(){
    //this.data=null;
    this.label=null;
    this.valueSet=null;

    viscomposer.Object.prototype.destroy.call(this);
};

viscomposer.data.Data.prototype.getData=function(){
    return this.data;
}

viscomposer.data.Data.prototype.prepare=function(){
    this.valueSet={};
    this.dataType=viscomposer.Attribute.TYPE.QUANTITATIVE;
}

viscomposer.data.Data.prototype.update=function(data){
    var type=typeof(data);
    if(type==='string'||type==='number'){
        this.valueSet[data]=this.valueSet[data]||0;
        ++this.valueSet[data];
    }
}