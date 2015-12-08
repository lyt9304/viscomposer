/**
 * Created by vag on 2015/7/22.
 */
viscomposer.ui.DataItemUI = (function(){

    var Item = viscomposer.VObject.define("DataItem",null,function(dataModule, window){
        this.module = dataModule;
        this.window = window;
        this.container = null;
        this.dom = null;
        this.uiInit();
        this.listener();
    });

    var prototype = Item.prototype;

    prototype.uiInit = function(){
        this.container = $("body > #resources > .content > #dataWindow > .content > .list");
        if(this.module.filetype == 'text/csv')
        {
            this.addCsvToWindow();
        }else{
            //TODO
        }
    };

    prototype.listener = function(){
        var dom = this.dom;
        var module = this.module;
        $(dom).on("dragstart", function(ev){
            return viscomposer.app.uiManager.dataItemDragstart(ev);
        });
        // 重命名数据
        $(dom).on("dblclick", '.filename', function(){
            var title = $(this).attr('title');
            $(this).html('<input type="text" value="' + title + '">');
            $(this).children("input").on("change", function(){
                var title = $(this).val();
                module.title = title;
                $(this).parents("span").html(title);
            });
        });
        // 可点击开csv的条目观察数据维度
        $(dom).on("click", '.switch', function(){
            var state = $(this).parents(".data").parents(".item").attr("data");
            if(state == 'close')
            {
                $(this).parents(".data").parents(".item").children(".attrs").css("display", "block");
                $(this).attr("src", "/images/shouqi.png");
                $(this).parents(".data").parents(".item").attr("data", "open");
            }
            else
            {
                $(this).parents(".data").parents(".item").children(".attrs").css("display", "none");
                $(this).attr("src", "/images/zhankai.png");
                $(this).parents(".data").parents(".item").attr("data", "close");
            }
        });
        // 可点击开csv的条目观察数据维度
        $(dom).on("click", '.preview', function(){
            //TODO
            alert('preview!');
        });
        //点击预览
        $(dom).on("click", '.delete', function(){
            //TODO
            alert('delete!');
        });
    };

    //添加Data的条目，csv需要有属性维度
    prototype.addCsvToWindow = function(){
        // 在Data区域中增加一条
        var module = this.module;
        var itemDom = this.dom = this.container.append(
            '<div type="data" draggable="true" class="item" data="close" id="' + this.uuid + '">' +
            '<div class="data">' +
                '<img src="/images/zhankai.png" class="switch">' +
                '<span class="filename" title="' + module.title + '">' + module.title.substr(0, 15) + '</span>' +
                '<img class="delete" src="/images/delete.png">' +
                '<img class="preview" src="/images/yulan.png">' +
                '</div>' +
                '<div class="attrs">' +
                '</div></div>');
        var key;
        for(var i = 0, ni = module.attributes.length; i < ni; i++)
        {
            key = module.attributes[i].label;
            $(itemDom).find(".attrs").append(
                '<div class="item" level="attr">' +
                '<img src="/images/dian.png">' +
                key +
                '<img class="delete structuralmanager" src="/images/delete.png">' +
                '</div>');
        }
    };
    return Item;

})();