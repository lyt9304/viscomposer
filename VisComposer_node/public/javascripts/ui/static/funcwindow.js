/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.FuncWindow = (function() {

    var modelswindow = function(){
        this.modelList = {
            Filter: {
                title: 'Filter',
                imgUrl: '/images/element/module/Filter.png'
            },
            Sort: {
                title: 'Sort',
                imgUrl: '/images/element/module/Sort.png'
            },
        };
        this.dom = null;
        this.uiInit();
        this.listener();
    };

    var prototype = modelswindow.prototype;

    prototype.uiInit = function(){
        var modelList = this.modelList;
        this.dom = $("#workflowWindow > #modules")[0];
        var wrapDom = $(this.dom).find('.wrap');
        for(var key in modelList){
            var model = modelList[key];
            $(wrapDom).append('<div><img src="' + model.imgUrl + '" draggable="true" title="' + model.title + '" type="' + model.title + '"></div>');
        }
    };

    prototype.listener = function(){

    };

    return modelswindow;

})();