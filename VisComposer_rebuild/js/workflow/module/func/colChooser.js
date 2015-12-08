/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.ColChooser=(function(){
    var ColChooser=viscomposer.workflow.Module.Factory({
        name:"module_colchooser",
        funName:"ColChooser",
        resName:"data",
        label:"ColChooser",
        type:"",
        description:"",
        inPorts:[{
            "varname":"input",
            "label":"input",
            "type":"input"
        }],
        outPorts:[{
            "varname":"data",
            "label":"data",
            "type":"output"
        }],
        properties:{
            type:'none',
            cols:{}
        }
    });

    var prototype=ColChooser.prototype;

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
                    cols[key]={
                        dataType:data.cols[key]['_dataType'],
                        selected:false,
                    };
                }
            }else if(data instanceof viscomposer.data.ArrayData){
                properties.type='array';
                var key=data.label;
                cols[key]={
                    dataType:data.dataType,
                    selected:false,
                }
            }else if(data instanceof viscomposer.data.ObjectData){
                properties.type='object';
                for(var key in data.cols){
                    cols[key]={
                        dataType:data.cols[key]['_dataType'],
                        selected:false,
                    }
                }
            }else if(data instanceof viscomposer.data.Data){
                properties.type='data';
                var key=data.label;
                cols[key]={
                    dataType:data.dataType,
                    selected:false,
                }
            }else{
                properties.type='none';
                console.error('error: wrong data type');
            }
        }
    };

    prototype.init=function(properties){
        this.update();
    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var exp;

        var templateStr=
            'function(input){\n'+
            '    var output=[];\n'+
            '    for(var i=0,ni=input.length;i<ni;++i){\n'+
            '        var record={\n';
        for(var key in properties.cols){
            var col=properties.cols[key];
            if(col.selected){
                templateStr+=
                    '            \''+key+'\':input[i][\''+key+'\'],\n'+
                    '        var record={\n';
            }
        }
        templateStr+=
            '        };\n'+
            '        output.push(record);\n'+
            '    }\n'+
            '    return {'+this.output[0].varname+':output};\n'+
            '}';

        return templateStr;
    };

    return ColChooser;
})();

