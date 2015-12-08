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
viscomposer.basePath = '/javascripts/';

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
        var s = 'viscomposer.js';
        var sl = s.length;
        if (src.substr(l - sl) == s) {
            viscomposer.basePath = src.substr(0, l - sl) + '';
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
viscomposer.namespace('registry');

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
viscomposer.include('workflow/module/func/data.js');
//module-->primitive
viscomposer.include('workflow/module/primitive/view.js');
viscomposer.include('workflow/module/primitive/circle.js');
//module-->array
viscomposer.include('workflow/module/array/cartesian.js');

viscomposer.include('workflow/workflowHeader.js');
viscomposer.include('workflow/workflow.js');
viscomposer.include('workflow/port.js');
viscomposer.include('workflow/link.js');

//[scenegraph]
viscomposer.include('scenegraph/node.js');
viscomposer.include('scenegraph/scenegraph.js');

//[ui]
//window
viscomposer.include('ui/static/resourceswindow.js');
viscomposer.include('ui/static/datawindow.js');
viscomposer.include('ui/static/workflowwindow.js');
viscomposer.include('ui/static/funcwindow.js');
viscomposer.include('ui/static/scenegraphwindow.js');
viscomposer.include('ui/static/canvaswindow.js');
//domobject
viscomposer.include('ui/domobject/domobject.js');
viscomposer.include('ui/domobject/dataitemUI.js');
viscomposer.include('ui/domobject/scenegraphUI.js');
viscomposer.include('ui/domobject/nodeUI.js');
viscomposer.include('ui/domobject/workflowUI.js');
viscomposer.include('ui/domobject/linkUI.js');
viscomposer.include('ui/domobject/panel/moduleUI.js');
//module:func
viscomposer.include('ui/domobject/panel/funcUI.js');
viscomposer.include('ui/domobject/panel/func/dataUI.js');
viscomposer.include('ui/domobject/panel/func/filterUI.js');
viscomposer.include('ui/domobject/panel/func/sortUI.js');
//module:array
viscomposer.include('ui/domobject/panel/arrayUI.js');
viscomposer.include('ui/domobject/panel/array/cartesianUI.js');
//module:primitive
viscomposer.include('ui/domobject/panel/primitiveUI.js');
viscomposer.include('ui/domobject/panel/primitive/circleUI.js');
viscomposer.include('ui/domobject/panel/primitive/viewUI.js');
//module:modifier
viscomposer.include('ui/domobject/panel/modifierUI.js');
viscomposer.include('ui/domobject/panel/modifier/categoricalUI.js');
viscomposer.include('ui/domobject/panel/modifier/scaleUI.js');
viscomposer.include('ui/domobject/panel/modifier/directUI.js');
viscomposer.include('ui/domobject/panel/modifier/valueUI.js');
//port
viscomposer.include('ui/domobject/port/portUI.js');
viscomposer.include('ui/domobject/port/inputUI.js');
viscomposer.include('ui/domobject/port/outputUI.js');
viscomposer.include('ui/domobject/port/workflowinputUI.js');

viscomposer.include('ui/manager.js');

viscomposer.include('registry.js');

viscomposer.app.uiManager = null;//ui全局管理器

//程序起点
$(document).ready(function(){
    //创建初始化uiManager
    var uiManager = viscomposer.app.uiManager = new viscomposer.ui.Manager();
    //创建Scenegraph对象
    var scenegraph = viscomposer.app.scenegraph = new viscomposer.scenegraph.Scenegraph();
    uiManager.loadScenegraph(scenegraph);
});