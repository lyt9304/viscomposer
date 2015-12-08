/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Line=(function(){
    var Line=viscomposer.workflow.Module.Factory({
        name:"module_line",
        funName:"Line",
        resName:"Line",
        label:"Line",
        type:"geometry",
        description:"",
        inPorts:[{
            "varname":"x1",
            "label":"x1",
            "type":"map"
        },{
            "varname":"y1",
            "label":"y1",
            "type":"map"
        },{
            "varname":"x2",
            "label":"x2",
            "type":"map"
        },{
            "varname":"y2",
            "label":"y2",
            "type":"map"
        },{
            "varname":"width",
            "label":"width",
            "type":"map"
        },{
            "varname":"color",
            "label":"color",
            "type":"map"
        }],
        outPorts:[{
            "varname":"line",
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

    var prototype=Line.prototype;


    prototype.init=function(properties){

        this.input[0].value=properties.x1||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y1||(properties.underLayout?'layout().y':0);
        this.input[2].value=properties.x2||(properties.underLayout?'layout().x+100':100);
        this.input[3].value=properties.y2||(properties.underLayout?'layout().y+100':100);
        this.input[4].value=properties.lineWidth||2;
        this.input[5].value='"#3366dd"';

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var uuid=this.uuid;
        //
        var templateStr=
            'function(x1,y1,x2,y2,width,color){\n'+
            '    var line=createLine(x1,y1,x2,y2,width,color,\''+uuid+'\',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':line,\n'+
            '        '+this.envOutput[0].varname+':{x:x1,y:y1,width:x2-x1,height:y2-y1},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Line;
})();

