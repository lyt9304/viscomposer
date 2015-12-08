/**
 * @fileoverview workflow过滤模块类
 */

viscomposer.workflow.CrossMatrix=(function(){
    var CrossMatrix=viscomposer.workflow.Module.Factory({
        name:"module_crossmatrix",
        funName:"Grid",
        resName:"grid",
        label:"Grid",
        type:"layout",
        description:"",
        inPorts:[{
            "name":"dim",
            "label":"dim",
            "type":"input"
        }],
        outPorts:[{
            "name":"index",
            "label":"index",
            "type":"output"
        },{
            "name":"layout",
            "label":"layout",
            "type":"layout"
        }],
        properties:{

        }
    });

    var prototype=CrossMatrix.prototype;

    prototype.init=function(){
        this.type='layout';
        this.layoutIcon="resource/image/element/array/grid.png";
        this.layoutLabels=[
            ['number','number of grids','layout().num'],
            ['row','row index (starts from 0)','layout().row'],
            ['col','col index (starts from 0)','layout().col'],
            ['x','position - x coordinate','layout().x'],
            ['y','position - y coordinate','layout().y'],
            ['width','width','layout().width'],
            ['height','height','layout().height'],
        ];
        this.layoutDescription="Array Layout - Grid";
    };


    prototype.createTemplate=function(){
        var properties=this.properties;
        //
        var uuid=this.uuid;
        var templateStr=
            '(function(){\n'+
            '    var count=0;\n'+
            '    return function(dim){\n'+
            '        var transform=self();\n'+
            '        var width=transform.width;\n'+
            '        var height=transform.height;\n'+
            '        var no=count++;\n'+
//'        var transform=createTransform(x,y,width,height,\''+uuid+'\',no,env.transform);\n'+
            '        var cellWidth=width/dim;\n'+
            '        var cellHeight=height/dim;\n'+
            '        var xs=[],ys=[],widths=[],heights=[],indexs=[],rows=[],cols=[];\n'+
            '        for(var i=0,ni=dim;i<ni;++i){\n'+
            '            for(var j=0,nj=dim;j<nj;++j){\n'+
            '                xs.push(i*cellWidth);ys.push(j*cellHeight);\n'+
//'                widths.push(cellWidth);heights.push(cellHeight);\n'+
            '                indexs.push({col:i,row:j});rows.push(j);cols.push(i);\n'+
            '            }\n'+
            '        }\n'+
            '        return {\n'+
            '            '+this.output[0].varname+':indexs,\n'+
//'            '+this.envOutput[0].varname+':transform,\n'+
            '            '+this.envOutput[0].varname+':{x:xs,y:ys,width:cellWidth,height:cellHeight,row:rows,col:cols,num:dim*dim,colNum:dim,rowNum:dim},\n'+
            '        };\n'+
            '    }\n'+
            '}())';
        return templateStr;
    };

    prototype.childProperties=function(properties){
        properties=properties||{};
        properties.x=properties.x||'layout().x';
        properties.y=properties.y||'layout().y';
        properties.width=properties.width||'layout().width';
        properties.height=properties.height||'layout().height';

        return properties;
    };

    return CrossMatrix;
})();
