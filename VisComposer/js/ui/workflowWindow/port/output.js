/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.workflowWindow.output = function(parentDom, port){

    viscomposer.ui.workflowWindow.port.call(this,parentDom,port);

    this.elSelector = ".output#" + this.uuid;

    this.update();

};

viscomposer.ui.workflowWindow.output.prototype=Object.create(viscomposer.ui.workflowWindow.port.prototype);
viscomposer.ui.workflowWindow.output.prototype.constructor=viscomposer.ui.workflowWindow.output;

viscomposer.ui.workflowWindow.output.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {
        var temp, label = that.port.label;
        if(label)
        {
            if(label.length > 8)
            {
                temp = label.substr(0, 5) + '..';
            }else
            {
                temp = label;
            }
        }
        else
        {
            temp = that.port;
        }

        $(that.parentDom).append(
            '<div class="output" id="' + that.uuid + '">' +
            '<span class="label" title="' + label + '">' + temp + '</span>' +
            '<div class="circle"></div>' +
            '</div>'
        );

        that.onMousedown();
        that.renameListener();
        that.onMouseDown();

    }
    else
    {



    }

};

viscomposer.ui.workflowWindow.output.prototype.onMousedown = function() {

    var that = this;

    $(that.elSelector).mousedown(function () {

        viscomposer.app.connector.flag = that.port.module.ui.productive;
        viscomposer.app.connector.start = that.port;
        viscomposer.app.connector.end = null;

        $('.workflowWindow-sub#' + that.port.module.workflow.ui.uuid).mousemove(function (ev) {

            //画临时线

            that.port.module.workflow.ui.drawTempLink();

        });

    });

};