/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.WorkflowOutputPortUI= (function(){
    var WorkflowOutputPortUI=viscomposer.VObject.define("WorkflowOutputPortUI","PortUI",function(parentDom,workflowTo){
            //viscomposer.Object.call(this);

            this.parentDom = parentDom;
            this.workflow=workflowTo;
            this.workflow.externalPortsUI=this;

            this.update();
            //console.log("workflow output updating");

        }
    );

    var prototype=WorkflowOutputPortUI.prototype;

    prototype.update = function(){

        var that = this;

        this.elSelector = ".workflowWindow-sub-outputs-item#" + this.uuid;

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

    prototype.leaveClickListener = function(){

        var that = this;

        $(that.elSelector + ' .leave').on("click", function(){

            var outputUUID = $(this).parents(".label").parents(".workflowWindow-sub-outputs-item").attr("id");

            var node = viscomposer.Object.hashmap.get(outputUUID).workflow.node.ui;
            $(node.elSelector + ' .label').click();

        })


    };


    prototype.onMouseup = function(){

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


    return WorkflowOutputPortUI;
})();


