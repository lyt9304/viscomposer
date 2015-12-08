/**
 * @fileoverview workflow数据模块类
 */

viscomposer.workflow.Data = (function(dataInfo){

    var data = viscomposer.VObject.define("Data","Module",function(){
        viscomposer.workflow.Module.call(this);
        this.setting = {
            label: 'Data',
            category: "func",
            type: "data",
            inputs: [{
                label: 'data',
                type: 'input'
            }],
            outputs: [],
            envOutputs: [],
            properties: {}
        };
        this.init();
    });

    var prototype = data.prototype;

    prototype.init = function(){
        viscomposer.workflow.Module.prototype.init.call(this);
        console.log(dataInfo);
    };

    prototype.update = function(){
        viscomposer.workflow.Module.prototype.update.call(this);
        //TODO
    };

    prototype.loadData = function(dataInfo){
        console.log(dataInfo);
        console.log(this.inputs[0]);
    };

    return data;
})();
