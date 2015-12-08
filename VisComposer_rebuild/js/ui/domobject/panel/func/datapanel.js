/**
 * Created by lyt9304 on 15/7/30.
 */
viscomposer.ui.DataPanelUI= (function(){
    var DataPanelUI=viscomposer.VObject.define("DataPanelUI","ModuleUI",function(dataModule, workflowWindow){

            //viscomposer.ui.workflowWindow.panel.call(this,dataModule, workflowWindow);

            this.productive = true;

            this.update();

            //console.log("panel updating");

        }
    );

    var prototype=DataPanelUI.prototype;

    prototype.update = function(){

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        $(this.elSelector + ' .string').css("display", "none");

    };

    prototype.createDom = function(){

        var that = this;
        this.elSelector = '.module#' + this.uuid;
        var module = this.obj;

//    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
//            '<div class="module data" id="' + that.uuid + '">' +
//            '<div class="title" id="title-' + that.uuid + '">' +
//            '<span>' + module.label + '</span>' +
//            '</div><div class="content">' +
//            '<div class="inputs">' +
//            '</div>' +
//            '<div class="outputs">' +
//            '</div></div></div>');

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content')
            .append(
            '<div class="module data" id="' + that.uuid + '">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content" style="height: 100px;">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs">' +
            '</div>' +
            '</div>' +
            '</div>');


    };

    return DataPanelUI;
})();