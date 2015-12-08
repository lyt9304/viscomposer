/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Rect=(function(){
    var Rect=viscomposer.workflow.Module.Factory({
        name:"module_rect",
        funName:"Rect",
        resName:"Rect",
        label:"Rect",
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
            "varname":"width",
            "label":"width",
            "type":"map"
        },{
            "varname":"height",
            "label":"height",
            "type":"map"
        },{
            "varname":"color",
            "label":"color",
            "type":"map"
        },{
            "varvname":"style",
            "label":"style",
            "type":"map"
        }],
        outPorts:[{
            "varname":"rect",
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

    var prototype=Rect.prototype;

    prototype.init=function(properties){

        this.input[0].value=properties.x||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y||(properties.underLayout?'layout().y':0);
        this.input[2].value=properties.width||(properties.underLayout?'layout().width':500);
        this.input[3].value=properties.height||(properties.underLayout?'layout().height':500);
        this.input[4].value=properties.color||'"#3366dd"';
        this.input[5].value='""';


    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var uuid=this.uuid;
        //
        var templateStr=
            'function(x,y,width,height,color,style){\n'+
            '    var rect=createRect(x,y,width,height,color,style,\''+uuid+'\',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':rect,\n'+
            '        '+this.envOutput[0].varname+':{x:x,y:y,width:width,height:height},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Rect;
})();
