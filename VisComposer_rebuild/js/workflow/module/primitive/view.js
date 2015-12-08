/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.View=(function(){
    var View=viscomposer.workflow.Module.Factory({
        name:"module_view",
        funName:"View",
        resName:"View",
        label:"View",
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
            "varname":"width",
            "label":"width",
            "type":"map"
        },{
            "varname":"height",
            "label":"height",
            "type":"map"
        }],
        outPorts:[{
            "varname":"transform",
            "label":"transform",
            "type":"transform"
        }],
        properties:{
            type:"none",
            cols:{}
        }
    });

    var prototype=View.prototype;


    prototype.init=function(properties){

        this.input[0].value=properties.x||(properties.underLayout?'layout().x':0);
        this.input[1].value=properties.y||(properties.underLayout?'layout().y':0);
        this.input[2].value=properties.width||(properties.underLayout?'layout().width':500);
        this.input[3].value=properties.height||(properties.underLayout?'layout().height':500);

    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(x,y,width,height){\n'+
            '        var transform=createTransform(x,y,width,height,\''+uuid+'\',count++,env.transform);\n'+
            '        return {'+this.envOutput[0].varname+':transform};\n'+
            '    }\n'+
            '}())';
        return templateStr;
    };

    return View;
})();

//'circle': viscomposer.workflow.Circle,
//'rectangle': viscomposer.workflow.Rect,
//'line': viscomposer.workflow.Line,
//'path': viscomposer.workflow.Path,
//'polyline': viscomposer.workflow.Polyline,
//'text': viscomposer.workflow.Text,