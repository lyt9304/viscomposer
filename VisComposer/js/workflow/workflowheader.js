

viscomposer.workflow.WorkflowHeader=function(workflow){
    this.workflow=workflow;
    //data from parent
    this.loopNum='auto';
    this.input=[];
    //imported data
    this.importedData=[];
    this.varnames={};
    this.labels={};
    this.filter='all';
};

viscomposer.workflow.WorkflowHeader.prototype={
    constructor:viscomposer.WorkflowHeader,

    addPort:function(label,varname,selector){
        varname=viscomposer.util.processConflict(varname,this.varnames);
        selector=selector||(varname+'[i]');
        label=viscomposer.util.processConflict(label,this.labels);
        var input=new viscomposer.workflow.WorkflowInputPort(label,varname,selector);
        input.workflow=this.workflow;
        input.port1.header=input.port2.header=this;
        input.port1.workflow=input.port2.workflow=this.workflow;
        this.input.push(input);
        return input;
    },

    addData:function(dataInfo){
        var port=new viscomposer.workflow.Port('data');
        port.dataInfo=dataInfo;

        var dataName=dataInfo.originalTitle.split('.')[0];

        port.label=viscomposer.util.processConflict(dataInfo.originalTitle,this.labels);
        port.varname=viscomposer.util.processConflict(dataName,this.varnames);
        port.header=this;
        port.workflow=this.workflow;
        port.imported=true;

        this.importedData.push(port);

        return port;
    },

    getLoopNum:function(dataIn){
        var rule=this.loopNum;
        var input=this.input;
        if(rule==='auto'){
            for(var i=0,ni=input.length;i<ni;++i){
                mainVar=input[i].port1.varname;
                var tmp=dataIn[mainVar];
                if(tmp!==undefined&&tmp!==null){
                    return dataIn[mainVar].length;
                }
            }
            if(env.layout&&env.layout.num){
                return env.layout.num;
            }
            return null;
        }else{
            return viscomposer.Environment.build(rule);
        }
    },

    createFilterFunc:function(dataIn){
        var rule=this.filter;
        var input=this.input;
        if(rule==='all'){
            var funcStr=
'function(dataIn){\n'+
'    return true;\n'+
'}'
        }else{
            var funcStr=
'function(dataIn){\n';
            for(var i=0,ni=input.length;i<ni;++i){
                varname=input[i].port1.varname;
                funcStr+=
'    var '+varname+'=dataIn[\''+varname+'\'];\n';
            }
            funcStr+=
'    if('+rule+'){return true;}else{return false;}\n'+
'}';
        }
        return funcStr;
    },

    prepare:function(){
        var input=this.input;
        for(var i=0,ni=input.length;i<ni;++i){
            input[i].prepare();
        }
        var importedData=this.importedData;
        for(var i=0,ni=importedData.length;i<ni;++i){
            importedData[i].prepare();
            importedData[i].update(importedData[i].dataInfo&&importedData[i].dataInfo.data);
        }
    },

    update:function(){
        var input=this.input;
        for(var i=0,ni=input.length;i<ni;++i){
            input[i].update();
        }
    },

    getExternalPorts:function(){
        var ports=[];
        var input=this.input;
        for(var i=0,ni=input.length;i<ni;++i){
            ports.push(input[i].port1);
        }

        return ports;
    },

    getInternalPorts:function(){
        var ports=[];
        var input=this.input;
        for(var i=0,ni=input.length;i<ni;++i){
            ports.push(input[i].port2);
        }

        return ports.concat(this.importedData);
    },

    getImportedData:function(){
        var data=[];
        var importedData=this.importedData;
        for(var i=0,ni=importedData.length;i<ni;++i){
            data.push(importedData[i]);
        }

        return data;
    },

    store:function(){
        var obj={};
        obj.loopNum=this.loopNum;
        var input=obj.input=[];
        for(var i=0,ni=this.input.length;i<ni;++i){
            input.push(this.input[i].store());
        }
        var importedData=obj.importedData=[];
        for(var i=0,ni=this.importedData.length;i<ni;++i){
            importedData.push(this.importedData[i].store());
        }

        return obj;
    }
};

viscomposer.workflow.WorkflowHeader.load=function(hashmap,obj,workflow){    
    var header=new viscomposer.workflow.WorkflowHeader();

    header.workflow=workflow;
    header.loopNum=obj.loopNum;
    var input=header.input=[];
    for(var i=0,ni=obj.input.length;i<ni;++i){
        var inputPort=viscomposer.workflow.WorkflowInputPort.load(hashmap,obj.input[i],workflow);
        inputPort.workflow=workflow;
        inputPort.port1.workflow=inputPort.port2.workflow=workflow;
        inputPort.port1.header=inputPort.port2.header=header;
        input.push(inputPort);
    }
    var importedData=header.importedData=[];
    for(var i=0,ni=obj.importedData.length;i<ni;++i){
        var port=viscomposer.workflow.Port.load(hashmap,obj.importedData[i]);
        importedData.push(port);
        port.header=header;
        port.workflow=workflow;
    }

    return header;
}

viscomposer.workflow.WorkflowInputPort=function(label,varname,selector){
    if(arguments.length>=3){
        this.port1=new viscomposer.workflow.Port('input');
        this.port2=new viscomposer.workflow.Port('output');
        this.port1.label=this.port2.label=label;
        this.port1.varname=this.port2.varname=varname;
        this.port1.input=this.port2.input=this;
        
        this.selector=selector||'auto';
    }else{
        this.port1=null;
        this.port2=null;
        this.selector=null;
    }
};

viscomposer.workflow.WorkflowInputPort.prototype={
    constructor:viscomposer.WorkflowInput, 

    prepare:function(){
        this.port1.prepare();
        this.port2.prepare();
    },

    update:function(){
    },

    createTemplate:function(){
        if(this.selector==='auto'){   
            var templateStr=
'function(data,i){\n'+
'    return data[i];\n'+
'}\n';   
        }else{
            var templateStr=
'function(data,i){\n'+
'    var '+this.port1.varname+'=data;\n'+
'    return '+this.selector+';\n'+
'}\n';
        }
        return templateStr;
    },

    store:function(){
        var obj={};
        obj.port1=this.port1.store();
        obj.port2=this.port2.store();
        obj.selector=this.selector;
        var linkFrom=this.port1.linkFrom;
        obj.linkFrom=linkFrom&&linkFrom.store();

        return obj;
    },
};

viscomposer.workflow.WorkflowInputPort.load=function(hashmap,obj){
    var input=new viscomposer.workflow.WorkflowInputPort();

    input.port1=viscomposer.workflow.Port.load(hashmap,obj.port1);
    input.port2=viscomposer.workflow.Port.load(hashmap,obj.port2);
    input.selector=obj.selector;
    input.port1.input=input.port2.input=input;
    
    var link=viscomposer.workflow.Link.load(hashmap,obj.linkFrom);

    return input;
}