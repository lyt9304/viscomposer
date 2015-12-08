/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.DataModule=(function(){
    var DataModule=viscomposer.workflow.Module.Factory({
        name:"module_data",
        funName:"GetData",
        resName:"data",
        label:"DataModule",
        description:"",
        inPorts:[{
            "name":"data",
            "label":"",
            "type":"input"
        }],
        outPorts:[
        ],
        properties:{
            type:"none"
        }
    });

    var prototype=DataModule.prototype;

    prototype.init=function(portFrom){
        this.label=portFrom&&(portFrom.dataInfo&&portFrom.dataInfo.originalTitle||portFrom.label)||'Data';
        var link=new viscomposer.workflow.Link(portFrom,this.input[0]);
        // TODO
        this.update();
    };

    prototype.checkOutput=function(varname){
        var output=this.output;
        for(var i=0,ni=output.length;i<ni;++i){
            if(output[i].varname==varname){
                return true;
            }
        }
        return false;
    };

    prototype.update=function(){
        /*var data=this.input[0].getData();
        var properties=this.properties
        var me=this;
        if(data){
            var output=this.output;
            if(data instanceof viscomposer.data.ObjectArrayData){
                properties.type='objectarray';
                if(!me.checkOutput('_index')){
                    port=new viscomposer.workflow.Port('output');
                    port.label='index';
                    port.module=me;
                    port.varname='_index';
                    port.selector='i';
                    output.push(port);
                }
                for(var key in data.cols){
                    if(!me.checkOutput(key)){
                        port=new viscomposer.workflow.Port('output');
                        port.label=key;
                        port.module=me;
                        port.varname=key;
                        port.selector='data[i][\''+key+'\']';
                        output.push(port);
                    }
                }
            }else if(data instanceof viscomposer.data.ArrayData){
                properties.type='array';
                if(!me.checkOutput('_index')){
                    port=new viscomposer.workflow.Port('output');
                    port.label='index';
                    port.module=me;
                    port.varname='_index';
                    port.selector='i';
                    output.push(port);
                }
                if(!me.checkOutput(data.label)){
                    me.cancelAllOutput();
                    port=new viscomposer.workflow.Port('output');
                    port.label=data.label;
                    port.module=me;
                    port.varname='';
                    port.selector='data[i]';
                    output.push(port);
                }
            }else if(data instanceof viscomposer.data.ObjectData){
                properties.type='object';
                for(key in data.cols){
                    if(!me.checkOutput(key)){
                        port=new viscomposer.workflow.Port('output');
                        port.label=key;
                        port.module=me;
                        port.varname=key;
                        port.selector='data[\''+key+'\']';
                        output.push(port);
                    }
                }
            }else if(data instanceof viscomposer.data.Data){
                properties.type='data';
                if(!me.checkOutput(data.label)){
                    me.cancelAllOutput();
                    port=new viscomposer.workflow.Port('output');
                    port.label=data.label;
                    port.module=me;
                    port.varname=data.label;
                    port.selector='data';
                    output.push(port);
                }
            }else{
                properties.type='none';
                console.error('error: wrong data type');
            }
        }*/
        //TODO
    };

    prototype.cancelAllOutput=function(){
        var output=this.output;
        for(var i=0,ni=output.length;i<ni;++i){
            output[i].disconnectAll();
            output[i].destroy();
        }
        this.output=[];
    }

    prototype.createTemplate=function(){
        var templateStr='';
        var data=this.data;

        var output=this.output;
        var properties=this.properties;

        if(output.length>0){
            switch(properties.type){
            case 'objectarray':
                var usedAttr=[];
                for(var i=0;i<output.length;++i){
                    var port=output[i];
                    if(!viscomposer.util.isEmpty(port.linkTo)){
                        usedAttr.push({key:port.varname,selector:port.selector});
                    }
                }
                templateStr+=
'function(data){\n';
                for(var i=0,ni=usedAttr.length;i<ni;++i){
                    templateStr+=
'    var '+usedAttr[i].key+'=[];\n';
                }
                if(usedAttr.length>0){
                    templateStr+=
'    for(var i=0,ni=data.length;i<ni;++i){\n';
                    for(var i=0,ni=usedAttr.length;i<ni;++i){
                        templateStr+=
'        '+usedAttr[i].key+'.push('+usedAttr[i].selector+');\n';
                    }
                    templateStr+=
'    }\n';
                }
                templateStr+=
'    return {\n';
                for(var i=0,ni=usedAttr.length;i<ni;++i){
                    templateStr+=
'        \''+usedAttr[i].key+'\':'+usedAttr[i].key+',\n';
                }
                templateStr+=
'    };\n'+
'}';
                break;
            case 'array':
            templateStr+=
'function(data){\n'+
'    return {\n'+
'        \''+output[0].varname+'\':data,\n';
'    };\n'+
'}';
                break;
            case 'object':
                var usedAttr=[];
                for(var i=0;i<output.length;++i){
                    var port=output[i];
                    if(!viscomposer.util.isEmpty(port.linkTo)){
                        usedAttr.push({key:port.varname,selector:port.selector});
                    }
                }
                templateStr+=
'function(data){\n'+
'    return {\n';
                for(var i=0,ni=usedAttr.length;i<ni;++i){
                    templateStr+=
'        \''+usedAttr[i].key+'\':'+usedAttr[i].selector+',\n';
                }
                templateStr+=
'    };\n'+
'}';
                break;
            case 'data':
                templateStr+=
'function(data){\n'+
'    return {\n'+
'        \''+output[0].varname+'\':data,\n'+
'    };\n'+
'}';
                break;
            default:
                templateStr+=
'function(data){\n'+
'    return {\n'+
'    };\n'+
'}';
            }
        }else{
                templateStr+=
'function(data){\n'+
'    return {\n'+
'    };\n'+
'}';
        }

        return templateStr;
    };

    return DataModule;
})();
