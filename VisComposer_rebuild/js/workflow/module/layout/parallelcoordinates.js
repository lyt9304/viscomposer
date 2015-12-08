/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.ParallelCoordinates=(function(){
    var ParallelCoordinates=viscomposer.workflow.Module.Factory({
        name:"module_parallelcoordinates",
        funName:"ParallelCoordinates",
        resName:"ParallelCoordinates",
        label:"ParallelCoordinates",
        type:"layout",
        description:"",
        inPorts:[{
            "name":"data",
            "label":"data",
            "type":"input"
        }],
        outPorts:[{
            "name":"axes",
            "label":"axes",
            "type":"geometry"
        },{
            "name":"layout",
            "label":"layout",
            "type":"layout"
        }],
        properties:{
            scales:[]
        }
    });

    var prototype=ParallelCoordinates.prototype;

    prototype.init=function(){
        this.type='layout';
        this.layoutIcon="resource/image/element/form/ParallelCoordinates.png";
        this.layoutLabels=[
            ['number','number of data points','layout().num'],
            ['polyLine','polylines data of each data point','layout().polyLine'],
            ['dimension','dimension number of data points','layout().dim'],
            ['scale','scale of each axis(dimension)','layout().scale'],
        ];
        this.layoutDescription="Parallel Coordinates Layout";
    };


    prototype.createTemplate=function(){
        var properties=this.properties;
        var scales=properties.scales;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(data){\n'+
            '        var transform=self();\n'+
            '        var width=transform.width;\n'+
            '        var height=transform.height;\n'+
            '        var no=count++;\n'+
            '        data=data||[];\n'+
            '        var dataCols=[];\n'+
            '        var dim='+scales.length+';\n'+
            '        for(var j=0,nj=dim;j<nj;++j){\n'+
            '            dataCols.push(getCol(data,j));\n'+
            '        }\n'+
            '        var scales=[],axes=[],axesXs=[];\n';
        for(var i=0,ni=scales.length;i<ni;++i){
            templateStr+=
                '        scales.push(('+viscomposer.util.addIndent(properties.scales[i].createTemplate(),2)+')(dataCols['+i+']));\n'+
                '        var axis=createAxis(scales['+i+'].scale,"left",height/35,\''+uuid+'\',no,transform);\n'+
                '        var axisX=width*'+i+'/'+(ni-1)+';\n'+
                '        axesXs.push(axisX);\n'+
                '        axis.setAttribute("transform","translate("+axisX+","+0+")");\n'+
                '        axes.push(axis);\n';
        }
        templateStr+=
            '        var polys=[];\n'+
            '        for(var i=0,ni=data.length;i<ni;++i){\n'+
            '            var lineX=[],lineY=[];\n'+
            '            for(var j=0,nj=dim;j<nj;++j){\n'+
            '                lineX.push(axesXs[j]);lineY.push(scales[j](dataCols[j][i])["axis_"+j]);\n'+
            '            }\n'+
            '            polys.push({x:lineX,y:lineY});\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.geoOutput[0].varname+':axes,\n'+
            '            '+this.envOutput[0].varname+':{polyLine:polys,num:data.length,dim:dim,xs:axesXs},\n'+
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

        var data=this.input[0].data;
        if(data){
            var dataTypes=[];
            for(var key in data.cols){
                dataTypes.push(data.cols[key]._dataType);
            }
            var scales=this.properties.scales;
            if(scales.length>dataTypes.length){
                for(var i=dataTypes.length;i<scales.length;++i){
                    scales[i].destroy();
                }
            }
            scales.length=dataTypes.length;
            for(var i=0,ni=scales.length;i<ni;++i){
                if(!scales[i]){
                    scales[i]=new viscomposer.workflow.ScaleModifier('axis_'+i,'auto','auto','vertical');
                }
                scales[i].prepare([{data:{dataType:dataTypes[i]}}]);
            }
        }
    };

    prototype.update=function(){
        viscomposer.workflow.Module.prototype.update.call(this);

        var scales=this.properties.scales;
        for(var i=0,ni=scales.length;i<ni;++i){
            scales[i].update();
        }
    };

    return ParallelCoordinates;
})();
