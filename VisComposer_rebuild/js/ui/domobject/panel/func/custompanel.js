/**
 * Created by lyt9304 on 15/7/30.
 */

viscomposer.ui.CustomPanelUI= (function(){
    var CustomPanelUI=viscomposer.VObject.define("CustomPanelUI","ModuleUI",function(Module, workflowWindow){

            this.productive = true;

            this.update();

            this.addClickListener();

        }
    );

    var prototype=CustomPanelUI.prototype;

    prototype.update = function(){

        this.elSelector = '.module#' + this.uuid;

        viscomposer.ui.ModuleUI.prototype.update.apply(this);

        var inputs = this.obj.input;
        for(var i = 0; i < inputs.length; i++)
        {
            var input = inputs[i];
            var inputUI = input.ui;
            inputUI.linkOn = true;
            inputUI.update();
        }

        this.updateCodeWindow();

    };

    prototype.createDom = function(){

        var that = this;

        var module = this.obj;

        $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
            '<div class="module custom" id="' + that.uuid +  '">' +
            '<div class="title">' +
            '<span>' + that.obj.label + '</span>' +
            '</div>' +
            '<div class="hr"></div>' +
            '<div class="content">' +
            '<div class="inputs">' +
            '<div class="ports">' +
            '</div>' +
            '<div class="btn"><img src="resource/image/addport.png"></div>' +
            '</div>' +
            '<div class="outputs">' +
            '<div class="ports">' +
            '</div>' +
            '<div class="btn"><img src="resource/image/addport.png"></div>' +
            '</div>' +
            '<div class="submit">coding</div>' +
            '</div>' +
            '</div>'+
            '<div class="codearea" id="codearea-' + that.uuid + '">' +
            '<div class="codetitle">' +
            '<img class="add" src="resource/image/icon/add.png">' +
            '<input type="file" id="scriptfile" style="display:none;"/>' +
            'custom coding' +
            '<img class="close" src="resource/image/icon/delete2.png"></div>' +
            '<div class="content">' +
            '<div class="codevariable">Available variables:<span></span></div>' +
            '<div class="inputlist">Input(s): <span></span></div>' +
            '<div class="outputlist">Output(s): <span></span></div>' +
            '<div class="code"><textarea></textarea></div>' +
            '<div class="hr"></div>' +
            '<div class="btns">' +
            '<div class="codesubmit">OK</div>' +
            '<div class="preview">Preview</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.codearea#codearea-' + that.uuid).draggable({
            handle: '.codetitle'
        });

        that.updateCodeWindow();

        $(that.elSelector + ' .content .submit').on("click", function(ev){

            $('.codearea#codearea-' + that.uuid).css({
                display:"block",
                left: ev.clientX,
                top: ev.clientY,
            });
            setTimeout(function() {
                that.editor.refresh();
            },1);
        });

        var editor = CodeMirror.fromTextArea($('.codearea#codearea-' + that.uuid + ' textarea')[0], {

            lineNumbers: true, //是否显示行数
            mode: "text/javascript",

        });

        editor.setSize("100%", "100%");
        editor.setValue(that.obj.properties.functionStr);

        that.editor = editor;


        $('.codearea#codearea-' + that.uuid + ' .codesubmit').on("click", function(){

            var val = that.editor.getValue();
            //console.log(val);
            that.obj.properties.functionStr = val;
            that.obj.submit();
            $('.codearea#codearea-' + that.uuid).css("display", "none");
//        $(that.elSelector).draggable("enable");

        });

        $('.codearea#codearea-' + that.uuid + ' .preview').on("click", function(){

            var val = that.editor.getValue();
            //console.log(val);
            that.obj.properties.functionStr = val;
            that.obj.submit();

        });

        $('.codearea#codearea-' + that.uuid + " .close").on("click", function(){

            $('.codearea#codearea-' + that.uuid).css("display", "none");
//        $(that.elSelector).draggable("enable");

        });
        $('.codearea#codearea-' + that.uuid + " .add").on("click", function(){
            $("#scriptfile").click();
        });
        $("#scriptfile").on("change", function(){

            var fakepath = $("#scriptfile").val();
            var arr = fakepath.split('\\');
            var filename = arr[arr.length - 1];
            var filesNum = document.getElementById("scriptfile").files.length;
            var file = document.getElementById("scriptfile").files[filesNum-1];

            var fileReader = new FileReader();
            fileReader.readAsText(file);
            var me=this;
            fileReader.onload=function(){
                var content = this.result;
                that.obj.properties.functionStr = content;
                editor.setValue(that.obj.properties.functionStr);
            }

        });

    };

    CustomPanelUI.prototype.createInputPort = function(port){

        var that = this;

        var panel = new viscomposer.ui.workflowWindow.input(that.elSelector + ' .inputs .ports', port);

        return panel;

    };

    prototype.createOutputPort = function(port){

        var that = this;

        var panel = new viscomposer.ui.workflowWindow.output(that.elSelector + ' .outputs .ports', port);

        return panel;

    };

    prototype.addClickListener = function(){

        var that = this;
        var module=this.obj;

        $(that.elSelector + ' .inputs .btn img').on("click", function(){
            module.addInputPort();
            that.update();
        });

        $(that.elSelector + ' .outputs .btn img').on("click", function(){
            module.addOutputPort();
            that.update();
        });

    };

    prototype.updateCodeWindow = function(){
        //fill in inputs
        var inputs = this.obj.input;
        var inputliststr = '';
        for(var i = 0; i < inputs.length; i++)
        {
            inputliststr += "<span>" + inputs[i].label + "</span>\n";
        }
        if(inputs.length == 0)
        {
            inputliststr = 'None.'
        }
        $('.codearea#codearea-' + this.uuid + ' .inputlist span').html(inputliststr);

        //fill in outputs
        var outputs = this.obj.output;
        var outputliststr = '';
        for(var i = 0; i < outputs.length; i++)
        {
            outputliststr += "<span>" + outputs[i].label + "</span>\n";
        }
        if(outputs.length == 0)
        {
            outputliststr = 'None'
        }
        $('.codearea#codearea-' + this.uuid + ' .outputlist span').html(outputliststr);

        //fill in variables;
        var workflow = this.obj.workflow;
        var layoutVars = workflow.layoutModule&&workflow.layoutModule.layoutLabels||[];
        var varsStr = '';
        for(var i = 0; i < layoutVars.length; i++)
        {
            varsStr += "<span>" + layoutVars[i][0] + "</span>\n";
        }
        if(layoutVars.length == 0)
        {
            varsStr = 'None.'
        }
        $('.codearea#codearea-' + this.uuid + ' .codevariable span').html(varsStr);
    };
    

    return CustomPanelUI;
})();



