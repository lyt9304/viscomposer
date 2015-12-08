viscomposer.workflow.Link = (function(){
    var Link = viscomposer.VObject.define("Link",null,function(port1, port2){
        this.port1 = port1;
        this.port2 = port2;
        this.workflow = port1.workflow || port1.module.workflow;
        port1.linkTo[port2.uuid] = this;
        var linkFrom;
        if(linkFrom = port2.linkFrom){
            linkFrom.destroy();
        }
        port2.linkFrom = this;
        this.workflow.linkList[this.uuid]=this;
        this.ui = null;
        this.update();
    });

    var prototype = Link.prototype;

    prototype.disconnect=function(){
        if(!this.port1||!this.port2){return;}

        var port1=this.port1,
            port2=this.port2;

        delete port1.linkTo[port2.uuid];
        port2.linkFrom=null;

        port1.onlink&&port1.onlink(null);
        port2.onlink&&port2.onlink(null);

        this.gen_removed=true;

        this.port1=this.port2=null;

        $(this.ui.elSelector).remove();
        $("#divforevents-" + this.ui.uuid).remove();
        delete this.ui;

        delete this.workflow.linkList[this.uuid];
    };

    prototype.update = function(){

    };

    return Link;
})();