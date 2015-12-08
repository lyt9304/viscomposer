viscomposer.scenegraph.Scenegraph = (function(){

    var Scenegraph = viscomposer.VObject.define("Scenegraph",null,function(){
        this.root = null;
        this.properties = {};
        this.ui = null;
        this.selectedNode = null;
        this.init();
    });

    var prototype = Scenegraph.prototype;

    prototype.newNode = function(type){
        var node = new viscomposer.scenegraph.Node(this, {"parent":null, type: type});
        this.root.children.push(node);
        var workflow = node.workflow;
        workflow.addModule("primitive", type);
        return node;
    };

    prototype.newForm = function(type){
        var node = this.newNode('blankview');
        var arrayType = viscomposer.util.formRegistry[type].array;
        var workflow = node.workflow;
        workflow.addModule("array", arrayType);
        var primitiveType = viscomposer.util.formRegistry[type].primitive;
        var primitiveNode = node.appendNode(primitiveType);
        return node;
    };

    prototype.init = function(){
        this.root = new viscomposer.scenegraph.Node(this,{isRoot:true, type: 'root'}, {width: 1024, height: 680, bgColor: '#ffffff'});
    };

    prototype.update = function(){

    };

    prototype.clear = function(){
        this.root.destroy();
        this.root = null;
        this.init();
    };

    prototype.run = function(){

    };

    return Scenegraph;

})();