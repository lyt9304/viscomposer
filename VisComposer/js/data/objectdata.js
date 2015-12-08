/**
 * @fileoverview 数据类基类
 */

viscomposer.data.ObjectData=function(data){
    viscomposer.data.Data.call(this);
    
    this.cols={};

    if(data!==undefined&&data!==null){
        this.update(data);
    }
};

viscomposer.data.ObjectData.prototype=Object.create(viscomposer.data.Data.prototype);
viscomposer.data.ObjectData.prototype.constructor=viscomposer.data.Data;

viscomposer.data.ObjectData.prototype.clone=function(){
    var newObj=new viscomposer.data.ObjectData();
    newObj.copy(this);

    return newObj;
};

viscomposer.data.ObjectData.prototype.copy=function(rhs){
    if(!rhs){return;}

    viscomposer.data.Data.prototype.copy.call(this,rhs);
    this.data=rhs.data;
};

viscomposer.data.ObjectData.prototype.destroy=function(){
    viscomposer.data.Data.prototype.destroy.call(this);
};

viscomposer.data.ObjectData.prototype.col=function(col){
    var data=viscomposer.data.DataFactory(this.data[col]);
    data.label=col;
    return data;
}

viscomposer.data.ObjectData.prototype.prepare=function(){
    this.cols={};
}

viscomposer.data.ObjectData.prototype.update=function(data){
    for(key in data){
        var value=data[key];
        var col=this.cols[key]=this.cols[key]||{'_dataType':viscomposer.Attribute.TYPE.QUANTITATIVE};
        col[value]=col[value]||0;
        ++col[value];
        if(isNaN(value)){
            col['_dataType']=viscomposer.Attribute.TYPE.CATEGORICAL;
        }
    }
}