/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Text=(function(){
    var Text=viscomposer.workflow.Module.Factory({
        name:"module_text",
        funName:"Text",
        resName:"Text",
        label:"Text",
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
            "varname":"text",
            "label":"text",
            "type":"map"
        },{
            "varname":"rotate",
            "label":"rotate",
            "type":"map"
        },{
            "varvname":"font-size",
            "label":"font-size",
            "type":"map"
        },{
            "varvname":"font-family",
            "label":"font-family",
            "type":"map"
        },{
            "varname":"color",
            "label":"color",
            "type":"map"
        }],
        outPorts:[{
            "varname":"text",
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

    var prototype=Text.prototype;

    prototype.init=function(properties){

        this.input[0].value=properties.x||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y||(properties.underLayout?'layout().y':0);
        this.input[2].value='text';
        this.input[3].value='0';
        this.input[4].value='10';
        this.input[5].value='"Impact"';
        this.input[6].value='"#3366dd"';

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var uuid=this.uuid;
        //
        var templateStr=
            'function(x,y,width,height,color,style){\n'+
            '    var rect=createText(x,y,width,height,color,style,\''+uuid+'\',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':rect,\n'+
            '        '+this.envOutput[0].varname+':{x:x,y:y,width:width,height:height},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Text;
})();
