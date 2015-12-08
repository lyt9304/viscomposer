/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Counter=(function(){
    var Counter=viscomposer.workflow.Module.Factory({
        name:"module_counterr",
        funName:"Counter",
        resName:"count",
        label:"Counter",
        type:"",
        description:"",
        inPorts:[{
            "varname":"data",
            "label":"data",
            "type":"input"
        }],
        outPorts:[{
            "varname":"x",
            "label":"x",
            "type":"output"
        },{
            "varname":"count",
            "label":"count",
            "type":"output"
        },{
            "varname":"range",
            "label":"range",
            "type":"output"
        }],
        properties:{

        }
    });

    var prototype=Counter.prototype;

    prototype.update=function(){
        var data=this.input[0].getData();
    };

    prototype.createTemplate=function(){
        var properties=this.properties;
        var sectionNum=properties.sectionNum;
        //
        var input=this.input;
        var output=this.output;

        var templateStr=
            'function(data){\n'+
            '    var minmax=getMinMax(data);\n'+
            '    var min=minmax[0],max=minmax[1];\n'+
            '    var x=[],count=[],range=[],lastX=min,curX;\n'+
            '    var sectionNum='+sectionNum+';\n'+
            '    for(var i=0;i<sectionNum;++i){\n'+
            '        curX=(min+(max-min)*(i+1)/(sectionNum-1));\n'+
            '        x.push((min+(max-min)*(i+0.5)/(sectionNum-1)));\n'+
//'        x.push(lastX+"-"+curX);\n'+
            '        range.push({min:lastX,max:curX});\n'+
            '        lastX=curX;\n'+
            '        count.push(0);\n'+
            '    }\n'+
            '    for(var i=0,ni=data.length;i<ni;++i){\n'+
            '        ++count[parseInt((data[i]-min)/(max-min)*(sectionNum-1))];\n'+
            '    }\n'+
            '    return {'+this.output[0].varname+':x,'+this.output[1].varname+':count,'+this.output[2].varname+':range};\n'+
            '}';
        return templateStr;
    };

    return Counter;
})();

