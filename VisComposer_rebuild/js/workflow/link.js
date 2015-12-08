viscomposer.workflow.Link=(function(){
	var Link=viscomposer.VObject.define("Link",null,function(options){
		options=options||{};

        this.label="";
        this.description="";

	    this.port1=null;
	    this.port2=null;

	    if(port1&&port2){
	        this.connect(port1,port2);
	    }

	},["label","description","port1","port2"]);

	var prototype=Link.prototype;

    prototype.connect=function(port1,port2){
        this.port1=port1;
        this.port2=port2;
        this.workflow=port1.workflow||port1.module.workflow;

        port1.linkTo[port2.uuid]=this;

        var linkFrom;
        if(linkFrom=port2.linkFrom){
            linkFrom.destroy();
        }
        port2.linkFrom=this;

        this.workflow.linkList[this.uuid]=this;

        this.update();

        port1.onlink&&port1.onlink(port2);
        port2.onlink&&port2.onlink(port1);
    };

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

    prototype.getVarname=function(){
        return this.port1.getVarname();
    };

    prototype.getData=function(){
        var ret=null;
        ret=this.port1.getData();

        return ret;
    };

	//prototype.init=function(){
	//	//TODO
	//};
    //
	//prototype.prepare=function(){
	//	//TODO
	//};
    //
	//prototype.update=function(){
	//	//TODO
	//};
    //
	//prototype.submit=function(){
	//	//TODO
	//};

	prototype.connect=function(port1,port2){
	    this.port1=port1;
	    this.port2=port2;

	    port1.linkTo[port2.uuid]=this;

	    var linkFrom;
	    if(linkFrom=port2.linkFrom){
	        linkFrom.destroy();
	    }
	    port2.linkFrom=this;

	    this.workflow.linkList[this.uuid]=this;

	    this.update();
	};

	prototype.disconnect=function(){
	    if(!this.port1||!this.port2){return;}

	    var port1=this.port1,
	        port2=this.port2;

	    delete port1.linkTo[port2.uuid];
	    port2.linkFrom=null;

	    this.port1=this.port2=null;

	    /*$(this.ui.elSelector).remove();
	    $("#divforevents-" + this.ui.uuid).remove();
	    delete this.ui;*/
	    //TODO

	    delete this.workflow.linkList[this.uuid];
	};

	return Link;
})();