/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.Filter=(function(){
    var Filter=viscomposer.workflow.Module.Factory({
        name:"module_filter",
        funName:"Filter",
        resName:"data_filtered",
        label:"Filter",
        description:"",
        inPorts:[{
            "name":"input",
            "label":"",
            "type":"input"
        }],
        outPorts:[{
            "name":"data_filtered",
            "label":"data_filtered",
            "type":"output"
        }],
        properties:{
            type:"none",
            cols:{}
        }
    });

    var prototype=Filter.prototype;

    prototype.init=function(){
        this.update();
    }

    prototype.update=function(){
        /*var data=this.input[0].getData();
        var properties=this.properties;
        var cols=properties.cols;
        if(data){
            if(data instanceof viscomposer.data.ObjectArrayData){
                properties.type='objectarray';
                for(var key in data.cols){
                    cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
                }
            }else if(data instanceof viscomposer.data.ArrayData){
                properties.type='array';
                var key=data.label;
                cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
            }else if(data instanceof viscomposer.data.ObjectData){
                properties.type='object';
                for(var key in data.cols){
                    cols[key]=this.mergeCol(cols[key],data.cols[key],data.cols[key]['_dataType']);
                }
            }else if(data instanceof viscomposer.data.Data){
                properties.type='data';
                var key=data.label;
                cols[key]=this.mergeCol(cols[key],data.valueSet,data.dataType);
            }else{
                properties.type='none';
                console.error('error: wrong data type');
            }
        }*/
        //TODO
    };

    prototype.mergeCol=function(thisCol,mergeCol,dataType){
        thisCol=thisCol||{'_dataType':viscomposer.Attribute.TYPE.QUANTITATIVE};
        if(thisCol._dataType||dataType==viscomposer.Attribute.TYPE.CATEGORICAL){
            thisCol._dataType=dataType;
        }
        for(var key in mergeCol){
            if(key=='_dataType'||key=='_min'||key=='_max'){
                continue;
            }else{
                if(thisCol[key]===undefined||thisCol[key]===null){
                    thisCol[key]=thisCol[key]||true;
                }
                //thisCol[key]+=mergeCol[key];
            }
        }
        return thisCol;
    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var key=properties.selectedCol;
        var exp;

        var templateStr=
    'function(input){\n'+
    '    var output=[];\n';
        if(properties.code){
            templateStr+=
        '    for(var i=0,ni=input.length;i<ni;++i){\n';
            for(var key in properties.cols){
                templateStr+=
        '        var '+key+'=input[i][\''+key+'\'];\n';
            }
            templateStr+=
        '        if('+properties.code+'){\n'+
        '            output.push(input[i]);\n'+
        '        }\n'+
        '    }\n'+
        '    return {'+this.output[0].varname+':output};\n'+
        '}';
        }else{
            var col=properties.cols[key];
            if(col){
                switch(col._dataType){
                case viscomposer.Attribute.TYPE.QUANTITATIVE:
                    exp='(value>=('+properties._min+'))&&(value<=('+properties._max+'))';
                    break;
                case viscomposer.Attribute.TYPE.CATEGORICAL:
                    templateStr+=
            '    var validValues={';
                    for(var value in col){
                        if(value=='_dataType'||value=='_min'||value=='_max'){
                            continue;
                        }else{
                            if(col[value]){
                                templateStr+='\''+value+'\':true,';
                            }
                        }
                    }
                    templateStr+='};\n';
                    exp='validValues[value]';
                    break;
                default:
                    exp='false';
                }
            }else{
                exp='false';
            }

            templateStr+=
        '    for(var i=0,ni=input.length;i<ni;++i){\n'+
        '        var value=input[i][\''+key+'\'];\n'+
        '        if('+exp+'){\n'+
        '            output.push(input[i]);\n'+
        '        }\n'+
        '    }\n'+
        '    return {'+this.output[0].varname+':output};\n'+
        '}';
        }

        return templateStr;
    };

    return Filter;
})();
