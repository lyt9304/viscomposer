/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.CategoricalModifier=(function(){
    var CategoricalModifier=viscomposer.workflow.Module.Factory({
        name:"module_sort",
        funName:"CategoricalModifier",
        resName:"data_sorted",
        label:"CategoricalModifier",
        description:"",
        inPorts:[{
            "name":"input",
            "label":"input",
            "type":"input"
        }],
        outPorts:[{
            "name":"data_sorted",
            "label":"data_sorted",
            "type":"output"
        }],
        properties:{
            direction:'ascend',
            type:'none',
            cols:{}
        }
    });

    var prototype=CategoricalModifier.prototype;

    prototype.init=function(){
        this.update();
    };

    prototype.prepare=function(){
        viscomposer.workflow.Module.prototype.prepare.call(this);
    };

    prototype.update=function(){
        var data=this.input[0].getData();
        var properties=this.properties;
        var cols=properties.cols;
        if(data){
            if(data instanceof viscomposer.data.ObjectArrayData){
                properties.type='objectarray';
                for(var key in data.cols){
                    cols[key]=data.cols[key]['_dataType'];
                }
            }else if(data instanceof viscomposer.data.ArrayData){
                properties.type='array';
                var key=data.label;
                cols[key]=data.dataType;
            }else if(data instanceof viscomposer.data.ObjectData){
                properties.type='object';
                for(var key in data.cols){
                    cols[key]=data.cols[key]['_dataType'];
                }
            }else if(data instanceof viscomposer.data.Data){
                properties.type='data';
                var key=data.label;
                cols[key]=data.dataType;
            }else{
                properties.type='none';
                console.error('error: wrong data type');
            }
        }
        //TODO
    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var key=properties.selectedCol;
        var exp;

        var templateStr=
            'function(input){\n';
        var col=properties.cols[key];
        if(col){
            switch(properties.direction){
                case 'none':
                default:
                    templateStr+=
                        '    var compareFunc=function(a,b){return 0;}\n';
                    break;
                case 'descend':
                    templateStr+=
                        '    var compareFunc=function(a,b){if(typeof(a["'+key+'"])==="number"){return a["'+key+'"]-b["'+key+'"];}else{return a["'+key+'"].localeCompare(b["'+key+'"]);}}\n';
                    break;
                case 'ascend':
                    templateStr+=
                        '    var compareFunc=function(a,b){if(typeof(a["'+key+'"])==="number"){return b["'+key+'"]-a["'+key+'"];}else{return -(a["'+key+'"].localeCompare(b["'+key+'"]));}}\n';
                    break;
            }
        }else{
            templateStr+=
                '    var compareFunc=function(a,b){return 0;}\n';
        }

        templateStr+=
            '    var output=input.sort(compareFunc);\n'+
            '    return {'+this.output[0].varname+':output};\n'+
            '}\n';

        return templateStr;
    };

    return CategoricalModifier;
})();
