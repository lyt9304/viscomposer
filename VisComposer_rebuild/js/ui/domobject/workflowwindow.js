viscomposer.ui.WorkflowWindow=(function(){

    //workflowUIs[uuid]=workflowUIObj
    //selectedWorkflow type:workflowUI uuid

	var workflowUIs = {};
    var selectedWorkflow = null;

    var workflowWindow=function(){
		this.dom=$("#workflowWindow")[0];
	};

    var prototype=workflowWindow.prototype;

    prototype.init = function(){

    };

    Object.defineProperties(prototype, {
        workflowUIs: {
            get: function(){ return workflowUIs; },
            set: function(x){ workflowUIs = x; }
        },
        selectedWorkflow: {
            get: function(){ return selectedWorkflow; },
            set: function(x){ selectedWorkflow = x; }
        }
    });

    prototype.update = function(){
        //workflowwindow的显示机制：
        //所有workflowui只有在新建的时候会被添加到dom上，然后显示哪个是全部隐藏，然后根据id选择显示哪个
        //显示当前选中workflow
        $(".workflowWindow-sub").css("display", "none");
        $(".workflowWindow-sub#" + selectedWorkflow).css("display", "block");
        //只需更新当前选中workflow
        workflowUIs[selectedWorkflow].update();
    };

    prototype.highlight = function(){
        var dom = this.dom;
        $(dom).children(".title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#workflowWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);
    };

    return workflowWindow;

})();