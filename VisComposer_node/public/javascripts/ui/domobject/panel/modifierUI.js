/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.ModifierPanelUI= (function(){
    var ModifierPanelUI=viscomposer.VObject.define("ModifierPanelUI","ModuleUI",function(Module, workflowWindow){


            this.productive = true;

            this.update();
            //console.log("panel updating");

            var input = this.obj.input;
            for(var i = 0; i < input.length; i++)
            {
                input[i].ui.linkOn = true;
                input[i].ui.update();
            }

            this.modifierShow = false;
        }
    );

    var prototype=ModifierPanelUI.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var input = this.obj.input;
        for(var i = 0; i < input.length; i++)
        {
            input[i].ui.onSwitch();
            input[i].ui.update();
        }
    };

    prototype.createDom = function() {

        var that = this;
        var module = that.obj;
        $(".workflowWindow-sub#" + that.workflowWindow.uuid + " > .content").append(
            '<div class="module modifier" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
            '<div class="modifier"><div class="switch">OPEN</div></div>' +
            '</div></div>');
        $(that.elSelector + ' .switch').on("click", function () {

            var modifier = module.modifier;
            var modifierUI = modifier.ui;
            var modulePos = module.pos;
            if (!that.modifierShow) {
                $(this).html("CLOSE");
                modifier.pos = [parseInt(modulePos[0]) + 199, parseInt(modulePos[1]) + $(that.elSelector).height() + 30];
                if (modifierUI) {
                    modifierUI.update();
                    $(modifierUI.elSelector).css("display", "block");
                }
                else {
                    modifierUI = viscomposer.app.Factory.createPanel(modifier, that);
                }
            }
            else {
                $(modifierUI.elSelector).css("display", "none");
                $(this).html("OPEN");
            }
            that.modifierShow = !that.modifierShow;

        });
    };

    return ModifierPanelUI;
})();



