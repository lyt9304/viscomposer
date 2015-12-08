/**
 * @fileoverview 数据类基类 ArrayData->一列数据
 */

viscomposer.data.ArrayData=(function(){
    var ArrayData=viscomposer.VObject.define("ArrayData","Data",function(data) {

            this.label="ArrayData";
            this.prepare();
            if (data !== undefined && data !== null) {
                this.update(data);
            }
        }
    );

    var prototype=ArrayData.prototype;

    prototype.row=function(row){
        var data=viscomposer.data.DataFactory(this.data[row]);
        data.label=this.label;
        return data;
    };

    prototype.prepare=function(){
        this.valueSet={};
        this.dataType=viscomposer.Attribute.TYPE.QUANTITATIVE;
    };


    prototype.update=function(data){
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
    };

    return ArrayData;
})();
