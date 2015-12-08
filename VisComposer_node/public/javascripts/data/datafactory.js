//数据工厂创建不同的数据类型对象

viscomposer.data.DataFactory=function(rawData){
    if(rawData === undefined||rawData === null){
        return null;
    }
    if(rawData instanceof viscomposer.data.Data){
    	return rawData;
    }else if(rawData instanceof Array){
        if(rawData.length > 0 && rawData[0] instanceof Object){
            return new viscomposer.data.ObjectArrayData(rawData);
        }else{
            return new viscomposer.data.ArrayData(rawData);
        }
    }else if(rawData instanceof Object){
        return new viscomposer.data.ObjectData(rawData);
    }else{
        return new viscomposer.data.Data(rawData);
    }
};