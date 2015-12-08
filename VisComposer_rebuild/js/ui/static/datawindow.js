viscomposer.ui.DataWindow=(function(){
	var _dataList = {};

    //_dataList[uuid]=dataItem(DataWindowItem)

	var DataWindow = function(){
		this.dom = $("body > #resources > .content > #dataWindow");
        this.listener();
	};

	var prototype = DataWindow.prototype;

    Object.defineProperty(prototype,"dataList",{
		get:function(){return _dataList;},
		set:function(x){
            for(var key in x){
                _dataList[key] = x[key];
            }
        }
	});

	prototype.update = function(){

	};

    prototype.listener = function(){
        var uiDom = this.dom;
        /*主窗口响应*/
        //add button click响应
        uiDom.on("click", ".content > .btn", function(){
            var dataimportingwindow = uiDom.find("#dataimportingwindow");
            var coverDom = uiDom.find(".cover");
            dataimportingwindow.css("display", "block");
            coverDom.css("display", "block");
            var recentDom = dataimportingwindow.find('.recent');
            recentDom.html('');
            recentDom.append('<div class="item" title="' + 'test1' + '"><span>' + 'test1' + '</span></div>');
            recentDom.append('<div class="item" title="' + 'test2' + '"><span>' + 'test2' + '</span></div>');
            recentDom.append('<div class="item" title="' + 'test3' + '"><span>' + 'test3' + '</span></div>');
        });
        /*导入数据窗口响应*/
        //载入最近使用数据
        uiDom.on("click", '#dataimportingwindow > .recent > .item span', function(){
            var fileName = $(this).html();
            //TODO
        });
        //关闭按钮响应
        uiDom.on("click", '#dataimportingwindow > .title > img', function(){
            uiDom.find("#dataimportingwindow").css("display", "none");
            uiDom.find(".cover").css("display", "none");
        });
        //从本地选择数据按钮相应：模仿隐藏的file input的click动作
        uiDom.on("click", '#dataimportingwindow > .select > .span', function(){
            uiDom.find("#file").click();
        });
        //读取本地文件
        uiDom.on("change", '#file', function(){
            var fakepath = $(this).val();
            var arr = fakepath.split('\\');
            var filename = arr[arr.length - 1];
            var filesNum = document.getElementById("file").files.length;
            var file = document.getElementById("file").files[filesNum - 1];
            var tempDataObj = new viscomposer.DataInfo();
            tempDataObj.title = filename;
            tempDataObj.original = true;
            tempDataObj.originalTitle = filename;
        });
    };

    prototype.staticListener=function(){

            var that=this;

            $("#file").on("change", function() {
                //读取本地文件
                var fakepath = $("#file").val();
                var arr = fakepath.split('\\');
                var filename = arr[arr.length - 1];
                var filesNum = document.getElementById("file").files.length;
                var file = document.getElementById("file").files[filesNum - 1];
                var tempDataObj = new viscomposer.DataInfo();
                tempDataObj.title = filename;
                tempDataObj.title = filename;
                tempDataObj.original = true;
                tempDataObj.originalTitle = filename;
                tempDataObj.readFile(file, function (me) {
                    $("#dataimportingwindow").css("display", "none");
                    //读完文件回调，如果是csv格式就用布局预览以及显示属性，但是json不需要

                    if (tempDataObj.filetype === 'csv') {
                        $("#datatypeselectwindow").css("display", "block");
                        viscomposer.util.centerWindow("#datatypeselectwindow > .window");
                        that.fillDatatypeselectwindow(tempDataObj);
                    }
                    else {
                        that.appendData(tempDataObj);
                    }
                    $("#file").val('');
                });
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

            $("#datatypeselectwindow .content .title img").on("click", function(){

                $("#datatypeselectwindow").css("display", "none");

            });

            $("#datatypeselectwindow .content .submit .cancel").on("click", function(){

                $("#datatypeselectwindow").css("display", "none");
                $("#dataimportingwindow").css("display", "block");

            });
        };


    //apendData做两件事情，一个是新建ui，另外一个是更新dataList
    prototype.appendData = function(dataObj){
        var dataItem = new viscomposer.ui.DataWindowItem(dataObj, this);
	    this.dataList[dataItem.uuid] = dataItem;
    };

    //更新预览内容
    prototype.fillDataPreviewWindow = function(dataObj){
        $("#datapreviewwindow").css("display","block");
        $("#datapreviewwindowcover").css("display","block");
        if( dataObj.attributes.length <= 4 ){
            var tmp_size = (58 + 250 * dataObj.attributes.length) + "px"; //guan 38-->58
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

        $("#datapreviewwindow-title").html(dataObj.title+"<img class='close' src='resource/image/icon/delete2.png'/>");//"<img class='close' src='resource/image/icon/delete2.png'/>"
        $("#datapreviewwindow-title img").on('click',function(){
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").css('display',"none");
            $("#datapreviewwindowcover").css("display","none");
        });

	};

    //csv使用SelectDataType，选择属性对应的类型
    prototype.fillDatatypeselectwindow = function(dataObj){
	    var that = this;

	    var tbody = $("#datatypeselectwindow > .content > .main > table tbody");

	    tbody.html('');

        //添加属性
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

	return DataWindow;

})();