/**
 * @fileoverview 所有对象的基类。
 */

viscomposer.Object=function(uuid){
	this.uuid=viscomposer.util.generateUUID();

    if(!viscomposer.Object.hashmap){viscomposer.Object.hashmap=new viscomposer.util.Hashmap();}
	viscomposer.Object.hashmap.set(this.uuid,this);
};

viscomposer.Object.hashmap=null;

viscomposer.Object.prototype={
	
	constructor:viscomposer.Object,

	getUUID:function(){
		return this.uuid;
	},

	clone:function(){
	    var newObj=new viscomposer.Object();
	    newObj.copy(this);

	    return newObj;
	},

	copy:function(rhs){
    	if(!rhs){return;}

	},

	destroy:function(){
		viscomposer.Object.hashmap.remove(this.uuid);
	},

	store:function(){
		var obj={};
		obj.uuid=this.uuid;
		return obj;
	}
};