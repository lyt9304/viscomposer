/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.workflow.View = (function(){

    var view = viscomposer.VObject.define("View","Module",function(){
        viscomposer.workflow.Module.call(this);
        this.setting = {
            label: 'view',
            category: "primitive",
            type: "view",
            inputs: [{
                label: 'x',
                type: 'map'
            }, {
                label: 'y',
                type: 'map'
            }, {
                label: 'width',
                type: 'map'
            }, {
                label: 'height',
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

    var prototype = view.prototype;

    prototype.init = function(){
        viscomposer.workflow.Module.prototype.init.call(this);
        //TODO
    };

    prototype.update = function(){
        viscomposer.workflow.Module.prototype.update.call(this);
        //TODO
    };

    return view;
})();