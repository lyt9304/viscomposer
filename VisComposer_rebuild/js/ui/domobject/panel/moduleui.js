viscomposer.ui.ModuleUI=(function(){
	var ModuleUI=viscomposer.VObject.define("ModuleUI","DOMObject",function(module,workflow,options){
		options=options||{};

	    this.obj=module;
        this.workflowWindow=workflow;
        module.ui=this;
	    this.dom=null;
	    this.pos=options.pos||[300,50];
        //this.elSelector = '.module#' + this.uuid;
        //this.update();
	});

	var prototype=ModuleUI.prototype;

	prototype.update=function(){
        if(!this.dom){
        	this.createDOM();
        }

	    this.setPos();
	    this.adjustHeight();
	    this.updateInputPorts();
	    this.updateOutputPorts();

	    if(!($(this.dom).hasClass(this.obj.type))){
	         $(this.dom).addClass(this.obj.type);
	    }
	    //TODO
	};
	
	prototype.createDOM=function(){
        console.log("in moduleui createDom");
        this.elSelector=".module#"+this.uuid;
		var module=this.obj;
		//create dom
	    this.dom=$.parseHTML(
	    	'<div class="module data">' +
	            '<div class="title">' +
	            	'<span>' + module.label + '</span>' +
	            '</div>' +
	            '<div class="hr"></div>' +
		            '<div class="content" style="height: 100px;">' +
			            '<div class="inputs">' +
			            '</div>' +
			            '<div class="outputs">' +
				        '</div>' +
			        '</div>' +
		        '</div>' +
            '</div>');//TODO
		var dom=this.dom;

	    //add listeners
	    var that=this;

        $(dom).appendTo(this.workflowWindow.ui.container);

        //renameListener
        //$(that.elSelector + " .title span").on("dblclick", function(){
        //
        //    $(this).html('<input type="text" value="' + $(this).html() + '">');
        //
        //    $(this).children("input").on("change", function(){
        //
        //        var newLabel = $(this).val();
        //        that.module.label = newLabel;
        //        $(this).parents('span').html(newLabel);
        //        that.renameListener();
        //
        //    });
        //});

        $(dom).find('.title span').on("dblclick", function(){
            $(this).html('<input type="text" value="' + $(this).html() + '">');

            $(this).children("input").on("change", function(){
                var newLabel = $(this).val();
                that.module.label = newLabel;
                $(this).parents('span').html(newLabel);
                //that.renameListener();
            });
        });

        //dragableListener
        $(dom).draggable({

            containment: '.workflowWindow-sub#' + that.workflowWindow.uuid,
            drag: function(){

                that.module.pos = [$(that.elSelector).css("left"), $(that.elSelector).css("top")];
                that.workflowWindow.updateLinks();

            },
            stop: function(){

                that.module.pos = [$(that.elSelector).css("left"), $(that.elSelector).css("top")];
                that.workflowWindow.updateLinks();
                //console.log(that.module.pos);

            }

        });




        //mousedown
	    $(dom).mousedown(function(event, a){
	        event.stopPropagation();

	        if(event.which == 3 || a == 'right'){
	            $("body > .menu").css("display", "none");

	            $("#removemodulemenu").css({
	                "left": event.clientX,
	                "top": event.clientY,
	                "display": "block"
	            });

	            var menucoverDom = $("body > .menucover");
	            menucoverDom.css("display", "block");
	            menucoverDom.unbind("click");
	            menucoverDom.on("click", function(){
	                $("body > .menu").css("display", "none");
	                $(this).css("display", "none");
	            });
	        }
	        else if(event.which == 1){
	            $(".module").removeClass("module-clicked");
	            $(that.dom).addClass("module-clicked");
	        }
	    });
	};


    prototype.adjustHeight = function(){


        var content=$(this.dom).find(".content");
        var contentH=$(this.dom).find(".content").height();
        var inputH=$(this.dom).find(".inputs").height();
        var outputH=$(this.dom).find(".outputs").height();

        //if(that.module instanceof viscomposer.workflow.Scatterplot)
        //{
        //    //console.log($(that.elSelector).html(), contentH, inputH, outputH);
        //}

        var H = contentH;
        if(H < inputH)
        {
            H = inputH;
        }
        if(H < outputH)
        {
            H = outputH;
        }
        content.height(H);

    };

    prototype.setPos = function()
    {

        var that = this;

        var pos = that.obj.pos;

        $(this.dom).css({
            left: pos[0],
            top: pos[1]
        });

    };

    prototype.updateInputPorts = function(){

        var that = this;

        var input = that.obj.input;

        if(!input){return;}

        for(var i = 0; i < input.length; i++)
        {

            if(input[i].ui)
            {
                input[i].ui.update();
                //console.log("input updating");
            }
            else
            {
                input[i].ui=new viscomposer.ui.InputUI(that.elSelector + ' .inputs', input[i]);
            }

        }

        that.adjustHeight();

    };


    prototype.updateOutputPorts = function(){
        var that = this;

        var output = that.obj.output;

        if(!output){return;}

        for(var i = 0; i < output.length; i++)
        {

            if(output[i].ui)
            {
                output[i].ui.update();
                //console.log("output updating");
            }
            else
            {
                output[i].ui=new viscomposer.ui.OutputUI(that.elSelector + ' .outputs', output[i]);
            }

        }

        that.adjustHeight();
    };

	prototype.appendTo=function(parentDom){
		ModuleUI.basePrototype_.appendTo.call(this,parentDom);

		var that=this;
		var dom=this.dom;
	    $(dom).draggable({
	        containment: parentDom,
	        drag: function(){
	            that.obj.pos = [$(dom).css("left"), $(dom).css("top")];
	            //that.workflow.ui.updateLinks();
	        },
	        stop: function(){
	            that.obj.pos = [$(dom).css("left"), $(dom).css("top")];
	            //that.workflow.ui.updateLinks();
	            //console.log(that.obj.pos);
	        }
	    });
	};

	return ModuleUI;
})();