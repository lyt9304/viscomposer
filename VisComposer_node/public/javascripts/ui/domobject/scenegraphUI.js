/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.ScenegraphUI = (function(){

    var ScenegraphUI = viscomposer.VObject.define("ScenegraphUI", "DOMObject", function(scenegraph){
        this.scenegraph = scenegraph;
        scenegraph.ui = this;
        this.dom = null;
        //this.dom = $("#scenegraphWindow #graph-root")[0];
        this.uiInit();
        this.listener();
        this.update();
    });

    var prototype = ScenegraphUI.prototype;

    prototype.uiInit = function(){
        this.dom = $("#scenegraphWindow > .content")[0];
    };

    prototype.listener = function(){
        var that = this;
        var dom = this.dom;
        var scenegraph = this.scenegraph;
        $(dom).on("click", function(){
            scenegraph.selectedNode = null;
            $(dom).find('.main').removeClass("clicked");
            viscomposer.app.uiManager.workflowWindow.setWorkflow(null);
        });
        $(dom).on("dragover", function(ev){
            ev.preventDefault();
        });
        $(dom).on("drop", function(ev){
            ev.preventDefault();
            var dragging = viscomposer.app.uiManager.dragging;
            var newNode = null;
            switch (dragging.category){
                case 'form':
                    newNode = scenegraph.newForm(dragging.type);break;
                case 'primitive':
                    newNode = scenegraph.newNode(dragging.type);break;
                case 'array':
                    //todo
                    break;
                default :
                    break;
            }
            that.update();
            that.setSelectedNode(newNode);
        });
    };

    prototype.update = function(){
        var scenegraph = this.scenegraph;
        var root = scenegraph.root;
        if(root.ui){
            root.ui.update();
        }else{
            new viscomposer.ui.NodeUI(root);
        }
    };

    prototype.setSelectedNode = function(node){
        this.scenegraph.selectedNode = node;
        $(this.dom).find(".main").removeClass('clicked');
        if(node){
            $(node.ui.dom).children(".main").addClass("clicked");
            viscomposer.app.uiManager.workflowWindow.setWorkflow(node.workflow);
            //TODO
        }
    };

    return ScenegraphUI;
})();