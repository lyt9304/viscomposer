/**
 * Created by lyt9304 on 15/7/31.
 */

viscomposer.workflow.Indicator=(function(){
    var Indicator=viscomposer.workflow.Module.Factory({
        name:"module_indicator",
        funName:"Indicator",
        resName:"Indicator",
        label:"Indicator",
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
            "varname":"indicator",
            "label":"output",
            "type":"geometry"
        },{
            "varname":"transform",
            "label":"transform",
            "type":"transform"
        }],
        properties:{
            type:"none",
            cols:{}
        }
    });

    var prototype=Indicator.prototype;


    prototype.init=function(properties){

        this.input[0].value='layout().x+layout().width/2';
        this.input[1].value='layout().y+layout().height/2';
        this.input[2].value=5;
        this.input[3].value='"#3366dd"';

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var uuid=this.uuid;
        //
        var templateStr=
            'function(cx,cy,r,color){\n'+
            '    var circle=createCircle(cx,cy,r,color,\''+uuid+'\',0,env.transform);\n'+
            '    circle.setAttribute("class","intermediate indicator-point");\n'+
            '    circle.isIndicator=true;\n'+
            '    circle.index=i;\n'+
            '    return {\n'+
            '        '+this.geoOutput[0].varname+':circle,\n'+
            '        '+this.envOutput[0].varname+':{x:cx,y:cy,width:r,height:r},\n'+
            '    };\n'+
            '}';
        return templateStr;
    };

    return Indicator;
})();

//'circle': viscomposer.workflow.Circle,
//'rectangle': viscomposer.workflow.Rect,
//'line': viscomposer.workflow.Line,
//'path': viscomposer.workflow.Path,
//'polyline': viscomposer.workflow.Polyline,
//'text': viscomposer.workflow.Text,
