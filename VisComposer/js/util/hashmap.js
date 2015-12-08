/**
 * Hashmap类
 */
viscomposer.util.Hashmap=function(){
}

viscomposer.util.Hashmap.prototype={
	constructor:viscomposer.util.Hashmap,

    check:function(key){
        if(key==null){return false;}//null or undefined
        if(Object.prototype.toString.call(key).slice(8,-1)!="String"){return false;}
        return true;
    },

    set:function(key,value){
        if(!this.check(key)){
            window.console.error('invalid key: '+key);
        }
        this[key]=value
    },

    get:function(key){
        return this[key]
    },
    contains:function(key){
        return this.get(key)==null?false:true
    },

    remove:function(key){
        delete this[key]
    },

    dispose:function(){
    	for(var k in this){
    		delete this[k];
    	}
    }
}
