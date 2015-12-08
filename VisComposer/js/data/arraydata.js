/**
 * @fileoverview 数据类基类
 */

viscomposer.data.ArrayData=function(data){
    viscomposer.data.Data.call(this);

    this.prepare();
    if(data!==undefined&&data!==null){
        this.update(data);
    }
};

viscomposer.data.ArrayData.prototype=Object.create(viscomposer.data.Data.prototype);
viscomposer.data.ArrayData.prototype.constructor=viscomposer.data.Data;

viscomposer.data.ArrayData.prototype.clone=function(){
    var newObj=new viscomposer.data.ArrayData();
    newObj.copy(this);

    return newObj;
};

viscomposer.data.ArrayData.prototype.copy=function(rhs){
    if(!rhs){return;}

    viscomposer.data.Data.prototype.copy.call(this,rhs);
    this.data=rhs.data;
};

viscomposer.data.ArrayData.prototype.destroy=function(){
    viscomposer.data.Data.prototype.destroy.call(this);
};

viscomposer.data.ArrayData.prototype.row=function(row){
    var data=viscomposer.data.DataFactory(this.data[row]);
    data.label=this.label;
    return data;
}

viscomposer.data.ArrayData.prototype.prepare=function(){
    this.valueSet={};
    this.dataType=viscomposer.Attribute.TYPE.QUANTITATIVE;
}

viscomposer.data.ArrayData.prototype.update=function(data){
    for(var i=0,ni=data.length;i<ni;++i){
        var type=typeof(data[i]);
        if(type==='string'||type==='number'){
            this.valueSet[data[i]]=this.valueSet[data[i]]||0;
            ++this.valueSet[data[i]];
            if(isNaN(data[i])){
                this.dataType=viscomposer.Attribute.TYPE.CATEGORICAL;
            }
        }
    }
}