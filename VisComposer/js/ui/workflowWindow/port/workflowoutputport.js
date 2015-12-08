/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.workflowOutputPort = function(parentDom, port){

    viscomposer.ui.workflowWindow.port.call(this,parentDom, port);

    this.elSelector = ".port#" + this.uuid;

    this.update();

};

viscomposer.ui.workflowWindow.workflowOutputPort.prototype=Object.create(viscomposer.ui.workflowWindow.port.prototype);
viscomposer.ui.workflowWindow.workflowOutputPort.prototype.constructor=viscomposer.ui.workflowWindow.workflowOutputPort;

viscomposer.ui.workflowWindow.workflowOutputPort.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {
        var temp, label = that.port.label;
        if(label.length > 8)
        {
            temp = label.substr(0, 5) + '..';
        }else
        {
            temp = label;
        }
        $(that.parentDom).append(
            '<div class="port" id="' + that.uuid +  '">' +
                '<div class="circle"></div>' +
                '<span class="label" title="' + label + '">' + temp + '</span></div>'
        );

        that.onMouseup();
        that.renameListener();
        that.onMouseDown();

    }
    else
    {



    }

};

viscomposer.ui.workflowWindow.workflowOutputPort.prototype.onMouseup = function(){

    var that = this;

    $(that.elSelector).mouseup(function (ev) {

        ev.stopPropagation();

        var start;
        if (start=viscomposer.app.connector.start) {

            viscomposer.app.connector.end = that.port;

            var workflow=start.module.workflow;
            workflow.addLink(start,that.port);
            workflow.ui.update();




        }

        viscomposer.app.connector.start = null;
        viscomposer.app.connector.end = null;
        viscomposer.app.connector.flag = false;
        $("#connect-temp").remove();

    });

};