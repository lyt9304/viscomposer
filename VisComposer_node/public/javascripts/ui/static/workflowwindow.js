viscomposer.ui.WorkflowWindow=(function(){

    var workflowWindow=function(){
        this.dom = null;
        this.modelsWindow = new viscomposer.ui.FuncWindow();
        this.workflowUIs = {};
        this.uiInit();
        this.listener();
	};

    var prototype=workflowWindow.prototype;


    prototype.uiInit = function(){
        this.dom = $("#workflowWindow")[0];
    };

    prototype.listener = function(){
        //$("#workflowWindow").on("dragstart", "img", function(ev){
        //    console.log("haha");
        //    //return viscomposer.app.uiManager.modulesDragstart(ev);
        //});
    };

    prototype.setWorkflow = function(workflow){
        $(this.dom).find('.workflowUI').hide();
        workflow && workflow.ui && ($(workflow.ui.dom).show());
    };

    prototype.highlight = function(){
        $(this.dom).children(".title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#workflowWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);
    };

    return workflowWindow;

})();