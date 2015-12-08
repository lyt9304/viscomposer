//数据工厂创建不同的数据类型对象

viscomposer.data.DataFactory=function(data){
    if(data===undefined||data===null){return null;}
    if(data instanceof viscomposer.data.Data){
    	return data;
    }else if(data instanceof Array){
        if(data.length>0&&data[0] instanceof Object){
            return new viscomposer.data.ObjectArrayData(data);
        }else{
            return new viscomposer.data.ArrayData(data);
        }
    }else if(data instanceof Object){
        return new viscomposer.data.ObjectData(data);
    }else{
        return new viscomposer.data.Data(data);
    }
};