/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.Scatterplot=(function(){
    var Scatterplot=viscomposer.workflow.Module.Factory({
        name:"module_scatterplot",
        funName:"Coordinates",
        resName:"coordinates",
        label:"2-d Coordinates",
        type:"layout",
        description:"",
        inPorts:[{
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

    var prototype=Scatterplot.prototype;

    prototype.init=function(){

        this.properties={
            scaleX:new viscomposer.workflow.ScaleModifier('x','auto','auto','horizontal'),
            scaleY:new viscomposer.workflow.ScaleModifier('y','auto','auto','vertical'),
        };
        //TODO
        //outPort4.modifier=this.properties.scaleX;
        //outPort5.modifier=this.properties.scaleY;
        //this.properties.scaleX.refName=outPort4.varname;
        //this.properties.scaleY.refName=outPort5.varname;
        this.type='layout';
        this.layoutIcon="resource/image/element/array/Coordinates.png";
        this.layoutLabels=[
            ['number','number of data points','layout().num'],
            ['x','position - x coordnate','layout().x'],
            ['y','position - y coordnate','layout().y']
        ];
        this.layoutDescription="2-d Distribution Layout";
    };


    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(dataX,dataY){\n'+
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
            '        var xs=[],ys=[];\n'+
            '        for(var i=0,ni=dataX.length;i<ni;++i){\n'+
            '            xs.push(scaleX(dataX[i]).x);ys.push(scaleY(dataY[i]).y);\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.geoOutput[0].varname+':axisX,\n'+
            '            '+this.geoOutput[1].varname+':axisY,\n'+
//'            '+this.envOutput[0].varname+':transform,\n'+
            '            '+this.envOutput[0].varname+':scaleX,\n'+
            '            '+this.envOutput[1].varname+':scaleY,\n'+
            '            '+this.envOutput[2].varname+':{x:xs,y:ys,num:dataX.length},\n'+
            '        };\n'+
            '    }\n'+
            '}())';
        return templateStr;
    };

    prototype.childProperties=function(properties){
        properties=properties||{};
        properties.x=properties.x||'layout().x';
        properties.y=properties.y||'layout().y';

        return properties;
    };

    prototype.prepare=function(){
        viscomposer.workflow.Module.prototype.prepare.call(this);

        this.properties.scaleX.prepare([this.input[0]]);
        this.properties.scaleY.prepare([this.input[1]]);
    };

    prototype.update=function(){
        viscomposer.workflow.Module.prototype.update.call(this);

        this.properties.scaleX.update();
        this.properties.scaleY.update();
    };

    return Scatterplot;
})();
