viscomposer.ui.OutputUI= (function(){
    var OutputUI = viscomposer.VObject.define("OutputUI", "PortUI", function(port){
            viscomposer.ui.PortUI.call(this, port);
            this.uiInit();
            this.listener();
            this.update();
        }
    );

    var prototype = OutputUI.prototype;

    prototype.uiInit = function(){
        var port = this.port;
        var container = port.module.ui.outputsDom;
        var dom = this.dom = $.parseHTML(
            '<div class="output" id="' + this.uuid + '">' +
            '<span class="label" title="' + port.label + '">' + port.label + '</span>' +
            '<div class="circle"></div>' +
            '</div>');
        $(dom).appendTo($(container));
    };

    prototype.listener = function(){
        var dom = this.dom;
        $(dom).on("click", ".circle", function(){
            alert('yeah!');
        });
    };

    prototype.update = function(){};

    return OutputUI;

})();


