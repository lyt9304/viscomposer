/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.workflowWindow.linkUI = function(link){

    viscomposer.Object.call(this);

    this.elSelector = '.link#' + this.uuid;

    this.link = link;

    this.link.ui = this;

    if(link.port2.type == "map")
    {
        this.color = 'red';
    }
    else
    {
        this.color = 'black';
    }

    this.update();
    //console.log("link updating");

};

viscomposer.ui.workflowWindow.linkUI.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.ui.workflowWindow.linkUI.prototype.constructor=viscomposer.ui.workflowWindow.linkUI;

viscomposer.ui.workflowWindow.linkUI.prototype.update = function()
{

    var that = this;
    var link = that.link;

    var start = link.port1;
    var end = link.port2;

    link.port2.ui.linkOn = true;
    link.port2.ui.update();

    var workflowUISelector = link.workflow.ui.elSelector;
    var offsetX = $(workflowUISelector).offset().left;
    var offsetY = $(workflowUISelector).offset().top;

    var portWidth = 14;
    var portHeigth = 14;

    if($(this.elSelector).length == 0)
    {

        var startX = $("#" + start.ui.uuid).children(".circle").offset().left - offsetX + portWidth/2;
        var startY = $("#" + start.ui.uuid).children(".circle").offset().top - offsetY + portHeigth/2;

        var endX = $("#" + end.ui.uuid).children(".circle").offset().left - offsetX + portWidth/2;
        var endY = $("#" + end.ui.uuid).children(".circle").offset().top - offsetY + portHeigth/2;

        var svg = d3.select(workflowUISelector + " svg");

        var s = [startX, startY];
        var s1 = [(startX+endX)/2, startY];
        var e1 = [(startX+endX)/2, endY];
        var e = [endX, endY];

        svg.append("g")
            .attr("class","link")
            .attr("id", that.uuid);

        var svgDom = d3.select("g#" + that.uuid);
        svgDom.append("path")
            .attr("class", "forevent")
            .attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1])
            .style("stroke", "black")
            .style("stroke-width", 30)
            .style("visibility", "hidden")
            .on("mouseover", function(){
                svgDom.select('.self').style("stroke-width", 2);
            }).on("mouseout", function(){
                svgDom.select('.self').style("stroke-width", 1);
            });

        svgDom.append("path")
            .attr("class", 'self')
            .attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1])
            .style("stroke", that.color)
            .style("stroke-width", 1)
            .style("stroke-dasharray", "3, 2")
            .style("fill", "none");

        if(link.port2.type == 'map') {
            svgDom.select(".forevent").on('mousedown', function () {
                if (d3.event.which == 3)//right click
                {
                    svgDom.select('.self').attr("class", "self highlight");
                    d3.event.stopPropagation();
                    var w = that.link.workflow;
                    var env = w.getEnv();
                    var scaleList = [];
                    var scalePoolDom = $("#mappingmenu > .scalepool > .submenu");
                    scalePoolDom.html("");
                    for (var key in env) {
                        if (env[key].type === 'scale') {
                            scaleList.push(env[key]);
                            scalePoolDom.append('<div>' + key + '</div>');
                        }
                    }
                    if (scaleList.length == 0) {
                        scalePoolDom.append('<div>none</div>');
                    }
                    scalePoolDom.children("div").on("click", function (ev) {
                        var scaleName = $(this).html();
                        var link = that.link;
                        var env = w.getEnv();
                        var port = env[scaleName];
                        var modifierModule = new viscomposer.workflow.ModifierModule(true, port.modifier);
                        modifierModule.label = scaleName;
                        modifierModule.mappingType = 'scale';
                        modifierModule.pos = [(startX + endX) / 2 - 148, (startY + endY) / 2 - 30];
                        var port1 = link.port1,
                            port2 = link.port2;
                        link.disconnect();
                        w.addModule(modifierModule);
                        w.addLink(port1, modifierModule.input[0]);
                        w.addLink(modifierModule.output[0], port2);
                        w.ui.update();
                        $("#mappingmenu").css("display", "none");
                        svgDom.select('.self').attr("class", "self");
                    });
                    $("body > #mappingmenu").css({
                        "left": event.clientX,
                        "top": event.clientY,
                        "display": "block"
                    });
                    var menucoverDom = $("body > .menucover");
                    menucoverDom.css("display", "block");
                    menucoverDom.unbind("click");
                    menucoverDom.on("click", function () {
                        $("body > .menu").css("display", "none");
                        $(this).css("display", "none");
                        svgDom.select('.self').attr("class", "self");
                    });
                    $("#mappingmenu > .new > div > div").unbind("click");
                    $("#mappingmenu > .new > div > div").on("click", function () {
                        viscomposer.app.disableRender();
                        var mappingType = $(this).attr("id");
                        var link = that.link;
                        var workflow = link.workflow;
                        var modifier = new viscomposer.app.moduleRegistry[mappingType](link.port1.varname, link.port2.varname);
                        var module = new viscomposer.workflow.ModifierModule(false, modifier);
                        module.mappingType = mappingType;
                        var menuDom = $("#mappingmenu");
                        var workflowDom = $(workflow.ui.elSelector + ' .content');
                        module.pos = [parseInt(menuDom.css("left")) - parseInt($(workflowDom).offset().left) , parseInt(menuDom.css("top")) - parseInt($(workflowDom).offset().top)];
                        $("body > #mappingmenu").css("display", "none");
                        menucoverDom.css("display", "none");
                        var port1 = link.port1,
                            port2 = link.port2;
                        link.disconnect();
                        workflow.addModule(module);
                        workflow.addLink(port1, module.input[0]);
                        workflow.addLink(module.output[0], port2);
                        workflow.ui.update();
                        svgDom.select('.self').attr("class", "self");
                        viscomposer.app.enableRender();
                        viscomposer.app.tryRender();
                    });
                }
            });
        }
    }
    else
    {
        var startX = $("#" + start.ui.uuid).children(".circle").offset().left - offsetX + portWidth/2;
        var startY = $("#" + start.ui.uuid).children(".circle").offset().top - offsetY + portHeigth/2;

        var endX = $("#" + end.ui.uuid).children(".circle").offset().left - offsetX + portWidth/2;
        var endY = $("#" + end.ui.uuid).children(".circle").offset().top - offsetY + portHeigth/2;

        var s = [startX, startY];
        var s1 = [(startX+endX)/2, startY];
        var e1 = [(startX+endX)/2, endY];
        var e = [endX, endY];


        var width, height, top, left;
        if(endX < startX)
        {
            left = endX;
        }
        else
        {
            left = startX;
        }
        if(endY < startY)
        {
            top = endY;
        }
        else
        {
            top = startY;
        }

        left+=10;
        width=Math.abs(endX - startX)-10*2;
        height=Math.abs(endY - startY);

        $(this.elSelector + ' path')
            .attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1]);

        $("#divforevents-" + that.uuid).css(
                {
                    "width": width,
                    "height": height,
                    "left": left,
                    "top": top
                });

    }

};

viscomposer.ui.workflowWindow.linkUI.prototype.createScalePanel = function(modifier, type){

    return new viscomposer.ui.workflowWindow.modifierPanel(modifier, this.link.workflow.ui, this.module, type);

};

viscomposer.ui.workflowWindow.linkUI.prototype.rightClickListener = function(){};