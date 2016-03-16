/**
 * Created by vag on 2015/3/10.
 */

viscomposer.ui.dataWindow.item = function(dataModule, window){

    viscomposer.Object.call(this);
    this.module = dataModule;
    this.window = window;

    if(dataModule.filetype == 'csv')
    {
        this.addCsvToWindow();
    }else if(dataModule.filetype == 'json')
    {
        this.addJsonToWindow();
    }


};

viscomposer.ui.dataWindow.item.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.ui.dataWindow.item.prototype.constructor=viscomposer.ui.dataWindow.item;

viscomposer.ui.dataWindow.item.prototype.addCsvToWindow = function(){

    var that = this;
    var dataModule = this.module;
    $('#dataWindow > .content > .list').append(
        '<div type="data" draggable="true" ondragstart="viscomposer.app.ui.dragstart(event)" class="item" id="' + dataModule.uuid + '" data="close">' +
        '<div class="item-data">' +
            '<img src="resource/image/zhankai.png" class="switch">' +
            '<span>' + dataModule.title + '</span>' +
            '<img class="delete" src="resource/image/delete.png">' +
            '<img class="preview" src="resource/image/yulan.png">' +
            '</div>' +
            '<div class="item-attrs">' +
            '</div></div>');
    $("#" + dataModule.uuid + " span").on("dblclick", function(){
        var title = $(this).html();
        $(this).html('<input type="text" value="' + title + '">');
        $(this).children("input").on("change", function(){
            var title = $(this).val();
            var uuid = $(this).parents("span").parents(".item-data").parents(".item").attr("id");
            var dataObj = viscomposer.Object.hashmap.get(uuid);
            dataObj.title = title;
            $(this).parents("span").html(title);
        });
    });
    var key;
    for(var i = 0; i < dataModule.attributes.length; i++)
    {
        key = dataModule.attributes[i].label;
        $("#" + dataModule.uuid + " .item-attrs").append(
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
    });
};

viscomposer.ui.dataWindow.item.prototype.addJsonToWindow = function(){
    var dataModule = this.module;
    var that = this;
    $('#dataWindow > .content > .list').append(
        '<div type="data" draggable="true" ondragstart="viscomposer.app.ui.dragstart(event)" class="item" id="' + dataModule.uuid + '" data="close">' +
        '<div class="item-data">' +
        '<img src="resource/image/zhankai.png" class="switch">' +
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
        //that.window.fillDataPreviewWindow(dataModule);
        var string = dataModule.fileContent;
        var str = string.replace(/\n/ig,"<br/>");
        var str = str.replace(/ /ig,"&nbsp&nbsp&nbsp");
        console.log(str); 
        $("#datapreviewwindow-content-long").append("<div>" + str + "</div>");
        $("#datapreviewwindow-title").append(dataModule.originalTitle);
        console.log(dataModule);
    });
};