/**
 * Created by vag on 2015/3/2.
 */

viscomposer.ui.dataWindow = function(){

    var that = this;

    viscomposer.Object.call(this);
    //增加数据按钮响应
    $("#dataWindow-add").on("click", function(){

        $("#dataimportingwindow").css("display", "block");

    });

    $("#datatypeselectwindow .content .title img").on("click", function(){

        $("#datatypeselectwindow").css("display", "none");

    });

    $("#datatypeselectwindow .content .submit .cancel").on("click", function(){

        $("#datatypeselectwindow").css("display", "none");
        $("#dataimportingwindow").css("display", "block");

    });

    //关闭数据导入窗口按钮响应
    $("#dataimportingwindow-content-title .close").on("click", function(){

        $("#dataimportingwindow").css("display", "none");

    });

    //选择数据按钮响应
    $("#dataimportingwindow-content-select .btn").on("click", function(){

        $("#file").click();

    });
    //选择数据按钮响应
    $("#dataimportingwindow-content-select .span").on("click", function(){

        $("#file").click();

    });


    //选择本地数据后的响应
    $("#file").on("change", function(){

        var fakepath = $("#file").val();
        var arr = fakepath.split('\\');
        var filename = arr[arr.length - 1];
        var filesNum = document.getElementById("file").files.length;
        var file = document.getElementById("file").files[filesNum-1];

        var tempDataObj=new viscomposer.DataInfo();
        tempDataObj.title = filename;
        tempDataObj.original=true;
        tempDataObj.originalTitle = filename;

        tempDataObj.readFile(file,function(me){
            $("#dataimportingwindow").css("display", "none");
            if(tempDataObj.filetype === 'csv')
            {
                $("#datatypeselectwindow").css("display", "block");
                that.fillDatatypeselectwindow(tempDataObj);
            }
            else
            {
                that.appendData(tempDataObj);
            }

            $("#file").val('');

        });

    });

};

viscomposer.ui.dataWindow.prototype = Object.create(viscomposer.Object.prototype);
viscomposer.ui.dataWindow.prototype.constructor = viscomposer.ui.dataWindow;
viscomposer.ui.dataWindow.prototype.datalist = {};

viscomposer.ui.dataWindow.prototype.appendData = function(dataObj){

    var that = this;

    var dataItem = new viscomposer.ui.dataWindow.item(dataObj, that);
    that.datalist[dataItem.uuid] = dataItem;

};

viscomposer.ui.dataWindow.prototype.fillDataPreviewWindow = function(dataObj)
{
        $("#datapreviewwindow").css("display","block");
        $("#datapreviewwindowcover").css("display","block");
        if( dataObj.attributes.length <= 4 ){
            var tmp_size = (48 + 250 * dataObj.attributes.length) + "px";
            $("#datapreviewwindow").css("width",tmp_size);
            $("#datapreviewwindow").css('left', function(){
                return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
             });
        }
        else{
            $("#datapreviewwindow").css('left', function(){
                return (parseFloat($(window).width()) - parseFloat($(this).width())) / 2;
             });
            $("#datapreviewwindow").css("width","1035px");
        }
        if( dataObj.data.length < 20){
            var tmp_height = (80 + 25 * dataObj.data.length) + "px";
            $("#datapreviewwindow").css("height",tmp_height);
        }
        else{
            $("#datapreviewwindow").css("height","585px");
        }
        var content = dataObj.data;
        var keys = Object.keys(dataObj.data[0]);
        for(var j = 0;j < keys.length;j++){
            $("#datapreviewwindow-header").append(
            '<td>' +
                keys[j]+
            '</td>');
        }

        $("#datapreviewwindow table").css({"cellspacing":"0","cellspadding":"0"});

        for(var i = 0; i < dataObj.data.length; i++){

            $("#datapreviewwindow-content-table2").append("<tr id='datapreviewwindow-content-table2-" + i + "'></tr>");
            $("#datapreviewwindow-content-table2-" + i).append("<td>" + i + "</td>");
            $("#datapreviewwindow-content-table3").append("<tr id='datapreviewwindow-content-table3-" + i + "'></tr>");

            for(var j = 0;j < keys.length;j++){
                $("#datapreviewwindow-content-table3-" + i).append("<td class='datapreviewwindow-content-table3-unchosen'>" +
                    content[i][keys[j]] +
                    "</td>")
            }

        }
        
        $("#datapreviewwindow-title").html(dataObj.title + "<img class='close' src='resource/image/icon/delete2.png'/>");
        $("#datapreviewwindow-title img").on('click',function(){
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").css('display',"none");
            $("#datapreviewwindowcover").css("display","none");
        });

};
viscomposer.ui.dataWindow.prototype.fillDatatypeselectwindow = function(dataObj)
{

    var that = this;

    var tbody = $("#datatypeselectwindow > .content > .main > table tbody");

    tbody.html('');

    var attributes = dataObj.attributes;
    var key;
    for(var i = 0; i < attributes.length; i++)
    {
        key = attributes[i].label;



        tbody.append('<tr class="attr"><td class="col1">' + key + '</td>' +
            '<td><div id="radiodiv-' + i + '" class="radiodiv" value="unknown"></div></td>' +
            '<td><div id="radiodiv-' + i + '" class="radiodiv" value="categorical"></div></td>' +
            '<td><div id="radiodiv-' + i + '" class="radiodiv" value="quantitative"></div></td>' +
            '<td><div id="radiodiv-' + i + '" class="radiodiv" value="ordinal"></div></td></tr>');
        $("#radiodiv-" + i + '[value="' + attributes[i].type.label + '"]').addClass("radiodiv-check");
    }

    $("tr.attr .radiodiv").on("click", function(){

        var id = ($(this).attr("id")).split("-")[1];
        $("tr.attr #radiodiv-" + id).removeClass("radiodiv-check");
        $(this).addClass("radiodiv-check");

    });

    $("#datatypeselectwindow .content .submit .confirm").unbind("click");
    $("#datatypeselectwindow .content .submit .confirm").on("click", function(){

        var types = [];
        var type, id;

        $.each($(".radiodiv.radiodiv-check"), function(){

            var thisDom = $(this);
            id = (thisDom.attr("id")).split("-")[1];
            type = thisDom.attr("value");
            types[id] = type;

            attributes[id].type=viscomposer.Attribute.TYPE[type];

        });

        that.appendData(dataObj);
        $("#datatypeselectwindow").css("display", "none");

    });

};


