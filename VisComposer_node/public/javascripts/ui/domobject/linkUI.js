/**
 * Created by vag on 2015/3/15.
 */
viscomposer.ui.LinkUI = (function(){
    var linkUI = viscomposer.VObject.define("LinkUI", "DOMObject", function(link){
        this.link = link;
        link.ui = this;
        if(link.port2.type == "map"){
            this.color = 'red';
        }else{
            this.color = 'black';
        }
        this.dom = null;
        this.uiInit();
        this.listener();
        this.update();
    });

    var prototype = linkUI.prototype;

    prototype.uiInit = function(){
        var link = this.link;
        var workflow = link.workflow;
        var workflowUI = workflow.ui;
        var offsetX = $(workflowUI.dom).offset().left;
        var offsetY = $(workflowUI.dom).offset().top;
        var portWidth = 14;
        var portHeigth = 14;

        var port1 = link.port1;
        var port2 = link.port2;
        var port1UI = port1.ui;
        var port2UI = port2.ui;
        var startX = $(port1UI.dom).find('.circle').offset().left - offsetX + portWidth/2;
        var startY = $(port1UI.dom).find('.circle').offset().top - offsetY + portHeigth/2;
        var endX = $(port2UI.dom).find('.circle').offset().left - offsetX + portWidth/2;
        var endY = $(port2UI.dom).find('.circle').offset().top - offsetY + portHeigth/2;

        var svg = $(workflowUI.dom).find("svg")[0];
        var s = [startX, startY];
        var s1 = [(startX + endX) / 2, startY];
        var e1 = [(startX + endX) / 2, endY];
        var e = [endX, endY];

        var g = d3.select(svg).append("g")
            .attr("class","link")
            .attr("id", this.uuid);
        g.append("path")
            .attr("class", "forevent")
            .attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1])
            .style("stroke", "black")
            .style("stroke-width", 30)
            .style("visibility", "hidden")
            .on("mouseover", function(){
                g.select('.self').style("stroke-width", 2);
            }).on("mouseout", function(){
                g.select('.self').style("stroke-width", 1);
            });
        g.append("path")
            .attr("class", 'self')
            .attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1])
            .style("stroke", this.color)
            .style("stroke-width", 1)
            .style("stroke-dasharray", "3, 2")
            .style("fill", "none");

        this.dom = $("#" + this.uuid);

    };

    prototype.listener = function(){

    };

    prototype.update = function(){
        var link = this.link;
        var workflow = link.workflow;
        var workflowUI = workflow.ui;
        var offsetX = $(workflowUI.dom).offset().left;
        var offsetY = $(workflowUI.dom).offset().top;
        var portWidth = 14;
        var portHeigth = 14;

        var port1 = link.port1;
        var port2 = link.port2;
        var port1UI = port1.ui;
        var port2UI = port2.ui;
        var startX = $(port1UI.dom).find('.circle').offset().left - offsetX + portWidth/2;
        var startY = $(port1UI.dom).find('.circle').offset().top - offsetY + portHeigth/2;
        var endX = $(port2UI.dom).find('.circle').offset().left - offsetX + portWidth/2;
        var endY = $(port2UI.dom).find('.circle').offset().top - offsetY + portHeigth/2;

        var svg = $(workflowUI.dom).find("svg")[0];
        var s = [startX, startY];
        var s1 = [(startX + endX) / 2, startY];
        var e1 = [(startX + endX) / 2, endY];
        var e = [endX, endY];
        d3.select($(this.dom).find('.forevent')[0]).attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1]);
        d3.select($(this.dom).find('.self')[0]).attr("d", "M " + s[0] + " " + s[1] + " C " + s1[0] + " " + s1[1] + " " + e1[0] + " " + e1[1] + " " + e[0] + " " + e[1]);
    };

    return linkUI;

})();


