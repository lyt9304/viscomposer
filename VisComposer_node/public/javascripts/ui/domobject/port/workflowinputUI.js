/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.WorkflowInputUI = (function(){
    var workflowInputUI = viscomposer.VObject.define("WorkflowInputUI", "PortUI", function(port){
            viscomposer.ui.PortUI.call(this, port);
            this.uiInit();
            this.listener();
            this.update();
        }
    );

    var prototype = workflowInputUI.prototype;

    prototype.uiInit = function(){
        var port = this.port;
        var container = port.workflow.ui.inputsDom;
        var importedClass = '';
        if(port.imported){
            importedClass = ' imported'
        }
        var dom = this.dom = $.parseHTML(
            '<div class="item' + importedClass + '" id="' + this.uuid + '">' +
            '<div class="label" title="' + port.label + '">' + (port.label.substr(0, 10) + '...') + '</div>' +
            '<div class="circle"></div>' +
            '</div>');
        $(dom).appendTo($(container));
    };

    prototype.listener = function(){
        var dom = this.dom;
        var that = this;
        $(dom).on("mousedown", ".circle", function(){
            viscomposer.app.uiManager.connector = {
                start: that.port,
                end: null,
                flag: true
            };
            var workflowUI = that.port.workflow.ui;
            workflowUI.drawTempLine();
        });
    };

    prototype.update = function(){

    };

    return workflowInputUI;
})();


