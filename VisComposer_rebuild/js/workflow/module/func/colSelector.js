/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.ColSelector=(function(){
    var ColSelector=viscomposer.workflow.Module.Factory({
        name:"module_colselector",
        funName:"ColSelector",
        resName:"data_selected",
        label:"ColSelector",
        type:"",
        description:"",
        inPorts:[{
            "varname":"data",
            "label":"data",
            "type":"input"
        },{
            "varname":"col",
            "label":"col",
            "type":"input"
        }],
        outPorts:[{
            "varname":"output",
            "label":"output",
            "type":"output"
        }],
        properties:{

        }
    });

    var prototype=ColSelector.prototype;

    prototype.addInputPort=function(label){
        label=label||'col';

        var port=new viscomposer.workflow.Port('input');
        port.label=port.varname=label;
        port.module=this;
        var input=this.input;
        input.push(port);

        var labels={},varnames={};
        for(var i=0,ni=input.length;i<ni;++i){
            var port=input[i];
            port.label=viscomposer.util.processConflict(port.label,labels);
            port.varname=viscomposer.util.processConflict(port.varname,varnames);
        }
    };

    prototype.addOutputPort=function(label){
        label=label||'output';

        var port=new viscomposer.workflow.Port('output');
        port.label=port.varname=label;
        port.module=this;
        var output=this.output;
        output.push(port);

        var labels={},varnames={};
        for(var i=0,ni=output.length;i<ni;++i){
            var port=output[i];
            port.label=viscomposer.util.processConflict(port.label,labels);
            port.varname=viscomposer.util.processConflict(port.varname,varnames);
        }
    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var data=this.input[0].data;
        var attrs=data&&data.attributes||[];
        var input=this.input;
        var output=this.output;

        var templateStr=
            'function(data){\n'+
            '    var colName=[';
        for(var i=0,ni=attrs.length;i<ni;++i){
            if(i>0){templateStr+=',';}
            templateStr+='\''+attrs[i].label+'\'';
        }
        templateStr+='];\n'+
        '    var output=[];\n'+
        '    for(var j=0,nj='+output.length+';j<nj;++j){\n'+
        '        output.push(getCol(data,arguments[j+1]));\n'+
        '    }\n'+
        '    return {';
        for(var i=0,ni=output.length;i<ni;++i){
            templateStr+=output[i].varname+':output['+i+'],';
        }
        templateStr+=
            '    }\n'+
            '}';
        return templateStr;
    };

    return ColSelector;
})();

