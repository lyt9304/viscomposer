/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.VerticalArray=(function(){
    var VerticalArray=viscomposer.workflow.Module.Factory({
        name:"module_verticalarray",
        funName:"VerticalArray",
        resName:"VerticalArray",
        label:"Vertical Array",
        type:"layout",
        description:"",
        inPorts:[{
            "name":"height",
            "label":"height",
            "type":"input"
        }],
        outPorts:[{
            "name":"layout",
            "label":"layout",
            "type":"layout"
        }],
        properties:{

        }
    });

    var prototype=VerticalArray.prototype;

    prototype.init=function(){
        this.input[0].value=1;
        this.type='layout';
        this.layoutIcon="resource/image/element/array/vertical.png";
        this.layoutLabels=[
            ['number','number of grids','layout().num'],
            ['y','position - y coordinate','layout().y'],
            ['height','height','layout().height'],
        ];
        this.layoutDescription="Array Layout - Vertical";
    };


    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(weight){\n'+
            '        var transform=self();\n'+
            '        var width=transform.width;\n'+
            '        var height=transform.height;\n'+
            '        var no=count++;\n'+
            '        var weightSum=0;\n'+
            '        for(var i=0,ni=weight.length;i<ni;++i){\n'+
            '            weightSum+=weight[i];\n'+
            '        }\n'+
            '        var ys=[],heights=[],curY=0;\n'+
            '        for(var i=0,ni=weight.length;i<ni;++i){\n'+
            '            var curHeight=height*weight[i]/weightSum;\n'+
            '            ys.push(curY);curY+=curHeight;\n'+
            '            heights.push(curHeight);\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.envOutput[0].varname+':{x:0,y:ys,width:width,height:heights,num:weight.length},\n'+
            '        };\n'+
            '    }\n'+
            '}())';
        return templateStr;
    };

    prototype.childProperties=function(properties){
        properties=properties||{};
        properties.x=properties.x||'0';
        properties.y=properties.y||'layout().y';
        properties.width=properties.width||'parent().width';
        properties.height=properties.height||'layout().height';

        return properties;
    };


    return VerticalArray;
})();
