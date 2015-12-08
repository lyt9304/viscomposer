viscomposer.scenegraph.Node=(function(){

    var Node = viscomposer.VObject.define("Node", null, function(scenegraph, options, properties){//options:parent, isEmpty, isRoot, type
        options = options || {};
        this.label = options.type;
        this.parent = options.parent;
        this.children = [];
        this.scenegraph = scenegraph;
        this.properties = properties;
        this.workflow = null;
        this.isRoot = false;
        this.ui = null;
        this.type = options.type;
        //空节点和根节点没有workflow
        if(options.isRoot){
            this.isRoot = true;
            this.workflow = 1;
        }else{
            if(options.isEmpty){
                //TODO 空节点
            }else{
                this.workflow = new viscomposer.workflow.Workflow(this, null);
            }
        }
    });

    var prototype = Node.prototype;

    prototype.appendNode = function(type){
        var node = new viscomposer.scenegraph.Node(this.scenegraph, {"parent":this, type: type});
        this.children.push(node);
        var workflow = node.workflow;
        workflow.addModule("primitive", type);
        return node;
    };

    prototype.appendForm = function(type){
        var node = this.appendNode('blankview');
        var arrayType = viscomposer.util.formRegistry[type].array;
        var workflow = node.workflow;
        workflow.addModule("array", arrayType);
        var primitiveType = viscomposer.util.formRegistry[type].primitive;
        node.appendNode(primitiveType);
        return node;
    };

    prototype.update = function(){
        //TODO update self
        this.workflow.update();
        var children = this.children;
        for(var i = 0, l = children.length; i < l; i++){
            children[i].update();
        }
    };

    return Node;

})();