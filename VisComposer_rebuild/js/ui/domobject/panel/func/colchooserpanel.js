/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.colChooserPanel= (function(){
    var colChooserPanel=viscomposer.VObject.define("colChooserPanel","ModuleUI",function(Module, workflowWindow){
            //this.module = module;
            this.productive = true;
            this.obj.ui = this;
            this.workflowWindow = workflowWindow;
            this.selectedCol = null;
            this.update();
        }
    );

    var prototype=colChooserPanel.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var module = this.obj;
        var input = module.input[0];
        var inputUI = input.ui;
        inputUI.linkOn = true;
        inputUI.update();
        this.fillOptions();
    };

    prototype.createDom = function() {

        var that = this;

        var module = that.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.ui.uuid + ' > .content')
            .append(
            '<div class="module colschooser" id="' + that.uuid + '">' +
            '<div class="title"><span>' + module.label + '</span></div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs"></div>' +
            '<div class="outputs"></div>' +
            '<div class="option">' +
            '</div>' +
            '</div></div>');
    };

    prototype.fillOptions = function(){
        var that = this;
        var optionDom = $(this.elSelector + ' .option');
        optionDom.html('');
        var cols = this.obj.properties.cols;
        for(var key in cols)
        {
            var checked = cols[key].selected;
            if(checked)
            {
                optionDom.append('<div class="item"><input type="checkbox" value="' + key + '" checked>' + key + '</div>');
            }
            else
            {
                optionDom.append('<div class="item"><input type="checkbox" value="' + key + '">' + key + '</div>');
            }

        }
        $(that.elSelector + ' .option input[type="checkbox"]').unbind("click");
        $(that.elSelector + ' .option input[type="checkbox"]').on("click", function(){
            var val = $(this).attr("value");
            (that.obj.properties.cols[val]).selected = this.checked;
            //viscomposer.app.tryRender();
        });
    };


    return colChooserPanel;
})();



