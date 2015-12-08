/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.scaleModifierPanel= (function(){
    var scaleModifierPanel=viscomposer.VObject.define("scaleModifierPanel","ModuleUI",function(modifier){
            this.obj= modifier;
            this.productive = false; //能否直接拉出一个module
            this.obj.ui = this; //能否直接拉出一个module

            this.update();
        }
    );

    var prototype=scaleModifierPanel.prototype;

    prototype.update = function(){

        var that=this;

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var min = that.range[0];
        var max = that.range[1];

        $(that.elSelector + ' .range').slider("option", {
            min: min * 1000,
            max: max * 1000,
            values: [that.chosenRange[0] * 1000, that.chosenRange[1] * 1000]
        })

    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        var modifierStr = that.module.modifierStr || '';

        var minmax = that.module.properties['_minmax'];
        var autoDataRange = that.module.properties.autoDataRange;

        that.range = [minmax[0], minmax[1]];
        that.chosenRange = [minmax[0], minmax[1]];

        $("#workflowWindow").append('<div class="module modifier scale" id="' + that.uuid + '">' +
        '<div class="title"><span>Scale</span></div>' +
        '<div class="hr"></div>' +
        '<div class="content">' +
        '<div><input type="radio" name="type" value="auto">auto</div>' +
        '<div><input type="radio" name="type" value="fixed">fixed</div>' +
        '<div>' +
        '<span class="label start">start</span>' +
        '<span class="label end">end</span>' +
        '</div><div>' +
        '<input type="text" class="start" value="' + that.chosenRange[0] + '" >' +
        '<input type="text" class="end" value="' + that.chosenRange[1] + '" >' +
        '</div>' +
        '<div class="range"></div>' +
        '<div>' +
        '<span class="label static start">' + that.range[0] + '</span>' +
        '<span class="label static end">' + that.range[1] + '</span>' +
        '</div>' +
        '<hr>' +
        '<div class="special"><input type="checkbox" name="reverse">reverse</div>' +
        '<div class="special"><input type="checkbox" name="log">log</div>' +
        '<div class="close">OK</div>' +
        '</div>' +
        '</div>');

        $(that.elSelector + ' .close').on("click", function(){
            $(that.elSelector).css("display", "none");
        });
        if(autoDataRange)
        {
            $(that.elSelector + ' input[value="auto"]').attr("checked", true);
            $(that.elSelector + " input.start, input.end").attr("disabled", true);
            $(that.elSelector + " .range, .range > .ui-slider-range, .range > .ui-slider-handle").addClass("disable");
        }
        else
        {
            $(that.elSelector + ' input[value="fixed"]').attr("checked", true);
            $(that.elSelector + " input.start, input.end").attr("disabled", false);
            $(that.elSelector + " .range, .range > .ui-slider-range, .range > .ui-slider-handle").removeClass("disable");
        }
        $(that.elSelector + ' .range').slider({
            range: true,
            min: that.range[0] * 1000,
            max: that.range[1] * 1000,
            values: [that.chosenRange[0] * 1000, that.chosenRange[1] * 1000],
            slide: function(event, ui){

                var min = ui.values[0]/1000;
                var max = ui.values[1]/1000;
                $(that.elSelector + " input.start").val(min);
                $(that.elSelector + " input.end").val(max);

                that.chosenRange = [min, max];
                that.module.properties.dataRange = that.chosenRange;

                viscomposer.app.tryRender(true);

            }
        });
        $(that.elSelector + " input.start").on("change", function(){
            var min = parseFloat($(this).val());
            var startLabel = $(that.elSelector + " .label.static.start");
            var oMin = parseFloat(startLabel.html());
            that.chosenRange[0] = min;
            if(min < oMin)
            {
                startLabel.html(min);
                that.range[0] = min;
                that.update();
            }
            that.module.properties.dataRange = that.chosenRange;

            viscomposer.app.tryRender(true);
        });
        $(that.elSelector + " input.end").on("change", function(){
            var max = parseFloat($(this).val());
            var endLabel = $(that.elSelector + " .label.static.end");
            var oMax = parseFloat(endLabel.html());
            that.chosenRange[1] = max;
            if(max > oMax)
            {
                endLabel.html(max);
                that.range[1] = max;
                that.update();
            }
            that.module.properties.dataRange = that.chosenRange;

            viscomposer.app.tryRender(true);
        });
        $(that.elSelector + " input[name='type']").on("click", function(){
            var type = $(that.elSelector + " input[name='type']:checked").val();
            if(type === 'auto')
            {
                $(that.elSelector + " input.start, input.end").attr("disabled", true);
                $(that.elSelector + " .range, .range > .ui-slider-range, .range > .ui-slider-handle").addClass("disable");
                that.module.properties.dataRange = "auto";
                that.module.properties.autoDataRange = true;

                viscomposer.app.tryRender(true);

            }
            else if(type === 'fixed')
            {
                $(that.elSelector + " input.start, input.end").attr("disabled", false);
                $(that.elSelector + " .range, .range > .ui-slider-range, .range > .ui-slider-handle").removeClass("disable");
                that.module.properties.dataRange = that.chosenRange;
                that.module.properties.autoDataRange = false;
            }

            viscomposer.app.tryRender();

        });

        $(that.elSelector + ' input[name="reverse"]').on("click", function(){
            var checked = $(this).is(':checked');
            that.module.properties.reverse = checked;
        });
        $(that.elSelector + ' input[name="log"]').on("click", function(){
            var checked = $(this).is(':checked');
            that.module.properties.log = checked;
        });
    };

    prototype.draggableListener = function(){

        var that = this;

        $(that.elSelector).draggable();

    };

    return scaleModifierPanel;
})();


