/**
 * @fileoverview 数据类基类
 */

viscomposer.data.ObjectArrayData=function(data){
    viscomposer.data.ArrayData.call(this);
    this.cols={};

    if(data!==undefined&&data!==null){
        this.update(data);
    }
};

viscomposer.data.ObjectArrayData.prototype=Object.create(viscomposer.data.ArrayData.prototype);
viscomposer.data.ObjectArrayData.prototype.constructor=viscomposer.data.ArrayData;

viscomposer.data.ObjectArrayData.prototype.clone=function(){
    var newObj=new viscomposer.data.ObjectArrayData();
    newObj.copy(this);

    return newObj;
};

viscomposer.data.ObjectArrayData.prototype.copy=function(rhs){
    if(!rhs){return;}

    viscomposer.data.ArrayData.prototype.copy.call(this,rhs);
    this.data=rhs.data;
};

viscomposer.data.ObjectArrayData.prototype.destroy=function(){
    viscomposer.data.ArrayData.prototype.destroy.call(this);
};

viscomposer.data.ObjectArrayData.prototype.prepare=function(){
    this.cols={};
}

viscomposer.data.ObjectArrayData.prototype.update=function(data){
    for(var i=0,ni=data.length;i<ni;++i){
        var obj=data[i];
        for(key in obj){
            var value=data[i][key];
            var col=this.cols[key]=this.cols[key]||{'_dataType':viscomposer.Attribute.TYPE.QUANTITATIVE};
            col[value]=col[value]||0;
            ++col[value];
            if(isNaN(value)){
                col['_dataType']=viscomposer.Attribute.TYPE.CATEGORICAL;
            }
        }
    }
}