/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.PortUI= (function(){
    var PortUI=viscomposer.VObject.define("PortUI","DOMObject",function(parentDom, port){

            //viscomposer.Object.call(this);

            this.parentDom = parentDom;
            this.port = port;
            port.ui = this;
        }
    );

    var prototype=PortUI.prototype;

    prototype.renameListener = function(){

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

    prototype.onMouseDown = function(){

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


    return PortUI;
})();


