/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Path=(function(){
    var Path=viscomposer.workflow.Module.Factory({
        name:"module_path",
        funName:"Path",
        resName:"Path",
        label:"Path",
        type:"geometry",
        description:"",
        inPorts:[{
            "varname":"d",
            "label":"d",
            "type":"map"
        },{
            "varname":"style",
            "label":"style",
            "type":"map"
        }],
        outPorts:[{
            "varname":"path",
            "label":"output",
            "type":"geometry"
        },{
            "varname":"transform",
            "label":"transform",
            "type":"transform"
        }],
        properties:{
        }
    });

    var prototype=Path.prototype;


    prototype.init=function(properties){

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var templateStr=
            'function(d,style){\n'+
            '    var path=createPath(d,style,'+this.uuid+',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':path,\n'+
            '        '+this.envOutput[0].varname+':{},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Path;
})();

