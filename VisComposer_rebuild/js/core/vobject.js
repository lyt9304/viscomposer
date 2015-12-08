/**
 * @fileoverview 所有对象的基类。
 */

viscomposer.VObject=(function(){
	var hashmap=new viscomposer.util.Hashmap();
	var VObjectBase=function(){
		var uuid=viscomposer.util.generateUUID();
		this.getUUID=function(){return uuid;};

		viscomposer.VObject.hashmap.set(uuid,this);
	};

	var VObject={};

	VObject.hashmap=hashmap;
	var registeredClass=VObject.registeredClass={};

	VObjectBase.prototype={	
		constructor:VObjectBase,

		get uuid(){
			return this.getUUID();
		},

		clone:function(){
		    var newObj=new VObjectBase();
		    newObj.copy(this);

		    return newObj;
		},

		copy:function(rhs){
	    	if(!rhs){return;}
		},

		destroy:function(){
			VObject.hashmap.remove(this.uuid);
		},

		store:function(){
			var obj={};
			obj.uuid=this.uuid;
			return obj;
		}
	};

	VObject.define=function(name,baseName,constructor,members){
		var Base=baseName?registeredClass[baseName]:VObjectBase;
		var Class=function(){
			Base.apply(this,arguments);
			this.className_=name;
			constructor.apply(this,arguments);
		};
		Class.baseClass_=Base;
		Class.basePrototype_=Base.prototype;
		var prototype=Class.prototype=Object.create(Base.prototype);
		prototype.constructor=Class;

	    prototype.clone=function(){
	        var newObj=new Class();
	        newObj.copy(this);

	        return newObj;
	    };

	    prototype.copy=function(rhs){
	        Base.prototype.copy.call(this,rhs);

	        for(var i=0,ni=members.length;i<ni;++i){
	        	var key=members[i];
	        	this[key]=viscomposer.util.copyObject(rhs[key]);
	        }
	    };

	    prototype.destroy=function(){
	        Base.prototype.destroy.call(this);

	        for(var i=0,ni=members.length;i<ni;++i){
	        	var key=members[i];
	        	viscomposer.util.deleteObject(this[key]);
	        	this[key]=null;
	        }
	    };

		return registeredClass[name]=Class;
	};

	return VObject;
})();