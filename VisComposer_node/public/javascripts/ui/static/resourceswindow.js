/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.ResourcesWindow = (function() {

    //构造函数，初始化每个部分的根dom结点和成员变量
    var resourcesWindow = function(){
        this.dom = null;
        this.formList = {
            scatterplot: {
                title: 'ScatterPlot',
                painter: 'rect',
                imgUrl: '/images/element/form/ScatterPlot.png'
            },
        };
        this.primitiveList = {
            view: {
                title: 'Blank View',
                painter: 'rect',
                imgUrl: 'images/element/primitive/frame.png'
            },
            circle: {
                title: 'Circle',
                painter: 'circle',
                imgUrl: 'images/element/primitive/Circle.png'
            },
        };
        this.arrayList = {
            cartesian: {
                title: 'cartesian',
                painter: 'rect',
                imgUrl: '/images/element/array/Coordinates.png'
            },
        };
        this.formDom = null;
        this.primitiveDom = null;
        this.arrayDom = null;
        this.dataWindow = new viscomposer.ui.DataWindow();
        this.uiInit();
        this.listener();
    };

    var prototype = resourcesWindow.prototype;

    prototype.uiInit = function(){
        this.dom = $("#resources")[0];
        this.formDom = $(this.dom).find('#form')[0];
        this.primitiveDom = $(this.dom).find('#primitive')[0];
        this.arrayDom = $(this.dom).find('#array')[0];
        this.append(this.formDom, this.formList, 'form');
        this.append(this.primitiveDom, this.primitiveList, 'primitive');
        this.append(this.arrayDom, this.arrayList, 'array');
    };

    prototype.listener = function(){
        //图标的拖拽响应
        var dom = this.dom;
        $(dom).on("dragstart", "td > img", function(ev){
            return viscomposer.app.uiManager.resourceItemDragstart(ev);
        });
        $(dom).on("click", "td > img", function(ev){
            $(dom).find("td > img").removeClass('clicked');
            $(this).parents("td").addClass("clicked");
            return viscomposer.app.uiManager.resourceItemClick(ev);
        });
    };

    prototype.append = function(dom, list, category){
        var tableDom = $(dom).children(".content").children("table");
        tableDom.html('');
        var num = 0;
        var htmlStr = '';
        for(var key in list)
        {
            var item = list[key];
            if(num % 2 == 0)
            {
                htmlStr += '<tr>';
            }
            htmlStr += '<td><img draggable="true" src="' + item.imgUrl + '" title="'
                + item.title + '" category="' + category + '" type="' + key + '" painter="' + item.painter + '"></td>';
            if(num % 2 == 1)
            {
                htmlStr += '</tr>';
            }
            num++;
        }
        if(num % 2 != 0){
            htmlStr += '<td></td></tr>';
        }//不满偶数个的补一个空格
        tableDom.html(htmlStr);
    };

    return resourcesWindow;

})();