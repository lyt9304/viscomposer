/**
 * Created by lyt9304 on 15/8/1.
 */
viscomposer.ui.PortUI = (function(){
    var PortUI = viscomposer.VObject.define("PortUI","DOMObject",function(port){
            this.port = port;
            port.ui = this;
            this.dom = null;
        }
    );

    var prototype = PortUI.prototype;

    prototype.uiInit = function(){

    };

    prototype.listener = function(){

    };

    prototype.update = function(){

    };

    return PortUI;
})();


