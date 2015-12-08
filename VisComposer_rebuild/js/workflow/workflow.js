viscomposer.workflow.Workflow=(function(){
	var Workflow=viscomposer.VObject.define("Workflow",null,function(node,options){
		options=options||{};

	    this.node=node;

	    this.label='Workflow';
	    this.funName='Workflow';
	    this.resName='result';
        //this.ui_=null;
	    this.header=new viscomposer.workflow.WorkflowHeader(this);

	    this.moduleList={};
	    this.moduleFunNames={};
	    this.linkList={};

	    this.properties={
	        num:1
	    };

		//viscomposer.app.uiManager.updateWorkflow(this);
	});

	var prototype=Workflow.prototype;

	prototype.getEnv=function(){
	    return this.node.parent.getEnv();
	};

    prototype.getEnv_=function(){
        var env=this.node.parent.getEnv_();
        var envOutput=this.getEnvironmentOutputs();
        for(var i=0,ni=envOutput.length;i<ni;++i){
            var envI=envOutput[i];
            env[envI.varname]=envI;
        }

        return env;
    };

	prototype.prepare=function(simplify){
        this.properties.num=0;

        if(!simplify){
            this.header.prepare();
            var moduleList=this.moduleList;
            for(var key in moduleList){
                moduleList[key].prepare();
            }
            this.updateInternalPorts();
            this.updateExternalPorts();
            this.updateImportedData();

            this.updateOutputPorts();
            this.updateGeometryOutputs();
            this.updateEnvironmentOutputs();
        }

        this.envOutputSample=[];
	};

    prototype.hasLayout=function(){
        var envOutput=this.getEnvironmentOutputs();
        for(var i=0,ni=envOutput.length;i<ni;++i){
            var port=envOutput[i];
            if(port.type=='layout'){
                return true;
            }
        }
        return false;
    };

	prototype.update=function(){

	    this.header.update();

	    /*var topoRes=this.topoSort();

	    if(topoRes){
	        for(var i=0,ni=topoRes.length;i<ni;++i){
	            topoRes[i].update();
	        }
	    }else{
	        var moduleList=this.moduleList;
	        for(var key in moduleList){
	            moduleList[key].update();
	        }
	    }

	    return topoRes;*/
	};

	prototype.addData=function(dataInfo){
	    var ret=this.header.addData(dataInfo);

	    this.updateImportedData();
	    this.updateInternalPorts();

	    return ret;
	};

	prototype.addPort=function(label,varname,selector){
	    var ret=this.header.addPort(label,varname,selector);

	    this.updateInternalPorts();
	    this.updateExternalPorts();

	    return ret;
	};

	prototype.addModule=function(module){
	    this.moduleList[module.uuid]=module;
	    module.funName=viscomposer.util.processConflict(module.funName,this.moduleFunNames);
	    module.workflow=this;
	    if(module.type==='layout'){
	        this.layoutModule=module;
	    }

	    this.updateGeometryOutputs();
	    this.updateEnvironmentOutputs();

	    //module.update();
	    if(module.geoOutput||module.envOutput){
	        viscomposer.app.uiManager.updateCanvas();
	    }
	};

	prototype.removeModule=function(module){
	    if(this.layoutModule===module){
	        this.layoutModule=null;
	    }
	    module.destroy();
	};

	prototype.addLink=function(port1,port2){
	    var link=new viscomposer.workflow.Link(port1,port2);

	    if(port2.module){
	        port2.module.update();
	    }else if(port2.workflow){
	        port2.workflow.update();
	    }

	    viscomposer.app.tryRender();
	};

	prototype.removeLink=function(link){
	    link.destroy();
	};

    prototype.updateExternalPorts=function(){
        var ret=this.gen_externalPorts=this.header.getExternalPorts();

        var parent=this.node&&this.node.parent;
        parent&&parent.workflow&&parent.workflow.updateOutputPorts();
        return;
    };

    prototype.getExternalPorts=function(){
        if(!this.gen_externalPorts){
            this.updateExternalPorts();
        }
        return this.gen_externalPorts;
    };

    prototype.updateInternalPorts=function(){
        return this.gen_internalPorts=this.header.getInternalPorts();
    };

    prototype.getInternalPorts=function(){
        if(!this.gen_internalPorts){
            this.updateInternalPorts();
        }
        return this.gen_internalPorts;
    };

    prototype.updateOutputPorts=function(){
        var output=[];
        var children=this.node&&this.node.children;
        if(children){
            for(var i=0,ni=children.length;i<ni;++i){
                var workflowTo=children[i].workflow;
                if(workflowTo){
                    output.push({
                        workflow:workflowTo,
                        ports:workflowTo.getExternalPorts()||[],
                    });
                }
            }
        }

        return this.gen_outputPorts=output;
    };

    prototype.getOutputPorts=function(){
        if(!this.gen_outputPorts){
            this.updateOutputPorts();
        }
        return this.gen_outputPorts;
    };

    prototype.updateImportedData=function(){
        return this.gen_importedData=this.header.getImportedData();
    };

    prototype.getImportedData=function(){
        if(!this.gen_importedData){
            this.updateImportedData();
        }
        return this.gen_importedData;
    };

    prototype.updateGeometryOutputs=function(){
        var geoOutput=[];
        var moduleList=this.moduleList;
        for(key in moduleList){
            var module=moduleList[key];
            if(module.geoOutput){
                geoOutput=geoOutput.concat(module.geoOutput);
            }
        }

        return this.gen_geoOutputs=geoOutput;
    };

    prototype.getGeometryOutputs=function(){
        if(!this.gen_geoOutputs){
            this.updateGeometryOutputs();
        }
        return this.gen_geoOutputs;
    };

    prototype.updateEnvironmentOutputs=function(){
        var envOutput=[];
        var moduleList=this.moduleList;
        for(key in moduleList){
            var module=moduleList[key];
            if(module.envOutput){
                envOutput=envOutput.concat(module.envOutput);
            }
        }

        return this.gen_envOutputs=envOutput;
    };

    prototype.getEnvironmentOutputs=function(){
        if(!this.gen_envOutputs){
            this.updateEnvironmentOutputs();
        }
        return this.gen_envOutputs;
    };

	prototype.topoSort=function(){
	    var topoNodes=[],topoRes=[];
	    var list=this.moduleList;
	    for(var key in list){
	        var module=list[key];
	        var input=module.input;
	        var gen_degree=0;
	        for(var i=0,ni=input.length;i<ni;++i){
	            var port=input[i];
	            if(!port.linkFrom){
	                if(port.value!==undefined&&port.value!==null){
	                    port.gen_prepared=true;
	                }else{
	                    port.gen_prepared=true;
	                    console.log('Link missing: '+port.module.label+'/'+port.label+'.');
	                }
	            }else{
	                port.gen_prepared=false;
	                ++gen_degree;
	            }
	        }
	        module.gen_degree=gen_degree;
	        module.gen_complete=false;
	        module.gen_defined=false;
	        topoNodes.push(module);
	    }

	    var internalPorts=this.gen_internalPorts;
	    for(var i=0,ni=internalPorts.length;i<ni;++i){
	        var port1=internalPorts[i];
	        var portLinks=port1.linkTo;
	        for(var port2ID in portLinks){
	            var port2=portLinks[port2ID].port2;
	            var moduleTo=port2.module;
	            if(moduleTo instanceof viscomposer.workflow.Module){
	                if(!port2.gen_prepared){
	                    port2.gen_prepared=true;
	                    --moduleTo.gen_degree;
	                }
	            }
	        }
	    }
	    while(topoRes.length<topoNodes.length){
	        for(var i=0,ni=topoNodes.length;i<ni;++i){
	            var module=topoNodes[i];
	            if(!module.gen_complete){
	                if(module&&module.gen_degree==0){
	                    var output=module.output;

	                    for(var j=0;j<output.length;++j){
	                        var port1=output[j];
	                        var portLinks=port1.linkTo;
	                        for(var port2ID in portLinks){
	                            var port2=portLinks[port2ID].port2;
	                            var moduleTo=port2.module;
	                            if(moduleTo&&!port2.gen_prepared){
	                                port2.gen_prepared=true;
	                                --moduleTo.gen_degree;
	                            }
	                        }
	                    }

	                    topoRes.push(module);
	                    module.gen_complete=true;
	                    break;
	                }
	            }
	        }
	        if(i>=topoNodes.length){
	            // no topology order
	            console.log('error: No topology order.');

	            return;
	        }
	    }

	    for(var i=0,ni=topoRes.length;i<ni;++i){
	        var module=topoRes[i];
	        if(module.type==='layout'){
	            topoRes.splice(i,1);
	            topoRes.push(module);
	            break;
	        }
	    }

	    return topoRes;
	};

	prototype.createTemplate=function(simplify){
	    var topoRes=this.topoSort();
	    if(!topoRes){return;}
	    var paraStr,varNames={};

	    viscomposer.util.processConflict('input',varNames);
	    viscomposer.util.processConflict('loop',varNames);
	    viscomposer.util.processConflict('importedData',varNames);
	    viscomposer.util.processConflict('env',varNames);
	    viscomposer.util.processConflict('tmp',varNames);
	    viscomposer.util.processConflict('i',varNames);
	    viscomposer.util.processConflict('seled',varNames);
	    viscomposer.util.processConflict('filterFunc',varNames);
	    viscomposer.util.processConflict('validCnt',varNames);

	    var templateStr=
	'(function(){\n';
	    templateStr+=
	'    return {\n'+
	'        run:function(input,loop,importedData,env){\n'+
	'            window.env=env;\n'+
	'            window.input=input;\n'+
	'            window.i=0;\n'+
	'            var filterFunc='+viscomposer.util.addIndent(this.header.createFilterFunc(),3)+'\n'+
	'            var seled=[],validCnt=0;\n'+
	'            for(i=0;i<loop;++i){\n'+
	'                var tmp=filterFunc(input,i);\n'+
	'                seled.push(tmp);\n'+
	'                if(tmp)++validCnt;\n'+
	'            }\n';

	    var externalPorts=this.header.input;
	    for(var i=0,ni=externalPorts.length;i<ni;++i){
	        var port=externalPorts[i];
	        var port1=port.port1;
	        var port2=port.port2;
	        port2.gen_varname='input[i][\''+port1.varname+'\']';
	        if(!simplify){
	            templateStr+=
	'            var tmp=viscomposer.Object.hashmap.get("'+port2.uuid+'");\n'+
	'            for(i=0;i<loop;++i){\n'+
	'                if(seled[i]){\n'+
	'                    tmp.update('+port2.gen_varname+');\n'+
	'                }\n'+
	'            }\n';
	        }
	    }
	    var importedData=this.gen_importedData;
	    for(var i=0,ni=importedData.length;i<ni;++i){
	        var port=importedData[i];
	        port.gen_varname='importedData[\''+port.varname+'\']';
	    }
	    for(var i=0,ni=topoRes.length;i<ni;++i){
	        var module=topoRes[i];
	        for(var j=0;j<module.input.length;++j){
	            var port=module.input[j];
	            viscomposer.util.processConflict(port.varname,varNames);
	        }
	        if(!module.gen_defined){
	            var funName=module.gen_funName=viscomposer.util.processConflict(module.funName,varNames);
	            if(!simplify){
	                templateStr+=
	'            viscomposer.Object.hashmap.get(\''+module.uuid+'\').update();\n';
	            }
	            templateStr+=
	'            var '+funName+'='+viscomposer.util.addIndent(module.createTemplate(),3)+';\n';
	            module.gen_defined=true;
	        }
	        var label=module.label;
	        var funName=module.gen_funName;
	        var resName=module.gen_resName=viscomposer.util.processConflict(module.resName,varNames);
	        var input=module.input,
	            output=module.output;
	        if(module.geoOutput){output=output.concat(module.geoOutput);}
	        if(module.envOutput){output=output.concat(module.envOutput);}

	        for(var j=0;j<output.length;++j){
	            var port=output[j];
	            var varname=port.varname;
	            port.gen_varname=resName+"[i]['"+varname+"']";
	        }

	        templateStr+=
	'            try{\n';
	        if(!simplify){
	            templateStr+=
	'                var tmp=[\n';
	                for(var j=0;j<output.length;++j){
	                    var port=output[j];
	                    var varname=port.varname;
	                    port.gen_varname=resName+"[i]['"+varname+"']";
	                    templateStr+=
	'                    viscomposer.Object.hashmap.get("'+port.uuid+'"),\n';
	                }
	                templateStr+=
	'                ];\n';
	        }
	        templateStr+=
	'                var '+resName+'=[];\n'+
	'                (function(){\n';
	        var hasTransform=module.hasTransform();
	        if(hasTransform){
	            templateStr+=
	'                    window.transform=[];\n';
	        }
	        templateStr+=
	'                    for(i=0;i<loop;++i){\n'+
	'                        if(seled[i]){\n';
	                paraStr='';
	                for(var j=0;j<input.length;++j){
	                    var port=input[j];
	                    var paraExpr=port.getVarname();
	                    var paraname=port.varname;
	                    if(j>0){paraStr+=',';}
	                    paraStr+=paraname;
	                    templateStr+=
	'                            var '+paraname+'='+paraExpr+';\n';
	                }
	                templateStr+=
	'                            '+resName+'.push('+funName+'('+paraStr+'));\n';
	                if(!simplify){
	                    for(var j=0;j<output.length;++j){
	                        var port=output[j];
	                        templateStr+=
	'                            tmp['+j+'].update('+port.gen_varname+');\n';
	                    }
	                }
	                templateStr+=
	'                        }else{\n'+
	'                            '+resName+'.push(null);\n'+
	'                        }\n';
	                if(hasTransform){
	                    templateStr+=
	'                        window.transform.push('+resName+'[i]&&'+resName+'[i].transform);\n';
	                }
	                templateStr+=
	'                    }\n'+
	'                })();\n'+
	'            }catch(e){\n'+
	'               console.log(e.stack.split(\'\\n\').slice(0,2).join(\'\\n\'));\n'+
	'            }\n';
	    }
	    templateStr+=
	'            return (function(){\n'+
	'                var dataOut=[];\n'+
	'                var geoOut=[];\n'+
	'                var transOut=[];\n'+
	'                var envOut=[];\n'+
	'                for(i=0;i<loop;++i){\n'+
	'                    if(!seled[i]){continue;}\n'+
	'                    dataOut.push([\n';
	    var output=this.getOutputPorts();
	    for(var j=0;j<output.length;++j){
	        templateStr+=
	'                        {\n';
	        var ports=output[j].ports;
	        for(var k=0;k<ports.length;++k){
	            var port=ports[k];
	            var keyname=port.varname;
	            var varname=port.getVarname();
	            templateStr+=
	'                            \''+keyname+'\':'+varname+',\n';
	        }
	        templateStr+=
	'                        },\n';
	    }
	    templateStr+=
	'                    ]);\n'+
	'                }\n'+
	'                for(i=0;i<loop;++i){\n'+
	'                    if(!seled[i]){continue;}\n'+
	'                    var geoOutI=[];\n';
	    var geoOutputs=this.getGeometryOutputs();
	    for(var j=0;j<geoOutputs.length;++j){
	        var port=geoOutputs[j];
	        var keyname=port.varname;
	        var varname=port.gen_varname;
	        templateStr+=
	'                    geoOutI=geoOutI.concat('+varname+');\n';
	    }
	    templateStr+=
	'                    geoOut.push(geoOutI);\n'+
	'                }\n'+
	'                for(i=0;i<loop;++i){\n'+
	'                    if(!seled[i]){continue;}\n'+
	'                    var envOutI={parent:env};\n';
	    var envOutput=this.getEnvironmentOutputs();
	    for(var j=0;j<envOutput.length;++j){
	        var port=envOutput[j];
	        var keyname=port.varname;
	        var varname=port.getVarname();
	        templateStr+=
	'                    envOutI[\''+keyname+'\']='+varname+';\n';
	    }
	    templateStr+=
	'                    envOut.push(envOutI);\n'+
	'                    viscomposer.Object.hashmap.get(\''+this.uuid+'\').envOutputSample.push(envOutI);\n'+
	'                }\n'+
	'                return {data:dataOut,geometry:geoOut,env:envOut,loop:validCnt};\n'+
	'            })();\n'+
	'        },\n'+
	'    };\n'+
	'})()';

	    return templateStr;
	};

    //prototype.store=function(){
    //    var obj=viscomposer.Object.prototype.store.call(this);
    //
    //    obj.objectType='workflow';
    //
    //    obj.label=this.label;
    //    obj.funName=this.funName;
    //    obj.resName=this.resName;
    //    obj.header=this.header.store();
    //
    //    var moduleList=obj.moduleList=[];
    //    for(var key in this.moduleList){
    //        moduleList.push(this.moduleList[key].store());
    //    }
    //
    //    var linkList=obj.linkList=[];
    //    for(var key in this.linkList){
    //        linkList.push(this.linkList[key].store());
    //    }
    //
    //    return obj;
    //};

    //load

	return Workflow;
})();