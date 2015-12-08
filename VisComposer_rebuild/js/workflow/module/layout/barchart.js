/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.BarChart=(function(){
    var BarChart=viscomposer.workflow.Module.Factory({
        name:"module_barchart",
        funName:"BarChart",
        resName:"barchart",
        label:"BarChart",
        type:"layout",
        description:"",
        inPorts:[{
            "name":"bar_width",
            "label":"barWidth",
            "type":"map"
        },{
            "name":"data/x",
            "label":"dataX",
            "type":"input"
        },{
            "name":"data/y",
            "label":"dataY",
            "type":"input"
        }],
        outPorts:[{
            "name":"x_axis",
            "label":"x_axis",
            "type":"geometry"
        },{
            "name":"y_axis",
            "label":"y_axis",
            "type":"geometry"
        },{
            "name":"scaleX",
            "label":"scaleX",
            "type":"scale"
        },{
            "name":"scaleY",
            "label":"scaleY",
            "type":"scale"
        },{
            "name":"layout",
            "label":"layout",
            "type":"layout"
        }],
        properties:{

        }
    });

    var prototype=BarChart.prototype;

    prototype.init=function(){
        this.properties.scaleX.refName='scaleX';
        this.properties.scaleY.refName='scaleY';
        this.properties={
            scaleX:new viscomposer.workflow.ScaleModifier('x','auto','auto','horizontal'),
            scaleY:new viscomposer.workflow.ScaleModifier('y','auto','auto','vertical'),
        };
        this.type='layout';
        this.layoutIcon="resource/image/element/form/BarChart.png";
        this.layoutLabels=[
            ['number','number of bars in chart','layout().num'],
            ['x','position - x coordinate','layout().x'],
            ['y','position - y coordinate','layout().y'],
            ['width','width','layout().width'],
            ['height','height','layout().height'],
        ];
        this.layoutDescription="Bar Chart Layout";
    };


    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(barWidth,dataX,dataY){\n'+
            '        var transform=self();\n'+
            '        var width=transform.width;\n'+
            '        var height=transform.height;\n'+
            '        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
            '        dataX=dataX||[];\n'+
            '        dataY=dataY||[];\n'+
            '        var scaleX=('+viscomposer.util.addIndent(properties.scaleX.createTemplate(),2)+')(dataX);\n'+
            '        var scaleY=('+viscomposer.util.addIndent(properties.scaleY.createTemplate(),2)+')(dataY);\n'+
            '        var axisX=createAxis(scaleX.scale,"bottom",width/50,\''+uuid+'\',no,transform);\n'+
            '        axisX.setAttribute("transform","translate("+0+","+height+")");\n'+
            '        var axisY=createAxis(scaleY.scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
//'        axisY.setAttribute("transform","translate("+x+","+y+")");\n'+
            '        var xs=[],ys=[],widths=[],heights=[];\n'+
            '        for(var i=0,ni=dataX.length;i<ni;++i){\n'+
            '            xs.push(scaleX(dataX[i]).x-barWidth/2);ys.push(scaleY(dataY[i]).y);\n'+
            '            widths.push(barWidth);heights.push(height-ys[i]);\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.geoOutput[0].varname+':axisX,\n'+
            '            '+this.geoOutput[1].varname+':axisY,\n'+
//'            '+this.envOutput[0].varname+':transform,\n'+
            '            '+this.envOutput[0].varname+':scaleX,\n'+
            '            '+this.envOutput[1].varname+':scaleY,\n'+
            '            '+this.envOutput[2].varname+':{x:xs,y:ys,height:heights,barWidth:barWidth,num:dataX.length},\n'+
            '        };\n'+
            '    }\n'+
            '}())';
        return templateStr;
    };

    prototype.childProperties=function(properties){
        properties=properties||{};
        if(!isNaN(properties.width)){
            this.input[0].value=parseFloat(properties.width);
            properties.width='layout().barWidth';
        }
        properties.x=properties.x||'layout().x';
        properties.y=properties.y||'layout().y';
        properties.width=properties.width||'layout().barWidth';
        properties.height=properties.height||'layout().height';

        return properties;
    };

    prototype.prepare=function(){
        viscomposer.workflow.Module.prototype.prepare.call(this);

        this.properties.scaleX.prepare([this.input[1]]);
        this.properties.scaleY.prepare([this.input[2]]);
    };

    prototype.update=function(){
        viscomposer.workflow.Module.prototype.update.call(this);

        this.properties.scaleX.update();
        this.properties.scaleY.update();
    };

    return BarChart;
})();
