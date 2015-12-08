/**
 * @fileoverview 属性相关数据结构
 */

viscomposer.Attribute=function(){
	viscomposer.Object.call(this);

	this.index=null;
	this.label=null;
	this.type=viscomposer.Attribute.TYPE.UNKNOWN;
    this.valueSet={};
	this.direction=viscomposer.Attribute.DIRECTION.NONE;
};

viscomposer.Attribute.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.Attribute.prototype.constructor=viscomposer.Attribute;


viscomposer.Attribute.TYPE={
	UNKNOWN:{id:0,label:'unknown'},
	CATEGORICAL:{id:1,label:'categorical'},
	ORDINAL:{id:2,label:'ordinal'},
	QUANTITATIVE:{id:3,label:'quantitative'}
};

viscomposer.Attribute.DIRECTION={
	NONE:{id:0,label:'none'},
	SEQUENTIAL:{id:1,label:'sequential'},
	DIVERGING:{id:2,label:'diverging'},
	CYCLIC:{id:3,label:'cyclic'}
};

viscomposer.Attribute.prototype.clone=function(){
    var newObj=new viscomposer.Attribute();
    newObj.copy(this);

    return newObj;
}

viscomposer.Attribute.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);
    this.index=rhs.index;
    this.label=rhs.label;
    this.type=rhs.type;
    this.direction=rhs.direction;
};

viscomposer.Attribute.prototype.destroy=function(){
    viscomposer.Object.prototype.destroy.call(this);

    this.index=null;
    this.label=null;
    this.type=null;
    this.direction=null;
}