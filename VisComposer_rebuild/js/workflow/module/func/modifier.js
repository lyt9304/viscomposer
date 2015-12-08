/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.ModifierModule=(function(){
    var ModifierModule=viscomposer.workflow.Module.Factory({
        name:"module_modifier",
        funName:"ModifierModule",
        resName:"output",
        label:"ModifierModule",
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

    var prototype=ModifierModule.prototype;

    prototype.init=function(ref,modifier){
        //TODO
        this.ref=ref;
        this.modifier=modifier;


        if(modifier){
            var input=this.input,output=this.output;
            for(var i=0,ni=modifier.input.length;i<ni;++i){
                var inputI=modifier.input[i];
                var port=new viscomposer.workflow.Port('map');
                port.label=port.varname=inputI;
                port.module=this;
                input.push(port);
            }

            for(var i=0,ni=modifier.output.length;i<ni;++i){
                var inputI=modifier.output[i];
                var port=new viscomposer.workflow.Port('output');
                port.label=port.varname=inputI;
                port.module=this;
                output.push(port);
            }
        }
    };

    prototype.getModifier=function(){
        if(this.ref){
            return this.modifier;
        }else{
            var objStruct=modifier.split('.');
            var obj=this.workflow.getEnv();
            for(var i=1,ni=objStruct.length;i<ni;++i){
                obj=obj[objStruct[i]];
            }
            return obj.modifier;
        }
    };

    prototype.createTemplate=function(){
        var templateStr='';
        var modifier=this.modifier;
        if(this.ref){
            templateStr+=
                '(function(){\n'+
                '    return function(){\n'+
                '        var tmp=env.'+this.modifier.refName+'.apply(this,arguments);\n'+
                '        return{\n';
            for(var i=0,ni=this.output.length;i<ni;++i){
                templateStr+=
                    '            '+this.output[i].varname+':tmp["'+modifier.output[i]+'"],\n';
            }
            templateStr+=
                '        };\n'+
                '    }\n'+
                '})()\n';
        }else{
            templateStr+=
                '(function(){\n'+
                '    var modifier='+viscomposer.util.addIndent(modifier.createTemplate(),1)+'();\n'+
                '    return function(){\n'+
                '        var tmp=modifier.apply(this,arguments);\n'+
                '        return{\n';
            for(var i=0,ni=this.output.length;i<ni;++i){
                templateStr+=
                    '            '+this.output[i].varname+':tmp["'+modifier.output[i]+'"],\n';
            }
            templateStr+=
                '        };\n'+
                '    }\n'+
                '})()\n';
        }

        return templateStr;
    };

    return ModifierModule;

})();
