viscomposer.DataInfo = (function(){
    var DataInfo=viscomposer.VObject.define("DataInfo",null,function(obj){
        this.title = this.originalTitle = obj.fileName;
        this.original = true;
        this.file = null;
        this.fileContent = obj.data;
        this.data = null;
        this.attributes = null;
        this.filetype = obj.type;
        switch(this.filetype){
            case 'text/csv':
                this.parseCSV(obj.data);
                break;
            default :
                break;
        }
    });

    var prototype = DataInfo.prototype;

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