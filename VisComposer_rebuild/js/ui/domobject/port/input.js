/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.InputUI= (function(){
    var InputUI=viscomposer.VObject.define("InputUI","PortUI",function(parentDom, port){

            //viscomposer.Object.call(this);


            this.linkOn = false;
            this.update();
        }
    );

    var prototype=InputUI.prototype;

    prototype.update = function(){

        var that = this;

        this.elSelector = ".input#" + this.uuid;

        if($(that.elSelector).length == 0)
        {
            var temp, label = that.port.label;
            if(label || (label==''))
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
                '<div class="input" title="switch" id="' + that.uuid + '">' +
                '<div class="circle"></div>' +
                '<span class="label" title="' + label + '">' + temp + '</span>' +
                '<input class="string" value="'+that.port.value+'">' +
                '</div>'
            );
            $(that.elSelector + ' input.string').on("dragover", function(ev){
                ev.preventDefault();
            });
            that.onMouseup();
            that.onValueChange();
            that.renameListener();
            that.onMouseDown();
            that.inputDropListener();
        }
        else
        {

            $(that.elSelector + ' .string').val(that.port.value);

        }

        if(!that.linkOn)
        {
            $(that.elSelector + ' .circle').addClass("disable");
            $(that.elSelector + ' .string').css("display", "block");
        }
        else
        {
            $(that.elSelector + ' .circle').removeClass("disable");
            $(that.elSelector + ' .string').css("display", "none");
        }

    };

    prototype.inputDropListener = function(){
        var that = this;
        $(that.elSelector + ' input.string').on("drop", function(ev){
            ev.stopPropagation();
            that.port.value = viscomposer.app.draggingVar;
            that.port.submit();
        });
    };

    prototype.onMouseup = function(){

        var that = this;

        $(that.elSelector).mouseup(function (ev) {

            ev.stopPropagation();

            var start;
            if (start=viscomposer.app.connector.start) {

                viscomposer.app.connector.end = that.port;

                var workflow=that.port.module.workflow;
                workflow.addLink(start,that.port);

                workflow.ui.updateLinks();


            }
            viscomposer.app.connector.start = null;
            viscomposer.app.connector.end = null;
            viscomposer.app.connector.flag = false;
            $("#connect-temp").remove();


        });

    };


    prototype.onSwitch = function(){
        var that = this;
        $(that.elSelector + ' .circle').unbind("click");
        $(that.elSelector + ' .circle').on("click", function (ev) {
            ev.stopPropagation();
            if(!that.port.linkFrom)
            {
                that.linkOn = !that.linkOn;
                that.update();
            }
        });
    };

    prototype.onValueChange = function(){

        var that = this;

        $(that.elSelector + ' .string').on("change", function (ev) {

            var value = $(this).val();
            //console.log(value);

            that.port.value = value;
            that.port.submit();

        });

    };

    return InputUI;
})();

