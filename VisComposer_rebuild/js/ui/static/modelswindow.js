/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.modelswindow = (function() {
    var _modelList = {};

    var modelswindow = function(){
        this.dom = $("#resources");
    };

    var prototype = modelswindow.prototype;

    Object.defineProperties(prototype, {
        modelList: {
            get:function(){return _modelList;},
            set:function(x){_modelList=x;},
        },//模板列表
    });

    prototype.init = function(){
        this.modelList = viscomposer.util.ModelList;
        this.appendResources();
    };

    prototype.update = function(){

    };

    prototype.appendResources = function(){
        var modelList = this.modelList;
        var dom = this.dom;
    };

    return modelswindow;

})();