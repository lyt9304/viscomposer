/**
 * Created by lyt9304 on 15/7/30.
 */
/**
 * Created by vag on 2015/3/29.
 */
viscomposer.ui.PrimitivePanelUI = (function(){
    var PrimitivePanelUI=viscomposer.VObject.define("PrimitivePanelUI","ModuleUI",function(module, workflow, type){
            //TODO:barchart,scatterplot,crossmatrix,verticalarray

            this.type=type;
            //circle,rect,view,text

            //this.obj = module;
            this.productive = false; //能否直接拉出一个module
            //this.module.ui_ = this;
            //this.workflowWindow = workflow;

            this.ScaleXShow = false;
            this.ScaleYShow = false;
            this.modifierStr="";

            this.obj.pos = viscomposer.util.PanelPositionList[type];

            this.update();

            //if(this.type == "barchart" || this.type == "scatterplot") {
            //    this.switchClick();
            //    this.modifierStr='<div class="modifier"><div class="switchX">X</div><div class="switchY">Y</div></div>';
            //}

        }
    );

    var prototype=PrimitivePanelUI.prototype;

    prototype.createDOM = function(){

        var that = this;
        this.elSelector=".module#"+this.uuid;

        var module = that.obj;

        this.dom=$.parseHTML(
            '<div class="module '+ that.type.toLowerCase() +' ui-draggable ui-draggable-handle" id="' + that.uuid + '" style="left: 580px; top: 150px;">' +
            '<div class="title">' +
            '<span>' + module.label + '</span>' +
            '<img src="' + (module.layoutIcon||viscomposer.app.imgPool[this.type.toLocaleLowerCase()]) + '">' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '</div>' +
            '<div class="outputs"></div>' +
                //this.modifierStr+
            '</div></div>');
        var dom=this.dom;

        $(dom).appendTo(".workflowWindow-sub#" + that.workflowWindow.ui.uuid + " > .content");

        //$(".workflowWindow-sub#" + that.workflowWindow.ui.uuid + " > .content").append(
        //    '<div class="module '+ that.type.toLowerCase() +' ui-draggable ui-draggable-handle" id="' + that.uuid + '" style="left: 580px; top: 150px;">' +
        //    '<div class="title">' +
        //    '<span>' + module.label + '</span>' +
        //    '<img src="' + (module.layoutIcon||viscomposer.app.imgPool[this.type]) + '">' +
        //    '</div>' +
        //    '<div class="hr"></div>' +
        //    '<div class="content">' +
        //    '<div class="inputs">' +
        //    '</div>' +
        //    '<div class="outputs"></div>' +
        //        //this.modifierStr+
        //    '</div></div>');
    };

    prototype.update = function(){

        //TODO
        viscomposer.ui.ModuleUI.prototype.update.apply(this);
        var input = this.obj.input;

        for(var i = 0; i < input.length; i++)
        {

            input[i].ui.onSwitch();
            input[i].ui.update();

        }

    };

    //prototype.switchClick = function() {
    //
    //    var that = this;
    //    var thisPos = that.module.pos;
    //
    //    $(that.elSelector + ' .switchX').on("click", function(){
    //
    //        var scaleX = that.module.properties.scaleX;
    //        var scaleXUI = scaleX.ui;
    //        if(!that.ScaleXShow)
    //        {
    //            scaleX.pos = [parseFloat(thisPos[0])+199, parseFloat(thisPos[1]) + parseFloat($(that.elSelector).height()) + 50];
    //            if(scaleXUI)
    //            {
    //
    //                scaleXUI.update();
    //                $(scaleXUI.elSelector).css("display", "block");
    //            }
    //            else
    //            {
    //                scaleXUI = viscomposer.app.Factory.createPanel(scaleX, that);
    //            }
    //        }
    //        else
    //        {
    //            $(scaleXUI.elSelector).css("display", "none");
    //        }
    //        that.ScaleXShow = !that.ScaleXShow;
    //
    //    });
    //
    //    $(that.elSelector + ' .switchY').on("click", function(){
    //
    //        var scaleY = that.module.properties.scaleY;
    //        var scaleYUI = scaleY.ui;
    //        if(!that.ScaleYShow)
    //        {
    //            scaleY.pos = [parseFloat(thisPos[0])+199, parseFloat(thisPos[1]) + $(that.elSelector).height()];
    //            if(scaleYUI)
    //            {
    //                scaleYUI.update();
    //                $(scaleYUI.elSelector).css("display", "block");
    //            }
    //            else
    //            {
    //                scaleYUI = viscomposer.app.Factory.createPanel(scaleY, that);
    //            }
    //        }
    //        else
    //        {
    //            $(scaleYUI.elSelector).css("display", "none");
    //        }
    //        that.ScaleYShow = !that.ScaleYShow;
    //
    //    });
    //
    //};



    return PrimitivePanelUI;
})();





