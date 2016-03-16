/**
 * @fileoverview The base all  class in project avis.
 */

/**
 * A namesapce for all  the avis classes.
 */
var viscomposer = viscomposer || {};

self.console = self.console || {

    info: function () {},
    log: function () {},
    debug: function () {},
    warn: function () {},
    error: function () {}

};

/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
viscomposer.global = this;

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

/**
 * Makes one class inherit from another.  Adds the member variables superClass
 * and superClassName to the prototype of the sub class.
 * @param {string} subClassName Class that wants to inherit.
 * @param {string} superClassName Class to inherit from.
 */
//avis.inherit = function(subClassName, superClassName) {
    // var superClass = avis.global.avis[superClassName];
    // var subClass = avis.global.avis[subClassName];

    // if (!superClass)
    //     throw ('Invalid superclass: ' + superClassName);
    // if (!subClass)
    //     throw ('Invalid subclass: ' + subClassName);

    // subClass.prototype = new superClass;
    // subClass.prototype.superClassName = superClassName;
    // subClass.prototype.superClass = superClass;
    // subClass.prototype.className = subClassName;
//};

/**
 * Includes the file indicated by the rule by adding a script tag.
 * @param {string} file File to include, in the form avis.package.part.
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

// First find the base path of the script directory.
viscomposer.findBasePath();

viscomposer.namespace('util');
viscomposer.namespace('app');
viscomposer.namespace('ui');
viscomposer.namespace('data');
viscomposer.namespace('workflow');
viscomposer.namespace('scenegraph');



viscomposer.include('core/functions.js');
viscomposer.include('core/object.js');
viscomposer.include('core/attribute.js');
viscomposer.include('core/datainfo.js');
viscomposer.include('core/environment.js');

viscomposer.include('data/data.js');
viscomposer.include('data/objectdata.js');
viscomposer.include('data/arraydata.js');
viscomposer.include('data/objectarraydata.js');
viscomposer.include('data/datafactory.js');

viscomposer.include('ui/ui.js');
viscomposer.include('ui/windows.js');
viscomposer.include('ui/datawindow/datawindow.js');
viscomposer.include('ui/datawindow/data.js');
viscomposer.include('ui/workflowWindow/workflowWindow.js');
viscomposer.include('ui/workflowWindow/panel/panel.js');
viscomposer.include('ui/workflowWindow/panel/data.js');
viscomposer.include('ui/workflowWindow/panel/circle.js');
viscomposer.include('ui/workflowWindow/panel/rect.js');
viscomposer.include('ui/workflowWindow/panel/text.js');
viscomposer.include('ui/workflowWindow/panel/polyline.js');
viscomposer.include('ui/workflowWindow/panel/scatterplot.js');
viscomposer.include('ui/workflowWindow/panel/barchart.js');
viscomposer.include('ui/workflowWindow/panel/crossmatrix.js');
viscomposer.include('ui/workflowWindow/panel/verticalarray.js');
viscomposer.include('ui/workflowWindow/panel/parallelcoordinates.js');
viscomposer.include('ui/workflowWindow/panel/view.js');
viscomposer.include('ui/workflowWindow/panel/filter.js');
viscomposer.include('ui/workflowWindow/panel/sort.js');
viscomposer.include('ui/workflowWindow/panel/counter.js');
viscomposer.include('ui/workflowWindow/panel/colschooser.js');
viscomposer.include('ui/workflowWindow/panel/layout.js');
viscomposer.include('ui/workflowWindow/panel/selcol.js');
viscomposer.include('ui/workflowWindow/panel/scale.js');
viscomposer.include('ui/workflowWindow/panel/modifier.js');
viscomposer.include('ui/workflowWindow/panel/modifier/categorical.js');
viscomposer.include('ui/workflowWindow/panel/modifier/direct.js');
viscomposer.include('ui/workflowWindow/panel/modifier/scale.js');
viscomposer.include('ui/workflowWindow/panel/modifier/value.js');
viscomposer.include('ui/workflowWindow/panel/custom.js');
viscomposer.include('ui/workflowWindow/workflowoutput.js');
viscomposer.include('ui/workflowWindow/port/port.js');
viscomposer.include('ui/workflowWindow/port/input.js');
viscomposer.include('ui/workflowWindow/port/selcolinput.js');
viscomposer.include('ui/workflowWindow/port/output.js');
viscomposer.include('ui/workflowWindow/port/workflowinput.js');
viscomposer.include('ui/workflowWindow/port/workflowoutputport.js');
viscomposer.include('ui/workflowWindow/link/link.js');
viscomposer.include('ui/scenegraphwindow/scenegraphwindow.js');
viscomposer.include('ui/scenegraphwindow/node.js');

viscomposer.include('util/commonfunction.js');
viscomposer.include('util/bitset.js');
viscomposer.include('util/hashmap.js');
viscomposer.include('util/data.js');

viscomposer.include('workflow/module.js');
viscomposer.include('workflow/port.js');
viscomposer.include('workflow/link.js');
viscomposer.include('workflow/workflowheader.js');
viscomposer.include('workflow/workflow.js');
viscomposer.include('workflow/modifier.js');
viscomposer.include('workflow/module/datamodule.js');
viscomposer.include('workflow/module/filter.js');
viscomposer.include('workflow/module/sort.js');
viscomposer.include('workflow/module/counter.js');
viscomposer.include('workflow/module/colselector.js');
viscomposer.include('workflow/module/colschooser.js');
viscomposer.include('workflow/module/custommodule.js');
viscomposer.include('workflow/module/modifiermodule.js');
viscomposer.include('workflow/layout/scatterplot.js');
viscomposer.include('workflow/layout/barchart.js');
viscomposer.include('workflow/layout/stackedbarchart.js');
viscomposer.include('workflow/layout/parallelcoordinates.js');
viscomposer.include('workflow/layout/crossmatrix.js');
viscomposer.include('workflow/layout/verticalarray.js');
viscomposer.include('workflow/primitive/indicator.js');
viscomposer.include('workflow/primitive/circle.js');
viscomposer.include('workflow/primitive/rect.js');
viscomposer.include('workflow/primitive/path.js');
viscomposer.include('workflow/primitive/text.js');
viscomposer.include('workflow/primitive/line.js');
viscomposer.include('workflow/primitive/polyline.js');
viscomposer.include('workflow/primitive/view.js');
viscomposer.include('workflow/modifier/direct.js');
viscomposer.include('workflow/modifier/scale.js');
viscomposer.include('workflow/modifier/categorical.js');

viscomposer.include('scenegraph/node.js');
viscomposer.include('scenegraph/scenegraph.js');

//viscomposer.include('vendor/tablecloth/tablecloth.js');

viscomposer.include('app/app.js');
