/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.ResourcesWindow = (function() {
    //记录所属window的数据，以方便生成对应的dom结点和视图
    var _formList = {
        scatterPlot: {
            title: 'ScatterPlot',
            painter: 'rect',
            imgUrl: 'resource/image/element/form/ScatterPlot.png'
        },
        //lineChart: {
        //    title: 'LineChart',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/LineChart.png'
        //},
        //barChart: {
        //    title: 'BarChart',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/BarChart.png'
        //},
        //stackedBarChart: {
        //    title: 'Stacked Bar Chart',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/StackedBarChart.png'
        //},
        //scatterPlotMatrix: {
        //    title: 'ScatterPlot Matrix',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/ScatterPlotMatrix%20.png'
        //},
        //treemap: {
        //    title: 'Treemap',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/Treemap.png'
        //},
        //parallelCoordinates: {
        //    title: 'Parallel Coordinates',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/ParallelCoordinates.png'
        //},
        //starPlot: {
        //    title: 'StarPlot',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/StarPlot.png'
        //},
        //pieChart: {
        //    title: 'PieChart',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/PieChart.png'
        //},
        //bubblePlot: {
        //    title: 'BubblePlot',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/BubblePlot.png'
        //},
        //matrix: {
        //    title: 'Matrix',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/Matrix.png'
        //},
        //map: {
        //    title: 'Map',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/layout/Map.png'
        //}
    };
    var _primitiveList = {
        blankview: {
            title: 'Blank View', //提示气泡显示的内容
            painter: 'rect', //交互创建的方式
            imgUrl: 'resource/image/element/primitive/frame.png' //图标url
        },
        circle: {
            title: 'Circle',
            painter: 'circle',
            imgUrl: 'resource/image/element/primitive/Circle.png'
        },
        //rectangle: {
        //    title: 'Rectangle',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Rectangle.png'
        //},
        //triangle: {
        //    title: 'Triangle',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Triangle.png'
        //},
        //polygon: {
        //    title: 'Polygon',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Polygon.png'
        //},
        //line: {
        //    title: 'Line',
        //    painter: 'line',
        //    imgUrl: 'resource/image/element/primitive/Link.png'
        //},
        //curve: {
        //    title: 'Curve',
        //    painter: 'line',
        //    imgUrl: 'resource/image/element/primitive/path_2-01.png'
        //},
        //sector: {
        //    title: 'Sector',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Sector.png'
        //},
        //text: {
        //    title: 'Text',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Tag.png'
        //},
        //custom: {
        //    title: 'Text',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/primitive/Tag.png'
        //}
    };
    var _compositionList = {
        Coordinates: {
            title: '2-d Coordinates',
            painter: 'rect',
            imgUrl: 'resource/image/element/array/Coordinates.png'
        },
        //Horizon: {
        //    title: 'Horizonal',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/array/horizon.png'
        //},
        //Vertical: {
        //    title: 'Vertical',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/array/vertical.png'
        //},
        //Grid: {
        //    title: 'Grid',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/array/grid.png'
        //},
        //Round: {
        //    title: 'Round',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/array/Layout3.png'
        //},
        //Axis_H: {
        //    title: '1-d Coordinate (horizontal)',
        //    painter: 'line',
        //    imgUrl: 'resource/image/element/array/axis.png'
        //},
        //Axis_V: {
        //    title: '1-d Coordinate (vertical)',
        //    painter: 'line',
        //    imgUrl: 'resource/image/element/array/axis_v.png'
        //},
        //PolarCoordinates: {
        //    title: 'Polar coordinates',
        //    painter: 'rect',
        //    imgUrl: 'resource/image/element/array/polarcoordinates.png'
        //}
    };
    var _dataWindow = null;

    //构造函数，初始化每个部分的根dom结点和成员变量
    var resourcesWindow = function(){
        this.dom = $("#resources");
        this.listener();
        this.formDom = $("body > #resources > .content > #form");
        this.primitiveDom = $("body > #resources > .content > #primitive");
        this.compositionDom = $("body > #resources > .content > #array");
        this.append(this.formDom, this.formList);
        this.append(this.primitiveDom, this.primitiveList);
        this.append(this.compositionDom, this.compositionList);
        this.dataWindow = new viscomposer.ui.DataWindow();
    };

    var prototype = resourcesWindow.prototype;

    Object.defineProperties(prototype, {
        formList: {
            get:function(){return _formList;},
            set:function(x){_formList=x;},
        },//模板列表
        primitiveList: {
            get:function(){return _primitiveList;},
            set:function(x){_primitiveList=x;},
        },//图元列表
        compositionList: {
            get:function(){return _compositionList;},
            set:function(x){_compositionList=x;},
        },//图元列表
        dataWindow: {
            get:function(){return _dataWindow;},
            set:function(x){_dataWindow=x;},
        }//图元列表
    });

    prototype.update = function(){
        //this.append(this.formDom, this.formList);
        //this.append(this.primitiveDom, this.primitiveList);
        //this.append(this.compositionDom, this.compositionList);
    };

    prototype.listener = function(){
        var that = this;
        that.dom.on("dragstart", "td > img", function(ev){
            return viscomposer.app.uiManager.resourcesDragstart(ev);
        });
        that.dom.on("click", "td > img", function(ev){
            that.dom.find("td > img").removeClass('clicked');
            $(this).parents("td").addClass("clicked");
            return viscomposer.app.uiManager.resourcesClick(ev);
        });
    };

    prototype.append = function(dom, list){
        var tableDom = $(dom).children(".content").children("table");
        tableDom.html('');
        var num = 0;
        var htmlStr = '';
        for(var key in list)
        {
            var item = list[key];
            if(num % 2 == 0)
            {
                htmlStr += '<tr>';
            }
            htmlStr += '<td><img draggable="true" src="' + item.imgUrl + '" title="'
                + item.title + '" type="' + key + '" painter="' + item.painter + '"></td>';
            if(num % 2 == 1)
            {
                htmlStr += '</tr>';
            }
            num++;
        }
        if(num % 2 != 0){
            htmlStr += '<td></td></tr>';
        }//不满偶数个的补一个空格
        tableDom.html(htmlStr);
    };

    return resourcesWindow;

})();