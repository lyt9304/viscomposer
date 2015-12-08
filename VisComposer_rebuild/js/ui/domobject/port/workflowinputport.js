/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.WorkflowInputPortUI= (function(){
    var WorkflowInputPortUI=viscomposer.VObject.define("WorkflowInputPortUI","PortUI",function(parentDom, port){

            this.update();
        }
    );

    var prototype=WorkflowInputPortUI.prototype;

    prototype.update = function(){

        var that = this;

        this.elSelector = ".workflowWindow-sub-inputs-item#" + this.uuid;

        var port = that.port;

        if($(that.elSelector).length == 0)
        {

            if(port.imported && (port.dataInfo == null))
            {
                $(that.parentDom).append(
                    '<div class="workflowWindow-sub-inputs-item" id="' + that.uuid + '">' +
                    '<div class="drop">drop data here!!!!!!!!!!!</div>' +
                    '<div class="circle"></div>' +
                    '</div>'
                );
                that.dropDataListener();

            }
            else
            {
                var label = that.port.label;
                $(that.parentDom).append(
                    '<div class="workflowWindow-sub-inputs-item" id="' + that.uuid + '">' +
                    '<div class="label" title="' + label + '">' + label + '</div>' +
                    '<div class="circle"></div>' +
                    '</div>'
                );
                that.onMousedown();
                that.renameListener();
            }

        }
        else
        {

            if(port.imported && (port.dataInfo == null))
            {
                $(that.elSelector).html(
                    '<div class="drop">drop data here!!!!!!!!!!!</div>' +
                    '<div class="circle"></div>'
                );

            }
            else
            {
                that.dropDataListener();
                $(that.elSelector).html(
                    '<div class="label">' + that.port.label + '</div>' +
                    '<div class="circle"></div>');
                that.onMousedown();
                that.renameListener();
            }

        }

    };

    prototype.dropDataListener = function(){

        var that = this;

        $(that.elSelector + ' .drop').unbind("drop");
        $(that.elSelector + ' .drop').on("drop", function(ev){

            ev.stopPropagation();

            console.log("data dropping");
            var dragging = viscomposer.app.dragging;
            var type = dragging.type, id = dragging.id;
            if(type == 'data' && id)
            {
                var dataObj = viscomposer.Object.hashmap.get(id);
                console.log(dataObj);

                that.port.dataInfo = dataObj;

                that.update();

                viscomposer.app.tryRender();

                //bug

            }

        });

    };

    prototype.onMousedown = function(){

        var that = this;

        $(that.elSelector).unbind("mousedown");
        $(that.elSelector).mousedown(function(){


            viscomposer.app.connector.start = that.port;
            viscomposer.app.connector.end = null;
            viscomposer.app.connector.flag = true;

            var ui=that.port.workflow.ui;
            $(ui.elSelector).mousemove(function(ev){

                //画临时的线
                ui.drawTempLink();

            });

        });

    };

    return WorkflowInputPortUI;
})();


