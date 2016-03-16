/**
 * Created by huwanqi on 15/2/22.
 */

viscomposer.app = viscomposer.app || {};

//导入的数据列表
viscomposer.app.datalist = {};
viscomposer.app.dragging = {};
viscomposer.app.draggingVar = null;
viscomposer.app.toRemove = null;
viscomposer.app.mouseX = null;
viscomposer.app.mouseY = null;
viscomposer.app.selectedNode = null;
viscomposer.app.drawing = null;
//viscomposer.app.scenegraph = null;

viscomposer.app.ui = null;

viscomposer.app.connector = {
    start: null,
    end: null,
    flag: false //判断是否从workflow数据中拉出的线
};

viscomposer.app.tryRender=function(){
    var tryRender=function(simplify){
        if(!viscomposer.app.tryRender.enabled){return;}
        viscomposer.app.disableRender();
        try{
            viscomposer.app.scenegraph.run(simplify);
            viscomposer.app.scenegraph.run(simplify);
        }catch(e){
            console.log(e.stack.split('\n').slice(0,2).join('\n'));
        }
        viscomposer.app.scenegraph.ui.update();
        viscomposer.app.enableRender();
    }

    tryRender.enabled=true;

    return tryRender;
}();

viscomposer.app.enableRender=function(){
    viscomposer.app.tryRender.enabled=true;
};
viscomposer.app.disableRender=function(){
    viscomposer.app.tryRender.enabled=false;
};

$(document).ready(function(){

    viscomposer.app.ui = new viscomposer.ui();

});

viscomposer.app.imgPool = {

    scatterplot: 'resource/image/element/form/ScatterPlot.png',
    linechart: 'resource/image/element/form/LineChart.png',
    crossmatrix: 'resource/image/element/form/ScatterPlotMatrix.png',
    matrix: 'resource/image/element/form/Matrix.png',
    barchart: 'resource/image/element/form/Barchart.png',
    treemap: 'resource/image/element/form/Treemap.png',
    scatterplotmatrix: 'resource/image/element/form/ScatterPlotMatrix.png',
    parallelcoordinates: 'resource/image/element/form/ParallelCoordinates.png',

    circle: 'resource/image/element/primitive/Circle.png',
    rectangle: 'resource/image/element/primitive/Rectangle.png',
    line: 'resource/image/element/primitive/Link.png',
    sector: 'resource/image/element/primitive/Sector.png',
    text: 'resource/image/element/primitive/Tag.png',
    polyline: 'resource/image/element/primitive/Polyline.png',
    blankview: 'resource/image/element/primitive/frame.png',

};

viscomposer.app.primitiveRegistry = {

    'circle': viscomposer.workflow.Circle,
    'rectangle': viscomposer.workflow.Rect,
    'line': viscomposer.workflow.Line,
    'path': viscomposer.workflow.Path,
    'polyline': viscomposer.workflow.Polyline,
    'text': viscomposer.workflow.Text,
    'blankview': viscomposer.workflow.View,
};

viscomposer.app.layoutRegistry = {

    'gridarray': viscomposer.workflow.CrossMatrix,
    'coordinates': viscomposer.workflow.Scatterplot,
    'verticalarray': viscomposer.workflow.VerticalArray,
    'stackedbarchart': viscomposer.workflow.StackedBarChart,
};

viscomposer.app.moduleRegistry = {

    data: viscomposer.workflow.DataModule,

    circle: viscomposer.workflow.Circle,
    rectangle: viscomposer.workflow.Rect,
    text: viscomposer.workflow.Text,
    polyline: viscomposer.workflow.Polyline,

    scatterplot: viscomposer.workflow.Scatterplot,
    barchart: viscomposer.workflow.BarChart,
    crossmatrix: viscomposer.workflow.CrossMatrix,
    verticalarray: viscomposer.workflow.VerticalArray,
    parallelcoordinates: viscomposer.workflow.ParallelCoordinates,
    view: viscomposer.workflow.Circle,

    custom: viscomposer.workflow.CustomModule,
    selcol: viscomposer.workflow.ColSelector,
    filter: viscomposer.workflow.Filter,
    sort: viscomposer.workflow.Sort,
    counter: viscomposer.workflow.Counter,
    colschooser: viscomposer.workflow.ColChooser,

    direct: viscomposer.workflow.DirectModifier,
    categorical: viscomposer.workflow.CategoricalModifier,
    scale: viscomposer.workflow.ScaleModifier,
//    value: viscomposer.workflow.ValueModifier,

};

viscomposer.app.Factory = {

    createPanel: function(module, window) {

        if(module instanceof viscomposer.workflow.DataModule)
        {
            return new viscomposer.ui.workflowWindow.dataPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Filter)
        {
            return new viscomposer.ui.workflowWindow.filterpanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Sort)
        {
            return new viscomposer.ui.workflowWindow.sortPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Counter)
        {
            return new viscomposer.ui.workflowWindow.counterPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.ColChooser)
        {
            return new viscomposer.ui.workflowWindow.colschooserPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.CustomModule)
        {
            return new viscomposer.ui.workflowWindow.customPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.ColSelector)
        {
            return new viscomposer.ui.workflowWindow.selcolPanel(module, window);
        }


        else if(module instanceof viscomposer.workflow.Circle)
        {
            return new viscomposer.ui.workflowWindow.circlePanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Rect)
        {
            return new viscomposer.ui.workflowWindow.rectPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Text)
        {
            return new viscomposer.ui.workflowWindow.textPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.Polyline)
        {
            return new viscomposer.ui.workflowWindow.polylinePanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.View)
        {
            return new viscomposer.ui.workflowWindow.viewPanel(module, window);
        }


        else if(module instanceof viscomposer.workflow.Scatterplot)
        {
            return new viscomposer.ui.workflowWindow.scatterplotPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.BarChart)
        {
            return new viscomposer.ui.workflowWindow.barchartPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.CrossMatrix)
        {
            return new viscomposer.ui.workflowWindow.crossmatrixPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.VerticalArray)
        {
            return new viscomposer.ui.workflowWindow.verticalarrayPanel(module, window);
        }


        else if(module instanceof viscomposer.workflow.ParallelCoordinates)
        {
            return new viscomposer.ui.workflowWindow.parallelcoordinatesPanel(module, window);
        }


        else if(module instanceof viscomposer.workflow.ModifierModule)
        {
            return new viscomposer.ui.workflowWindow.modifierPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.CategoricalModifier)
        {
            return new viscomposer.ui.workflowWindow.categoricalModifierPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.DirectModifier)
        {
            return new viscomposer.ui.workflowWindow.directModifierPanel(module, window);
        }
        else if(module instanceof viscomposer.workflow.ScaleModifier)
        {
            return new viscomposer.ui.workflowWindow.scaleModifierPanel(module, window);
        }

        else
        {
            return new viscomposer.ui.workflowWindow.viewPanel(module, window);
            console.warn("huwanqi null here");
            console.warn(module);
            return null;
        }

    }

};
