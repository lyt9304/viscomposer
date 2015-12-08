/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Circle=(function(){
    var Circle=viscomposer.workflow.Module.Factory({
        name:"module_circle",
        funName:"Circle",
        resName:"Circle",
        label:"Circle",
        type:"geometry",
        description:"",
        inPorts:[{
            "varname":"cx",
            "label":"cx",
            "type":"map"
        },{
            "varname":"cy",
            "label":"cy",
            "type":"map"
        },{
            "varname":"r",
            "label":"r",
            "type":"map"
        },{
            "varname":"color",
            "label":"color",
            "type":"map"
        }],
        outPorts:[{
            "varname":"circle",
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

    var prototype=Circle.prototype;


    prototype.init=function(properties){

        this.input[0].value=properties.x||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y||(properties.underLayout?'layout().y':0);
        this.input[2].value=properties.width||2;
        this.input[3].value='"#3366dd"';

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var uuid=this.uuid;
        //
        var templateStr=
            'function(cx,cy,r,color){\n'+
            '    var circle=createCircle(cx,cy,r,color,\''+uuid+'\',0,env.transform);\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':circle,\n'+
            '        '+this.envOutput[0].varname+':{x:cx,y:cy,width:r,height:r},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Circle;
})();

