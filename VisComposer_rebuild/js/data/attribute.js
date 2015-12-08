/**
 * @fileoverview 属性相关数据结构
 */

viscomposer.Attribute=(function(){
    var TYPE={
        UNKNOWN:{id:0,label:'unknown'},
        CATEGORICAL:{id:1,label:'categorical'},
        ORDINAL:{id:2,label:'ordinal'},
        QUANTITATIVE:{id:3,label:'quantitative'}
    };
    var DIRECTION={
        NONE:{id:0,label:'none'},
        SEQUENTIAL:{id:1,label:'sequential'},
        DIVERGING:{id:2,label:'diverging'},
        CYCLIC:{id:3,label:'cyclic'}
    };

    var Attribute=viscomposer.VObject.define("Attribute",null,function(){
        this.index=null;
        this.label=null;
        this.type=TYPE.UNKNOWN;
        this.valueSet={};
        this.direction=DIRECTION.NONE;
    });

    var prototype=Attribute.prototype;

    Attribute.TYPE=TYPE;

    Attribute.DIRECTION=DIRECTION;

    return Attribute;
})();