viscomposer.ui.DataWindow=(function(){

	var DataWindow = function(){
        this.dataList = {};
        this.dom = null;
        this.uiInit();
        this.listener();
	};

	var prototype = DataWindow.prototype;

    prototype.uiInit = function(){
        this.dom = $("#resources > .content > #dataWindow")[0];
    };

    prototype.listener = function(){
        var dom = this.dom;
        var tempDataObj = null;
        var that = this;
        /*主窗口响应*/
        //add button click响应
        $(dom).on("click", ".content > .btn", function(){
            var dataimportingwindow = $(dom).find("#dataimportingwindow");
            var coverDom = $(dom).find(".cover");
            dataimportingwindow.css("display", "block");
            coverDom.css("display", "block");
            //that.refreshRecentDom();
            var recentDom = $(dom).find("#dataimportingwindow > .recent");
            recentDom.html('');
            var fileList = that.getFileList();
            for(var i = 0, l = fileList.length; i < l; i++){
                recentDom.append('<div class="item" title="' + fileList[i] + '"><span>' + fileList[i] + '</span></div>');
            }
        });
        /*导入数据窗口响应*/
        //关闭按钮响应
        $(dom).on("click", '#dataimportingwindow > .title > img', function(){
            $(dom).find("#dataimportingwindow").css("display", "none");
            $(dom).find(".cover").css("display", "none");
        });
        //从本地选择数据按钮相应：模仿隐藏的file input的click动作
        $(dom).on("click", '#dataimportingwindow > .select > .span', function(){
            $(dom).find("#file").click();
        });
        //载入最近使用数据
        $(dom).on("click", '#dataimportingwindow > .recent > .item', function(){
            var fileName = $(this).attr("title");
            var json = $.parseJSON(that.getFile(fileName));
            tempDataObj = new viscomposer.DataInfo(json);
            $("#dataimportingwindow").css("display", "none");
            if(tempDataObj.filetype == 'text/csv'){
                $(dom).find("#datatypeselectwindow").css("display", "block");
                $(dom).find(".cover").css("display", "block");
                that.fillDatatypeselectwindow(tempDataObj);
            }else{
                that.appendData(tempDataObj);
            }
        });
        //上传本地文件dom
        $(dom).on("change", '#file', function(){
            $(dom).find("#uploadsubmit").click();
            var interval = setInterval(function(){
                var body = $($("iframe#dataiframe")[0].contentDocument.body);
                var content = body.html();
                if(content == ''){

                }else{
                    clearInterval(interval);
                    try{
                        result = content;
                    }catch(e){
                        alert(e);
                    }
                    if(content != 'Fail to load data'){
                        var json = $.parseJSON(content);
                        console.log(json);
                        tempDataObj = new viscomposer.DataInfo(json);
                        $("#dataimportingwindow").css("display", "none");
                        if(tempDataObj.filetype == 'text/csv'){
                            $(dom).find("#datatypeselectwindow").css("display", "block");
                            $(dom).find(".cover").css("display", "block");
                            that.fillDatatypeselectwindow(tempDataObj);
                        }else{
                            that.appendData(tempDataObj);
                        }
                    }else{
                        alert(content);
                    }
                    $(dom).find("#file").val('');
                    body.html('');
                }
            }, 500);
        });
        /*选择数据类型窗口响应*/
        $(dom).on("click", '#datatypeselectwindow > .submit > .cancel', function(){
            $(dom).find("#datatypeselectwindow").css("display", "none");
            $(dom).find("#dataimportingwindow").css("display", "block");
        });
        $(dom).on("click", '#datatypeselectwindow > .title > img', function(){
            $(dom).find("#datatypeselectwindow").css("display", "none");
            $(dom).find(".cover").css("display", "none");
        });
        $(dom).on("click", "#datatypeselectwindow > .submit > .confirm", function(){
            var types = [];
            var type, id;
            var attributes = tempDataObj.attributes;
            var tbody = $(dom).find("#datatypeselectwindow > .main > table tbody");
            $.each(tbody.find(".radiodiv.radiodiv-check"), function(){
                var thisDom = $(this);
                id = (thisDom.attr("id")).split("-")[1];
                type = thisDom.attr("value");
                types[id] = type;
                attributes[id].type = viscomposer.Attribute.TYPE[type];
            });
            that.appendData(tempDataObj);
            $("#datatypeselectwindow").css("display", "none");
            $(dom).find(".cover").css("display", "none");
        });

    };

    //apendData做两件事情，一个是新建ui，另外一个是更新dataList
    prototype.appendData = function(dataObj){
        var dataItem = new viscomposer.ui.DataItemUI(dataObj, this);
	    this.dataList[dataItem.uuid] = dataItem;
    };

    //获取服务器文件列表
    prototype.getFileList = function(){
        var res;
        $.ajax({
            type: 'GET',
            async: false, //此处需用同步
            url: '/uploadfile/list',
            success: function(data){
                console.log(data);
                res = data;
            },
            error: function(){
                res = null;
            },
        });
        return res;
    };

    //获取服务器上某个特定文件
    prototype.getFile = function(fileName){
        var res;
        $.ajax({
            type: 'GET',
            async: false, //此处需用同步
            url: '/uploadfile/list/' + encodeURIComponent(fileName),
            success: function(data){
                res = data;
            },
            error: function(){
                res = null
            },
        });
        return res;
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

        $("#datapreviewwindow-title").html(dataObj.title+"<img class='close' src='/images/icon/delete2.png'/>");//"<img class='close' src='/images/icon/delete2.png'/>"
        $("#datapreviewwindow-title img").on('click',function(){
            $("#datapreviewwindow").html('');
            $("#datapreviewwindow").css('display',"none");s
            $("#datapreviewwindowcover").css("display","none");
        });

	};

    //csv使用SelectDataType，选择属性对应的类型
    prototype.fillDatatypeselectwindow = function(dataObj){
        var dom = this.dom;
	    var tbody = $(dom).find("#datatypeselectwindow > .main > table tbody");
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
	    tbody.find("tr.attr .radiodiv").on("click", function(){
	        var id = ($(this).attr("id")).split("-")[1];
	        $("tr.attr #radiodiv-" + id).removeClass("radiodiv-check");
	        $(this).addClass("radiodiv-check");
	    });
	};

	return DataWindow;

})();