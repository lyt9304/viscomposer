/**
 * Created by lyt9304 on 15/8/1.
 */
/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.OutputUI= (function(){
    var OutputUI=viscomposer.VObject.define("OutputUI","PortUI",function(parentDom, port){
            
            this.update();
        }
    );

    var prototype=OutputUI.prototype;

    prototype.update = function(){

        var that = this;

        this.elSelector = ".output#" + this.uuid;

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

    prototype.onMousedown = function() {

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

    return OutputUI;
})();


