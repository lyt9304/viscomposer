/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.SortPanelUI= (function(){
    var SortPanelUI=viscomposer.VObject.define("SortPanelUI","ModuleUI",function(module, workflowWindow){

            //viscomposer.ui.workflowWindow.panel.call(this, module, workflowWindow);
            this.productive = true;
            this.obj.ui = this;
            this.workflowWindow = workflowWindow;
            this.selectedCol = null;

            this.update();
            //console.log("panel updating");

        }
    );

    var prototype=SortPanelUI.prototype;

    prototype.update = function(){

        var that = this;

        this.elSelector = '.module#' + this.uuid;
        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var module = that.module;
        var input = module.input[0];
        var inputUI = input.ui;
        inputUI.linkOn = true;
        inputUI.update();

        if(!input.linkFrom){
            $(that.elSelector + ' .content .select select').html('');
        }

        else
        {
            if(!that.module.properties.selectedCol){
                $(that.elSelector + ' .content .select select').html('');
                var flag = false, first = null;
                for(var key in module.properties.cols)
                {
                    if(!flag){
                        first = key;
                        flag = true;
                    }
                    $(that.elSelector + ' .content .select select').append('<option>' + key + '</option>');
                }
                that.module.properties.selectedCol = first;
                $(that.elSelector + ' .select select').on("change", function(){
                    that.module.properties.selectedCol = $(this).val();
                    viscomposer.app.tryRender();
                });
            }
        }
    };

    prototype.createDom = function(){

        var that = this;
        var module = that.module;

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
            .append(
            '<div class="module sort" id="' + that.uuid + '">' +
            '<div class="title"><span>' + module.label + '</span></div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs"></div>' +
            '<div class="outputs"></div>' +
            '<div class="select"><select></select></div>' +
            '<div class="option">' +
            '<div><input type="radio" name="direction" value="ascend">ascend</div>' +
            '<div><input type="radio" name="direction" value="descend">descend</div>' +
            '<div><input type="radio" name="direction" value="none">none</div>' +
            '</div>' +
            '</div></div>');

        $(that.elSelector + ' input[value="ascend"]').attr("checked", true);

        $(that.elSelector + ' .select select').on("change", function(){
            that.module.properties.selectedCol = $(this).val();
            viscomposer.app.tryRender();
        });

        $(that.elSelector + " input[name='direction']").on("click", function() {
            var direction = $(that.elSelector + " input[name='direction']:checked").val();
            that.module.properties.direction = direction;
            viscomposer.app.tryRender();
        });

    };

    return SortPanelUI;
})();



