/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.CustomModule=(function(){
    var CustomModule=viscomposer.workflow.Module.Factory({
        name:"module_custom",
        funName:"CustomModule",
        resName:"output",
        label:"CustomModule",
        type:"",
        description:"",
        inPorts:[],
        outPorts:[],
        properties:{
            functionStr:'function(/* input1, input2, ... */){\n'+
            '    // write code here\n'+
            '    return {\n'+
            '        // write outputs here\n'+
            '        output1:null, // output1\n'+
            '        output2:null, // output2\n'+
            '    };\n'+
            '}'
        }
    });

    var prototype=CustomModule.prototype;

    prototype.addInputPort=function(label){
        label=label||'input';

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
        return port;
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

        return port;
    };

    prototype.createTemplate=function(){
        return this.properties.functionStr;
    };

    return CustomModule;
})();

