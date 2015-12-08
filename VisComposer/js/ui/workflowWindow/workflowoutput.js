/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.workflowWindow.workflowOutput = function(parentDom,workflowTo){

    viscomposer.Object.call(this);

    this.parentDom = parentDom;
    this.workflow=workflowTo;
    this.workflow.externalPortsUI=this;

    this.elSelector = ".workflowWindow-sub-outputs-item#" + this.uuid;

    this.update();
    //console.log("workflow output updating");

};

viscomposer.ui.workflowWindow.workflowOutput.prototype=Object.create(viscomposer.Object);
viscomposer.ui.workflowWindow.workflowOutput.prototype.constructor=viscomposer.ui.workflowWindow.workflowOutput;

viscomposer.ui.workflowWindow.workflowOutput.prototype.update = function(){

    var that = this;

    if($(that.elSelector).length == 0)
    {

//        $(that.parentDom).append(
//            '<div class="workflowWindow-sub-outputs-item" id="' + that.uuid + '">' +
//            '<div class="label"><div class="circle"></div>' + that.workflow.label + '<div class="leave">></div></div>' +
//            '<div class="rect"></div></div>'
//        );

        $(that.parentDom).append(
            '<div class="workflowWindow-sub-outputs-item" id="' + that.uuid + '">' +
            '<div class="title">' + that.workflow.node.label + '</div>' +
            '<div class="hr"></div>' +
            '<div class="rect"></div>' +
            '</div>'
        );

        that.onMouseup();
//        that.leaveClickListener();

    }
    else
    {



    }

    var ports=that.workflow.getExternalPorts();

    for(var i = 0; i < ports.length; i++)
    {

        if(ports[i].ui)
        {
            ports[i].ui.update();
            //console.log("output updating");
        }
        else
        {
            that.createPort(that.elSelector + ' .rect', ports[i]);
        }
    }

};

viscomposer.ui.workflowWindow.workflowOutput.prototype.leaveClickListener = function(){

    var that = this;

    $(that.elSelector + ' .leave').on("click", function(){

        var outputUUID = $(this).parents(".label").parents(".workflowWindow-sub-outputs-item").attr("id");

        var node = viscomposer.Object.hashmap.get(outputUUID).workflow.node.ui;
        $(node.elSelector + ' .label').click();

    })


};


viscomposer.ui.workflowWindow.workflowOutput.prototype.onMouseup = function(){

    var that = this;

    $(that.elSelector + " > .title").mouseup(function(ev){


        ev.stopPropagation();

        var start = viscomposer.app.connector.start;

        if(start)
        {
            var index = $(that.elSelector).attr("index");
            var workflowTo = that.workflow;
            var workflow = workflowTo.node.parent.workflow;
            var port = workflowTo.addPort(start.label,start.varname);
            workflowTo.ui.updateInputPorts();

            workflow.addLink(start,port.port1);
            workflow.ui.update();
            //console.log("workflow updating");

            viscomposer.app.connector.start = null;
            viscomposer.app.connector.end = null;
            viscomposer.app.connector.flag = false;
            $("#connect-temp").remove();


        }

    });

};

viscomposer.ui.workflowWindow.workflowOutput.prototype.createPort = function(parentDom, port){


    return new viscomposer.ui.workflowWindow.workflowOutputPort(parentDom, port);

}