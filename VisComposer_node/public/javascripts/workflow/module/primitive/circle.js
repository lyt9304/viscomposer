/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.Circle = (function(){

    var circle = viscomposer.VObject.define("Circle","Module",function(){
        viscomposer.workflow.Module.call(this);
        this.setting = {
            label: 'Circle',
            category: "primitive",
            type: "circle",
            inputs: [{
                label: 'x',
                type: 'map'
            }, {
                label: 'y',
                type: 'map'
            }, {
                label: 'r',
                type: 'map'
            }],
            outputs: [],
            envOutputs: [{
                label: 'transform',
                type: 'transform'
            }],
            properties: {}
        };
        this.init();
    });

    var prototype = circle.prototype;

    prototype.init = function(){
        viscomposer.workflow.Module.prototype.init.call(this);
        //TODO
    };

    prototype.update = function(){
        viscomposer.workflow.Module.prototype.update.call(this);
        //TODO
    };


    return circle;
})();