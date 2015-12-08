/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.workflowWindow.port = function(parentDom, port){

    viscomposer.Object.call(this);

    this.parentDom = parentDom;
    this.port = port;
    port.ui = this;



};
viscomposer.ui.workflowWindow.port.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.ui.workflowWindow.port.prototype.constructor=viscomposer.ui.workflowWindow.port;

viscomposer.ui.workflowWindow.port.prototype.update = function(){



};

viscomposer.ui.workflowWindow.port.prototype.renameListener = function(){

    var that = this;
    $(that.elSelector + ' .label').on("dblclick", function(){

        var label = $(this).html();

        $(this).html("<input type='text' style='width: 50px;' value='" + label + "'>");

        $(this).children("input").focus();

        $(this).children("input").on("change", function(){

            var newName = $(this).val();
            $(this).parents(".label").html(newName);

        });
        $(this).children("input").on("blur", function(){

            var newName = $(this).val();
            $(this).parents(".label").html(newName);

        });

    })

};

viscomposer.ui.workflowWindow.port.prototype.onMouseDown = function(){

    var that = this;

    $(this.elSelector).mousedown(function(event, a){
        event.stopPropagation();

        if(event.which == 3 || a == 'right'){

            $("body > .menu").css("display", "none");

            $("#removelinkmenu").css({
                "left": event.clientX,
                "top": event.clientY,
                "display": "block"
            });

            var menucoverDom = $("body > .menucover");
            menucoverDom.css("display", "block");
            menucoverDom.on("click", function(){

                $("body > .menu").css("display", "none");
                $(this).css("display", "none");

            });

            viscomposer.app.toRemove = that;

        }

    });

};
