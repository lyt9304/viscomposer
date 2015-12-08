viscomposer.workflow.Port=(function(){
	var Port=viscomposer.VObject.define("Port",null,function(type){
		//options=options||{};

        this.label="";
        this.description="";
        this.module=null;
        this.workflow=null;

	    var linkType;
	    switch(type){
	    case 'input':case 'map':
	        linkType='input';break;
	    case 'output':case 'geometry':case 'transform':case 'data':case 'scale':case 'layout':
	        linkType='output';break;
	    default:
	        linkType='none';
	    }//TODO

    	//this.type=options.type||'none';
    	this.linkType=linkType||'none';
    	this.linkFrom=null;
    	this.linkTo={};

	},["label","description","type","linkType","linkFrom","linkTo"]);

	var prototype=Port.prototype;

	prototype.init=function(){
		//TODO
	};

	prototype.prepare=function(){
        switch(this.linkType){
            case 'input':
                break;
            case 'output':
                for(var key in this.linkTo){
                    var link=this.linkTo[key];
                    link.port2.data=this.data;
                }
                this.data=null;
                break;
        }
	};

	prototype.update=function(){
        switch(this.linkType){
            case 'input':
                //this.module.update();
                break;
            case 'output':
                /*for(var key in this.linkTo){
                 var link=this.linkTo[key];
                 link.update();
                 }*/
                if(!this.data){
                    this.data=viscomposer.data.DataFactory(data);
                }else{
                    this.data.update(data);
                }
                break;
        }
	};

	prototype.submit=function(){
        viscomposer.app.tryRender();
	};

	return Port;
})();