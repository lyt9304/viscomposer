/**
 * @fileoverview The base all  class in project avis.
 */
var viscomposer = viscomposer || {};

self.console = self.console||{
    info:function(){},
    log:function(){},
    debug:function(){},
    warn:function(){},
    error:function(){},
};

/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
viscomposer.global = this;

/**
 * Includes the file indicated by the rule by adding a script tag.
 * @param {string} file File to include, in the layout avis.package.part.
 */
viscomposer.include = function(file) {
    viscomposer.writeScriptTag_(viscomposer.basePath + file);
};

/**
 * Writes a script tag for the given o3d source file name
 * to the document.  (Must be called at execution time.)
 * @param {string} src The full path to the source file.
 * @private
 */
viscomposer.writeScriptTag_ = function(src) {
    var doc = viscomposer.global.document;
    if (typeof doc != 'undefined') {
        doc.write('<script type="text/javascript" src="' +
            src + '"></' + 'script>');
    }
};

/**
 * Root path for included scripts.
 * @type {string}
 */
viscomposer.basePath = '';

/**
 * Tries to detect the base path of the Weather3D.js script that
 * bootstraps the avis libraries.
 */
viscomposer.findBasePath = function() {
    var doc = viscomposer.global.document;
    if (typeof doc == 'undefined') {
        return;
    }
    if (viscomposer.global.BASE_PATH) {
        viscomposer.basePath = viscomposer.global.BASE_PATH;
        return;
    } else {
        // HACK to hide compiler warnings :(
        viscomposer.global.BASE_PATH = null;
    }
    var scripts = doc.getElementsByTagName('script');
    for (var script, i = 0; script = scripts[i]; i++) {
        var src = script.src;
        var l = src.length;
        var s = 'js/viscomposer.js';
        var sl = s.length;
        if (src.substr(l - sl) == s) {
            viscomposer.basePath = src.substr(0, l - sl) + 'js/';
            return;
        }
    }
};

/**
 * Define a namespace.
 * @param {string} name Name of the namespace to define.
 */
viscomposer.namespace = function(name) {
    var parts = name.split('.');
    var current = viscomposer;
    for (var i in parts) {
        if (!current[parts[i]]) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
};

// First find the base path of the script directory.
viscomposer.findBasePath();

// 添加namespace
viscomposer.namespace('app');
viscomposer.namespace('util');
viscomposer.namespace('data');
viscomposer.namespace('scenegraph');
viscomposer.namespace('workflow');
viscomposer.namespace('ui');

// 添加include

//[util]
viscomposer.include('util/commonfunction.js');
viscomposer.include('util/hashmap.js');

//[core]
viscomposer.include('core/vobject.js');
viscomposer.include('core/environment.js');

//data
viscomposer.include('data/datainfo.js');
viscomposer.include('data/attribute.js');
viscomposer.include('data/data.js');
viscomposer.include('data/arraydata.js');
viscomposer.include('data/objectarraydata.js');
viscomposer.include('data/objectdata.js');
viscomposer.include('data/datafactory.js');

//[workflow]
//module
viscomposer.include('workflow/module/module.js');
//module-->func
viscomposer.include('workflow/module/func/datamodule.js');
viscomposer.include('workflow/module/func/filter.js');
//module-->primitive
viscomposer.include('workflow/module/primitive/view.js');
viscomposer.include('workflow/module/primitive/indicator.js');


viscomposer.include('workflow/workflowHeader.js');
viscomposer.include('workflow/workflow.js');
viscomposer.include('workflow/port.js');
viscomposer.include('workflow/link.js');

//[scenegraph]
viscomposer.include('scenegraph/node.js');
viscomposer.include('scenegraph/scenegraph.js');

//[ui]
//domobject
viscomposer.include('ui/domobject/domobject.js');
viscomposer.include('ui/domobject/datawindowitem.js');
viscomposer.include('ui/domobject/node.js');
viscomposer.include('ui/domobject/link.js');
viscomposer.include('ui/domobject/canvaswindow.js');
viscomposer.include('ui/domobject/workflow.js');
viscomposer.include('ui/domobject/workflowwindow.js');

//domobject-->port
viscomposer.include('ui/domobject/port/port.js');
viscomposer.include('ui/domobject/port/input.js');
viscomposer.include('ui/domobject/port/output.js');
viscomposer.include('ui/domobject/port/workflowinputport.js');
viscomposer.include('ui/domobject/port/workflowoutputport.js');

//domobject-->panel
viscomposer.include('ui/domobject/panel/moduleui.js');
viscomposer.include('ui/domobject/panel/modifierpanel.js');
viscomposer.include('ui/domobject/panel/primitivepanel.js');
//domobject-->panel-->func
viscomposer.include('ui/domobject/panel/func/datapanel.js');
viscomposer.include('ui/domobject/panel/func/colchooserpanel.js');
viscomposer.include('ui/domobject/panel/func/counterpanel.js');
viscomposer.include('ui/domobject/panel/func/filterpanel.js');
viscomposer.include('ui/domobject/panel/func/selcolpanel.js');
viscomposer.include('ui/domobject/panel/func/sortpanel.js');
viscomposer.include('ui/domobject/panel/func/custompanel.js');
//domobject-->panel-->layout
viscomposer.include('ui/domobject/panel/layout/barchart.js');
viscomposer.include('ui/domobject/panel/layout/crossmatrix.js');
viscomposer.include('ui/domobject/panel/layout/parallelcoordinates.js');
viscomposer.include('ui/domobject/panel/layout/scatterplot.js');
viscomposer.include('ui/domobject/panel/layout/verticalarray.js');
//domobject-->panel-->modifier
viscomposer.include('ui/domobject/panel/modifier/direct.js');
viscomposer.include('ui/domobject/panel/modifier/scale.js');
viscomposer.include('ui/domobject/panel/modifier/value.js');
viscomposer.include('ui/domobject/panel/modifier/categorical.js');

viscomposer.include('ui/static/datawindow.js');
viscomposer.include('ui/static/resourceswindow.js');
viscomposer.include('ui/static/modelswindow.js');
viscomposer.include('ui/static/scenegraphwindow.js');

viscomposer.include('ui/manager.js');

//全局变量
viscomposer.app.imgPool = {
    //form
    scatterplot: 'resource/image/element/layout/ScatterPlot.png',
    linechart: 'resource/image/element/layout/LineChart.png',
    crossmatrix: 'resource/image/element/layout/ScatterPlotMatrix.png',
    matrix: 'resource/image/element/layout/Matrix.png',
    barchart: 'resource/image/element/layout/Barchart.png',
    treemap: 'resource/image/element/layout/Treemap.png',
    scatterplotmatrix: 'resource/image/element/layout/ScatterPlotMatrix.png',
    parallelcoordinates: 'resource/image/element/layout/ParallelCoordinates.png',
    //primitive
    circle: 'resource/image/element/primitive/Circle.png',
    rectangle: 'resource/image/element/primitive/Rectangle.png',
    line: 'resource/image/element/primitive/Link.png',
    sector: 'resource/image/element/primitive/Sector.png',
    text: 'resource/image/element/primitive/Tag.png',
    polyline: 'resource/image/element/primitive/Polyline.png',
    view: 'resource/image/element/primitive/frame.png',
    //layout
};
viscomposer.app.uiManager = null;//ui全局管理器
viscomposer.app.scenegraph = null;//场景图对象
viscomposer.app.primitiveRegistry = null;//图元注册表


//程序起点
$(document).ready(function(){
    //创建初始化uiManager
    viscomposer.app.uiManager = new viscomposer.ui.Manager();
    viscomposer.app.scenegraph = new viscomposer.scenegraph.Scenegraph();
    viscomposer.app.primitiveRegistry = {
        'blankview': viscomposer.scenegraph.Node
    };
});