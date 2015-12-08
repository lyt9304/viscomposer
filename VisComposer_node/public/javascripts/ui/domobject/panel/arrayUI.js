/**
 * Created by huwanqi on 15-8-28.
 */
viscomposer.ui.ArrayUI = (function(){
    var arrayUI = viscomposer.VObject.define("ArrayUI", "ModuleUI", function(module, workflow){
        viscomposer.ui.ModuleUI.call(this, module, workflow);
        this.pos = [400, 200];
    });

    var prototype = arrayUI.prototype;

    prototype.uiInit = function(){
        viscomposer.ui.ModuleUI.prototype.uiInit.call(this);
        console.log('module-array:ui initializing');

    };

    prototype.listener = function(){
        viscomposer.ui.ModuleUI.prototype.listener.call(this);
        console.log('module-array: listener');
    };

    prototype.update = function(){
        viscomposer.ui.ModuleUI.prototype.update.call(this);
        console.log("module-array:updating");

    };

    return arrayUI;
})();