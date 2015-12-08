/**
 * Created by lyt9304 on 15/7/28.
 */
viscomposer.workflow.WorkflowInputPort=(function(){

    var WorkflowInputPort=viscomposer.VObject.define("WorkflowInputPort",null,function(label,varname,selector){
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
    });

    WorkflowInputPort.prototype={
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
        }
    };

    WorkflowInputPort.load=function(hashmap,obj) {
        var input = new viscomposer.workflow.WorkflowInputPort();

        input.port1 = viscomposer.workflow.Port.load(hashmap, obj.port1);
        input.port2 = viscomposer.workflow.Port.load(hashmap, obj.port2);
        input.selector = obj.selector;
        input.port1.input = input.port2.input = input;

        var link = viscomposer.workflow.Link.load(hashmap, obj.linkFrom);

        return input;
    };


    return WorkflowInputPort;
})();

