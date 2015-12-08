viscomposer.workflow.Module=(function(){
	var Module=viscomposer.VObject.define("Module",null,function(){
        //this.label="";
        //this.funName="";
        //this.resName="";
        //this.description="";
        //
        //this.input=[];
        //this.ouptut=[];

        this.label='Module';
        this.funName='Module';
        this.resName='result';
        this.input=[];
        this.output=[];
        this.geoOutput=[];
        this.envOutput=[];
        this.properties={};
        this.ui=null;

        this.type='normal';
	});

	var prototype=Module.prototype;

	prototype.init=function(){
		//TODO
	};

	prototype.prepare=function(){
		//TODO
        var varnames={};
        var output=this.output;
        if(this.geoOutput){output=output.concat(this.geoOutput);}
        if(this.envOutput){output=output.concat(this.envOutput);}
        for(var i=0,ni=output.length;i<ni;++i){
            var port=output[i];
            port.varname=viscomposer.util.processConflict(output[i].varname,varnames);
            port.prepare();
        }
	};

	prototype.update=function(){
		//TODO
	};

	prototype.submit=function(){
		//TODO
        this.update();
        viscomposer.app.tryRender();
	};

	var registeredClass=Module.registeredClass={};

	Module.Factory=function(moduleObj){
	    var ModuleClass=viscomposer.VObject.define(moduleObj.name,"Module",function(workflow,options){
	    	options=options||{};

	        this.workflow=workflow;

	        this.label=moduleObj.label||this.label;
	        this.funName=moduleObj.funName||this.label||this.funName;
	        this.resName=moduleObj.resName||this.funName||this.resName;
	        this.description=moduleObj.discription||this.description;
            this.input=[];
            this.env

	        var inPortsObj=moduleObj.inPorts;//type,lablel,varname,module,value
            var outPorts=moduleObj.outPorts;
	        var input=this.input;
            var geoOutput=this.geoOutput;
            var envOutput=this.envOutput;



	        for(var i=0,ni=inPortsObj.length;i<ni;++i){
	            var portObj=inPortsObj[i];
	            var port=new viscomposer.workflow.Port(portObj.type);
	            port.label=portObj.label;
	            port.varname=portObj.varname;
	            port.module=this;
	            input.push(port);
	        }


            if(this.label!="View"){
                var port1=new viscomposer.workflow.Port(outPorts[0].type);
                port1.label=outPorts[0].label;
                port1.varname=outPorts[0].varname;
                port1.module=this;
                geoOutput.push(port1);
                var port2=new viscomposer.workflow.Port(outPorts[1].type);
                port2.label=outPorts[1].label;
                port2.varname=outPorts[1].varname;
                port2.module=this;
                envOutput.push(port2);
            }else{
                var port1=new viscomposer.workflow.Port(outPorts[0].type);
                port1.label=outPorts[0].label;
                port1.varname=outPorts[0].varname;
                port1.module=this;
                envOutput.push(port1);
            }



	        this.properties={};
	        viscomposer.util.copyObject(this.properties,moduleObj.properties);

	        this.init(options);

            //workflow.addModule(this);
	        //viscomposer.app.uiManager.updateWorkflow(workflow);
	    });

	    var prototype=ModuleClass.prototype;

	    ModuleClass.objectType=moduleObj.name;
	    registeredClass[moduleObj.name]=ModuleClass;

	    return ModuleClass;
	};

	return Module;
})();