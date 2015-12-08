/**
 * Created by vag on 2015/3/16.
 */
viscomposer.ui.workflowWindow.customPanel = function(customModule, workflowWindow){

    viscomposer.ui.workflowWindow.panel.call(this, customModule, workflowWindow);

    this.productive = true;

    this.update();
//    console.log("panel updating");

    this.addClickListener();

};

viscomposer.ui.workflowWindow.customPanel.prototype=Object.create(viscomposer.ui.workflowWindow.panel.prototype);
viscomposer.ui.workflowWindow.customPanel.prototype.constructor=viscomposer.ui.workflowWindow.customPanel;

viscomposer.ui.workflowWindow.customPanel.prototype.update = function(){

    viscomposer.ui.workflowWindow.panel.prototype.update.call(this);

    var inputs = this.module.input;
    for(var i = 0; i < inputs.length; i++)
    {
        var input = inputs[i];
        var inputUI = input.ui;
        inputUI.linkOn = true;
        inputUI.update();
    }

    this.updateCodeWindow();

};

viscomposer.ui.workflowWindow.customPanel.prototype.createDom = function(){

    var that = this;

    var module = that.module;

    $(".workflowWindow-sub#" + that.workflowWindow.uuid + ' > .content').append(
        '<div class="module custom" id="' + that.uuid +  '">' +
        '<div class="title">' +
        '<span>' + that.module.label + '</span>' +
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
    editor.setValue(that.module.properties.functionStr);

    that.editor = editor;


    $('.codearea#codearea-' + that.uuid + ' .codesubmit').on("click", function(){

        var val = that.editor.getValue();
        //console.log(val);
        that.module.properties.functionStr = val;
        that.module.submit();
        $('.codearea#codearea-' + that.uuid).css("display", "none");
//        $(that.elSelector).draggable("enable");

    });

    $('.codearea#codearea-' + that.uuid + ' .preview').on("click", function(){

        var val = that.editor.getValue();
        //console.log(val);
        that.module.properties.functionStr = val;
        that.module.submit();

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
            that.module.properties.functionStr = content;
            editor.setValue(that.module.properties.functionStr);
        }

    });

};

viscomposer.ui.workflowWindow.customPanel.prototype.createInputPort = function(port){

    var that = this;

    var panel = new viscomposer.ui.workflowWindow.input(that.elSelector + ' .inputs .ports', port);

    return panel;

};

viscomposer.ui.workflowWindow.customPanel.prototype.createOutputPort = function(port){

    var that = this;

    var panel = new viscomposer.ui.workflowWindow.output(that.elSelector + ' .outputs .ports', port);

    return panel;

};

viscomposer.ui.workflowWindow.customPanel.prototype.addClickListener = function(){

    var that = this;
    var module=this.module;

    $(that.elSelector + ' .inputs .btn img').on("click", function(){
        module.addInputPort();
        that.update();
    });

    $(that.elSelector + ' .outputs .btn img').on("click", function(){
        module.addOutputPort();
        that.update();
    });

};

viscomposer.ui.workflowWindow.customPanel.prototype.updateCodeWindow = function(){
    //fill in inputs
    var inputs = this.module.input;
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
    var outputs = this.module.output;
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
    var workflow = this.module.workflow;
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
