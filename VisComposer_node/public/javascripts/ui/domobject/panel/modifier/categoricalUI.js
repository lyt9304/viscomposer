/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.categoricalModifierPanel= (function(){
    var categoricalModifierPanel=viscomposer.VObject.define("categoricalModifierPanel","ModuleUI",function(modifier){
            this.obj= modifier;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module

            this.update();
        }
    );

    var prototype=categoricalModifierPanel.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        $("#workflowWindow").append(
            '<div class="module modifier categorical" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.modifierStr + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '</div>' +
            '<div class="confirm">OK</div>' +
            '</div>'
        );

        var valueSet = that.module.properties.valueSet;

        for(var key in valueSet)
        {

            $(that.elSelector + ' .content').append(
                '<div class="item">' +
                '<div class="value">' + key + '</div>' +
                '<div class="color">' + valueSet[key] + '</div>' +
                '<input class="btn" type="color" value="' + valueSet[key] + '">' +
                '<div class="btncover" style="width: 15px; height: 15px; background-color: ' + valueSet[key] + '; position: absolute;right: 19px; top: 2px; pointer-events: none;"></div>' +
                '</div>');

        }


        $(that.elSelector + ' .content .item .btn').on("change", function(){

            $(this).siblings(".color").html($(this).val());
            $(this).siblings(".btncover").css("background-color", $(this).val());

            var newValueSet = {};
            $.each($(that.elSelector + ' .content .item'), function(){

                var key = $(this).children(".value").html();
                var color = $(this).children(".color").html();
                newValueSet[key] = color;


            });

            that.module.properties.valueSet = newValueSet;
//        $(that.elSelector).css("display", "none");
            that.module.submit();

        });

        $(that.elSelector + ' .confirm').on("click", function(){

            var newValueSet = {};
            $.each($(that.elSelector + ' .content .item'), function(){

                var key = $(this).children(".value").html();
                var color = $(this).children(".color").html();
                newValueSet[key] = color;


            });

            that.module.properties.valueSet = newValueSet;
            $(that.elSelector).css("display", "none");
            that.module.submit();

        });
    };

    prototype.draggableListener = function(){

        var that = this;

        $(that.elSelector).draggable();

    };

    return categoricalModifierPanel;
})();



