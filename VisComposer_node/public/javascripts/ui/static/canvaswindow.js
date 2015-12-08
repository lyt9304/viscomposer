/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.CanvasWindow=(function(){

    var CanvasWindow=function(){
		this.dom=$("#canvasWindow")[0];
	};

    var prototype=CanvasWindow.prototype;



    prototype.highlight = function(){
        $(this.dom).children(".title").animate({"background-color": "#4897f0", color: 'white'}, 500);
        setTimeout('$("#canvasWindow > .title").animate({"background-color": "white", color: "#333333"}, 500);', 1000);
    };

    return CanvasWindow;

})();