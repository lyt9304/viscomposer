/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.DataWindowItem = (function(){

    //dataModule=dataObj
    //window=dataWindow

    var Item = viscomposer.VObject.define("Item",null,function(dataModule, window){
        this.module = dataModule;
        this.window = window;
        if(dataModule.filetype == 'csv')
        {
            this.addCsvToWindow();
        }else if(dataModule.filetype == 'json')
        {
            this.addJsonToWindow();
        }
    });

    var prototype = Item.prototype;

    prototype.init = function(){};

    prototype.update = function(){};

    //添加Data的条目，csv需要有属性维度
    //TODO:删除条目
    prototype.addCsvToWindow = function(){
        var datalistDom=$('#dataWindow > .content > .list');
        var that = this;
        var dataModule = this.module;
        //guan 在Data区域中增加一条
        var itemDom=this.dom=datalistDom.append(
            '<div type="data" draggable="true" ondragstart="viscomposer.app.uiManager.dragstart(event)" class="item" data="close" id="'+this.uuid+'">' +
            '<div class="item-data">' +
                '<img src="resource/image/zhankai.png" class="switch">' +
                '<span>' + dataModule.title + '</span>' +
                '<img class="delete" src="resource/image/delete.png">' +
                '<img class="preview" src="resource/image/yulan.png">' +
                '</div>' +
                '<div class="item-attrs">' +
                '</div></div>');
        // 重命名数据
        $(itemDom).find(" span").on("dblclick", function(){
            var title = $(this).html();
            $(this).html('<input type="text" value="' + title + '">');
            $(this).children("input").on("change", function(){
                var title = $(this).val();
                dataModule.title = title;
                $(this).parents("span").html(title);
            });
        });

        // 可点击开csv的条目观察数据维度
        var key;
        for(var i = 0, ni = dataModule.attributes.length; i < ni; i++)
        {
            key = dataModule.attributes[i].label;
            $(itemDom).find(".item-attrs").append(
                '<div class="item-attrs-item" level="attr">' +
                '<img src="resource/image/dian.png">' +
                key +
                '<img class="delete structuralmanager" src="resource/image/delete.png">' +
                '</div>');
        }
        $("#dataWindow > .content > .list > .item > .item-data .switch").on("click", function(){
            var state = $(this).parents(".item-data").parents(".item").attr("data");
            if(state == 'close')
            {
                $(this).parents(".item-data").parents(".item").children(".item-attrs").css("display", "block");
                $(this).attr("src", "resource/image/shouqi.png");
                $(this).parents(".item-data").parents(".item").attr("data", "open");
            }
            else
            {
                $(this).parents(".item-data").parents(".item").children(".item-attrs").css("display", "none");
                $(this).attr("src", "resource/image/zhankai.png");
                $(this).parents(".item-data").parents(".item").attr("data", "close");
            }
        });

        //点击预览
        $("#dataWindow > .content > .list .item-data .preview").on("click", function(){
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").append("<div id='datapreviewwindow-title'></div>");
            $("#datapreviewwindow").append("<div id='datapreviewwindow-content'></div>");
            $("#datapreviewwindow-content").append("<div id='datapreviewwindow-content-long'></div>")
            $("#datapreviewwindow-content-long").append("<img src='resource/image/icon/backtotop.png'>")
            $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table1'>" +
                "<tr id='datapreviewwindow-header'></tr>" +
                "</table>");
            $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table2'></table>");
            $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table3'></table>");
            that.window.fillDataPreviewWindow(dataModule);
            //console.log(dataModule.data.length);
        });
    };

    prototype.addJsonToWindow = function(){
        var dataModule = this.module;
        var that = this;
        $('#dataWindow > .content > .list').append(
            '<div type="data" draggable="true" ondragstart="viscomposer.app.uiManager.dragstart(event)" class="item" data="close" id="'+this.uuid+'">' +
            '<div class="item-data">' +
            '<img src="resource/image/dian.png" class="switch">' +
            '<span>' + dataModule.title + '</span>' +
            '<img class="delete" src="resource/image/delete.png">' +
            '<img class="preview" src="resource/image/yulan.png">' +
            '</div>' +
            '<div class="item-attrs">' +
            '</div></div>');
        $("#dataWindow > .content > .list .item-data .preview").on("click", function(){
            $("#datapreviewwindow").css("display","block");
            $("#datapreviewwindowcover").css("display","block");
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").append("<div id='datapreviewwindow-title'></div>");
            $("#datapreviewwindow").append("<div id='datapreviewwindow-content'></div>");
            $("#datapreviewwindow-content").append("<div id='datapreviewwindow-content-long'></div>")
            // $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table1'>" +
            //     "<tr id='datapreviewwindow-header'></tr>" +
            //     "</table>");
            // $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table2'></table>");
            // $("#datapreviewwindow-content-long").append("<table id='datapreviewwindow-content-table3'></table>");
            // that.window.fillDataPreviewWindow(dataModule);
            $("#datapreviewwindow-title").append(dataModule.originalTitle+"<img class='close' src='resource/image/icon/delete2.png'/>");
            $("#datapreviewwindow-title img").on('click',function(){
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").css('display',"none");
            $("#datapreviewwindowcover").css("display","none");
            });

            var string = dataModule.fileContent;
            var str = string.replace(/\n/ig,"<br/>");
            var str = str.replace(/ /ig,"&nbsp&nbsp&nbsp");
            $("#datapreviewwindow-content-long").append("<div>" + str + "</div>");


            console.log(dataModule.fileContent);
        });
    };

    return Item;

})();