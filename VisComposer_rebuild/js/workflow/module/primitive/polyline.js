/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Polyine=(function(){
    var Polyine=viscomposer.workflow.Module.Factory({
        name:"module_polyline",
        funName:"Polyine",
        resName:"Polyine",
        label:"Polyine",
        type:"geometry",
        description:"",
        inPorts:[{
            "varname":"x",
            "label":"x",
            "type":"map"
        },{
            "varname":"y",
            "label":"y",
            "type":"map"
        },{
            "varname":"color",
            "label":"color",
            "type":"map"
        },{
            "varname":"line_width",
            "label":"line_width",
            "type":"map"
        }],
        outPorts:[{
            "varname":"polyline",
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

    var prototype=Polyine.prototype;


    prototype.init=function(properties){

        this.input[0].value=properties.x||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y||(properties.underLayout?'layout().y':0);
        this.input[2].value='"#3344dd"';
        this.input[3].value=1

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var templateStr=
            'function(x,y,color,lineWidth){\n'+
            '    var polyline=createPolyline(x,y,color,lineWidth,\''+this.uuid+'\',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':polyline,\n'+
            '        '+this.envOutput[0].varname+':{},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Polyine;
})();
