/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.StackedBarChart=(function(){
    var StackedBarChart=viscomposer.workflow.Module.Factory({
        name:"module_stackedbarchart",
        funName:"StackedBarChart",
        resName:"StackedBarChart",
        label:"2-d Coordinates",
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

    var prototype=StackedBarChart.prototype;

    prototype.init=function(){
        this.input[0].value=32;
        //outPort4.modifier=this.properties.scaleX;
        //outPort5.modifier=this.properties.scaleY;
        //this.properties.scaleX.refName=outPort4.varname;
        //this.properties.scaleY.refName=outPort5.varname;
        this.properties={
            scaleX:new viscomposer.workflow.ScaleModifier('x','auto','auto','horizontal'),
            scaleY:new viscomposer.workflow.ScaleModifier('y','auto','auto','vertical')
        };
        this.properties.scaleY.properties.containZero=true;
        this.type='layout';
        this.layoutIcon="resource/image/element/array/coordinates.png";
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
            '    var c20=d3.scale.category20();\n'+
            '    return function(barWidth,dataX,dataY){\n'+
            '        var transform=self();\n'+
            '        var width=transform.width;\n'+
            '        var height=transform.height;\n'+
            '        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
            '        dataX=dataX||[];\n'+
            '        dataY=dataY||[];\n'+
            '        var dataYSum=[];\n'+
            '        for(var j=0,nj=dataY.length;j<nj;++j){\n'+
            '            dataYSum.push(0);\n'+
            '            for(var k=0,nk=dataY[j].length;k<nk;++k){\n'+
            '                dataYSum[j]+=dataY[j][k];\n'+
            '            }\n'+
            '        }\n'+
            '        var scaleX=('+viscomposer.util.addIndent(properties.scaleX.createTemplate(),2)+')(dataX);\n'+
            '        var scaleY=('+viscomposer.util.addIndent(properties.scaleY.createTemplate(),2)+')(dataYSum);\n'+
            '        var axisX=createAxis(scaleX.scale,"bottom",width/50,\''+uuid+'\',no,transform);\n'+
            '        axisX.setAttribute("transform","translate("+0+","+height+")");\n'+
            '        var axisY=createAxis(scaleY.scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
            '        var xs=[],ys=[],widths=[],heights=[],classIndex=[],classColor=[],classHeight=[];\n'+
            '        for(var j=0,nj=dataY.length;j<nj;++j){\n'+
            '            var curX=scaleX(dataX[j]).x-barWidth/2,curY=height,curH\n'+
            '            xs.push(curX);ys.push(height-scaleY(dataYSum[j]).y);\n'+
            '            widths.push(barWidth);heights.push(scaleY(dataYSum[j]).y);\n'+
            '            classIndex.push([]);classColor.push([]);classHeight.push([]);\n'+
            '            for(var k=0,nk=dataY[j].length;k<nk;++k){\n'+
            '                var curH=scaleY(dataY[j][k]).y;\n'+
//'                curY-=curH;\n'+
//'                xs.push(curX);ys.push(curY);\n'+
//'                widths.push(barWidth);heights.push(curH);\n'+
            '                classIndex[j].push(k);classColor[j].push(c20(k));classHeight[j].push(curH);\n'+
            '            }\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.geoOutput[0].varname+':axisX,\n'+
            '            '+this.geoOutput[1].varname+':axisY,\n'+
            '            '+this.envOutput[0].varname+':scaleX,\n'+
            '            '+this.envOutput[1].varname+':scaleY,\n'+
            '            '+this.envOutput[2].varname+':{x:xs,y:ys,height:heights,barWidth:barWidth,num:xs.length,classIndex:classIndex,classColor:classColor,classHeight:classHeight},\n'+
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
        properties.color=properties.color||'layout().classColor';

        return properties;
    };

    prototype.prepare=function(){
        viscomposer.workflow.Module.prototype.prepare.call(this);

        this.properties.scaleX.prepare([this.input[1]]);
        //this.properties.scaleY.prepare([this.input[2]]);
        this.properties.scaleY.inputData={dataType:viscomposer.Attribute.TYPE.QUANTITATIVE};
    };

    prototype.update=function(){
        viscomposer.workflow.Module.prototype.update.call(this);

        this.properties.scaleX.update();
        this.properties.scaleY.update();
    };

    return StackedBarChart;
})();
