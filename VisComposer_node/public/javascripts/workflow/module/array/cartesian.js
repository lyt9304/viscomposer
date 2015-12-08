/**
 * Created by huwanqi on 15-9-9.
 */
viscomposer.workflow.Cartesian = (function(){

    var cartesian = viscomposer.VObject.define("Cartesian","Module",function(){
        viscomposer.workflow.Module.call(this);
        this.setting = {
            label: 'Cartesian',
            category: "array",
            type: "cartesian",
            inputs: [{
                "label":"dataX",
                "type":"input"
            },{
                "label":"dataY",
                "type":"input"
            }],
            outputs: [],
            envOutputs: [{
                "label":"x_axis",
                "type":"geometry"
            },{
                "label":"y_axis",
                "type":"geometry"
            },{
                "label":"scaleX",
                "type":"scale"
            },{
                "label":"scaleY",
                "type":"scale"
            },{
                "label":"array",
                "type":"array"
            }],
            properties: {
                scaleX: null,
                scaleY: null
            }
        };
        this.init();
    });

    var prototype = cartesian.prototype;

    prototype.init = function(){
        viscomposer.workflow.Module.prototype.init.call(this);
        this.properties.scaleX = null;
        this.properties.scaleY = null;
        //TODO init scaleX and scaleY
        this.arrayIcon = "/images/element/array/Coordinates.png";
        this.arrayLabels = [
            ['number','number of data points','array().num'],
            ['x','position - x coordnate','array().x'],
            ['y','position - y coordnate','array().y']
        ];
        this.arrayDescription = "Cartesian coordinates";
    };


    prototype.update = function(){
        viscomposer.workflow.Module.prototype.update.call(this);
        //this.properties.scaleX.update();
        //this.properties.scaleY.update();
    };

    return cartesian;
})();