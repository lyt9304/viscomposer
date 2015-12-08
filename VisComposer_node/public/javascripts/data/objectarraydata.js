/**
 * @fileoverview 数据类基类 objectArrayData-->csv
 */

viscomposer.data.ObjectArrayData=(function(){
    var ObjectArrayData=viscomposer.VObject.define("ObjectArrayData","ArrayData",function(data){
            this.label="ObjectArrayData";
            this.cols={};

            if(data!==undefined&&data!==null){
                this.update(data);
            }
        }
    );

    var prototype=ObjectArrayData.prototype;

    prototype.prepare=function(){
        this.cols={};
    };

    prototype.update=function(data){
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
    };

    return ObjectArrayData;
})();



