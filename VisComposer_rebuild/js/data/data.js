/**
 * @fileoverview 数据类基类 Data
 */

viscomposer.data.Data=(function(){
    var Data=viscomposer.VObject.define("Data",null,function(data){

            this.label='data';
            this.dataList={};

            this.prepare();
            if(data!==undefined&&data!==null){
                this.update(data);
            }
        }
    );

    var prototype=Data.prototype;


    prototype.getData=function(){
        return this.data;
    };

    prototype.prepare=function(){
        this.valueSet={};
        this.dataType=viscomposer.Attribute.TYPE.QUANTITATIVE;
    };

    prototype.update=function(data){
        var type=typeof(data);
        if(type==='string'||type==='number'){
            this.valueSet[data]=this.valueSet[data]||0;
            ++this.valueSet[data];
        }
    };

    return Data;
})();

