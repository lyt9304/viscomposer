/**
 * @fileoverview 数据标签
 */

//DataInfo类主要负责读取文件以及处理csv和json返回对应的对象。
viscomposer.DataInfo=(function(){
    var DataInfo=viscomposer.VObject.define("DataInfo",null,function(){
        this.file=null;
        this.fileContent=null;
        this.data=null;
        this.attributes=null;
    });

    var prototype=DataInfo.prototype;
    
    prototype.readFile=function(file,callback){
        this.file=file;

        var fileReader = new FileReader();
        fileReader.readAsText(file);
        var me=this;
        fileReader.onload=function(){
            var content=me.fileContent=this.result;
             var suffix = (me.title.split('.'))[1];
            if(suffix == 'csv'){
                me.parseCSV(content);
            }
            else if(suffix == 'json')
            {
                me.parseJSON(content);
            }
            me.filetype = suffix;
            callback(me);
        }
    };
    prototype.parseCSV=function(input){

        var cols, result, rows;
        rows = input.replace(/\n+/g, '\n').replace(/\r+/g, '').trim().split('\n').map(function(row, index) {
            return row.split(',');
        });

        cols = rows.shift();
        var attributes=this.attributes=[];
        cols.forEach(function(col,index){
            var tmp=new viscomposer.Attribute();
            tmp.index=index;
            tmp.label=col;
            tmp.type=viscomposer.Attribute.TYPE.QUANTITATIVE;
            //tmp.direction=viscomposer.Attribute.DIRECTION.NONE;
            attributes.push(tmp);
        });

        result=this.data=[];

        rows.forEach(function(row) {
            var _row;
            _row = {};
            row.forEach(function(value, index) {
                //_row.push(value);
                if(isNaN(value)){
                    attributes[index].type=viscomposer.Attribute.TYPE.CATEGORICAL;
                }
                _row[cols[index]]=value;
                var count=attributes[index].valueSet[value];
                count=count||0;
                ++count;
                attributes[index].valueSet[value]=count;
            });
            return result.push(_row);
        });

    };
    prototype.parseJSON = function(input){
        this.data = jQuery.parseJSON(input);
    };

    return DataInfo;
})();