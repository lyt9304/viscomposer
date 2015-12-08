/**
 * @fileoverview 数据类基类 objectData-->json
 */


viscomposer.data.ObjectData=(function(){
    var ObjectData=viscomposer.VObject.define("ObjectData","Data",function(data){
            this.label="ObjectData";
            this.cols={};

            if(data!==undefined&&data!==null){
                this.update(data);
            }
        }
    );

    var prototype=ObjectData.prototype;

    prototype.col=function(col){
        var data=viscomposer.data.DataFactory(this.data[col]);
        data.label=col;
        return data;
    };

    prototype.prepare=function(){
        this.cols={};
    };

    prototype.update=function(data) {
        for (key in data) {
            var value = data[key];
            var col = this.cols[key] = this.cols[key] || {'_dataType': viscomposer.Attribute.TYPE.QUANTITATIVE};
            col[value] = col[value] || 0;
            ++col[value];
            if (isNaN(value)) {
                col['_dataType'] = viscomposer.Attribute.TYPE.CATEGORICAL;
            }
        }
    };

    return ObjectData;
})();


