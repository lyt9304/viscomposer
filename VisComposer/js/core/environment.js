viscomposer.Environment={
	build:function(){

		// useful functions
		var min=function(){
			var min=arguments[0];
			for(var i=1,ni=arguments.length;i<ni;++i){
				if(arguments[i]<min){min=arguments[i];}
			}
			return min;
		};

		var max=function(){
			var max=arguments[0];
			for(var i=1,ni=arguments.length;i<ni;++i){
				if(arguments[i]>max){max=arguments[i];}
			}
			return max;
		};

		var getColName=function(data,col){
			if(data instanceof Array){
				data=data[0];
			}
			for(var key in data){
				if(col==0){return key;}
				--col;
			}
			return null;
		};

		var getCol=function(data,col){
			if(typeof(col)==='number'){
				col=getColName(data,col);
			}
			if(data instanceof Array){
				var output=[];
				for(var i=0,ni=data.length;i<ni;++i){
					var tmp;
					if(tmp=data[i][col]){
						output.push(tmp);
					}
				}
				return output;
			}else{
				return data[col];
			}
		};

		var getDimensionNum=function(data){
			if(data instanceof Array){
				data=data[0];
			}
			var cnt=0;
			for(var key in data){
				++cnt;
			}
			return cnt;
		};

		var getMinMax=function(data,col,padding){
			if(col==undefined){
				var tmp=parseFloat(data[0]);
				var min=tmp,max=tmp;
				for(var i=1,ni=data.length;i<ni;++i){
					tmp=parseFloat(data[i]);
					if(tmp<min){min=tmp;}
					if(tmp>max){max=tmp;}
				}
			}else{
				if(typeof(col)==='number'){
					col=getColName(data,col);
				}
				var tmp=parseFloat(data[0][col]);
				var min=tmp,max=tmp;
				for(var i=1,ni=data.length;i<ni;++i){
					tmp=parseFloat(data[i][col]);
					if(tmp<min){min=tmp;}
					if(tmp>max){max=tmp;}
				}
			}
			if(padding){
				var range=max-min;
				return [min-range*padding,max+range*padding];
			}else{
				return [min,max];
			}
		};

		var getValueSet=function(data,col){
			var valueSet_={};
			var valueSet=[];
			if(col==undefined){
				for(var i=0,ni=data.length;i<ni;++i){
					if(valueSet_[data[i]]===undefined){
						valueSet_[data[i]]=true;
						valueSet.push(data[i]);
					}
				}
			}else{
				if(typeof(col)==='number'){
					col=getColName(data,col);
				}
				for(var i=0,ni=data.length;i<ni;++i){
					if(valueSet_[data[i][col]]===undefined){
						valueSet_[data[i][col]]=true;
						valueSet.push(data[i][col]);
					}
				}
			}
			return valueSet;
		};

		//
		var self=function(index){
			index=index||i;
			return transform[index];
		}

		var layout=function(index){
			index=index||i;
			var layout=env.layout;
			//var ret={};
			var ret={
				x:0,y:0,
				width:1,height:1,
				index:[index],
				num:1,
			}
			if(layout){
				for(var key in layout){
					if(layout[key] instanceof Array&&layout[key].length>index){
						ret[key]=layout[key][index];
					}else{
						ret[key]=layout[key];
					}
				}
			}
			return ret;
		};

		var parent=function(){
			var transform=env.transform;
			return {
				x:transform.x,y:transform.y,
				width:transform.width,height:transform.height,
			}
		};

		var slible=function(index){
			var transform=env.slibles.transform[index];
			return {
				x:transform.x,y:transform.y,
				width:transform.width,height:transform.height,
			}
		};

		//primitive functions
		var createTransform=function(x,y,width,height,uuid,no,parentTrans){
			var module=viscomposer.Object.hashmap.get(uuid);

			if(width<0){
				width=-width;
				x-=width;
			}
			if(height<0){
				height=-height;
				y-=height;
			}
			var clippath=null;
			var clipID=uuid+'-'+no;
			clippath=document.createElementNS("http://www.w3.org/2000/svg","clipPath");
			clippath.setAttribute("id",clipID);
			var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
			rect.setAttribute("x","0");
			rect.setAttribute("y","0");
			rect.setAttribute("width",(width+0)+"px");
			rect.setAttribute("height",(height+0)+"px");
			clippath.appendChild(rect);

			var transform=document.createElementNS("http://www.w3.org/2000/svg","g");
			transform.setAttribute("transform","translate("+x+","+y+")");
			transform.parentTrans=parentTrans;
			transform.module=module;

			var clipTrans=document.createElementNS("http://www.w3.org/2000/svg","g");
			//clipTrans.setAttribute("clip-path","url(#"+clipID+")");
			clipTrans.parentTrans=parentTrans;
			clipTrans.module=module;

			var transformRect=document.createElementNS("http://www.w3.org/2000/svg","g");
			transformRect.module=module;
			transformRect.paintUnder=module;
			transformRect.parentTrans=transform.parentTrans;
			var fwidth=10,fpadding=5;
			var tmp=[
				[0,0,width,height,'center'],
				[-fwidth/2,fpadding,fwidth,height-fpadding*2,'left'],
				[fpadding,-fwidth/2,width-fpadding*2,fwidth,'top'],
				[width-fwidth/2,fpadding,fwidth,height-fpadding*2,'right'],
				[fpadding,height-fwidth/2,width-fpadding*2,fwidth,'bottom'],
			];
			var transformRectF=[];
			for(var f=0;f<5;++f){
				var tmpF=document.createElementNS("http://www.w3.org/2000/svg","rect");
				tmpF.setAttribute("x",tmp[f][0]+"px");
				tmpF.setAttribute("y",tmp[f][1]+"px");
				tmpF.setAttribute("width",tmp[f][2]+"px");
				tmpF.setAttribute("height",tmp[f][3]+"px");
				tmpF.setAttribute("class","indicator-f intermediate " + tmp[f][4]);
//				tmpF.setAttribute("active", 0);
//				tmpF.setAttribute("index", f);
				tmpF.module=module;
				tmpF.paintUnder=module;
				tmpF.env=env;
				tmpF.index=i;
				tmpF.fg=transformRect;
				tmpF.posF=tmp[f][4];
				transformRect.appendChild(tmpF);
				transformRectF.push(tmpF);
//                if(tmp[f][4] != "center")
//                {
//                    tmpF.addEventListener("mousedown", function(ev){
//                        this.setAttribute("active", 1);
//                    }, false);
//                    tmpF.addEventListener("mousemove", function(ev){
//                        var active = this.attributes["active"].value;
//                        if(active == 1)
//                        {
//                            console.log(ev);
//                        }
//                    }, false);
//                    tmpF.addEventListener("mouseup", function(ev){
//                        this.setAttribute("active", 0);
//                    }, false);
//                }

			}
			transformRect.f=transformRectF;

			var transformResizeRect=document.createElementNS("http://www.w3.org/2000/svg","rect");
			transformResizeRect.setAttribute("x",(width-10)+"px");
			transformResizeRect.setAttribute("y",(height-10)+"px");
			transformResizeRect.setAttribute("width",10+"px");
			transformResizeRect.setAttribute("height",10+"px");
			transformResizeRect.setAttribute("class","indicator-resizer intermediate");
			transformResizeRect.module=module;
			transformResizeRect.paintUnder=module;
			transformResizeRect.parentTrans=transform.parentTrans;
			transformRect.resizer=transformResizeRect;
			transformResizeRect.indicator=transformRect;

			transform.appendChild(transformRect);
			transform.appendChild(transformResizeRect);
			transform.appendChild(clipTrans);

			return {module:module,index:i,dom:transform,clipDom:clipTrans,clippath:clippath,indicator:transformRect,resizer:transformResizeRect,x:x,y:y,width:width,height:height};
		};

		var createCircle=function(cx,cy,r,color,uuid,no,parentTrans){
			var circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
			circle.module=viscomposer.Object.hashmap.get(uuid);
			circle.setAttribute("cx",cx||0);
			circle.setAttribute("cy",cy||0);
			circle.setAttribute("r",r||1);
			circle.setAttribute("style","fill:"+color);
			circle.parentTrans=parentTrans;
			circle.paintUnder=parentTrans.module;
			circle.geometryType='geometry';
			circle.env=env;
			circle.index=i;

			return circle;
		};

		var createRect=function(x,y,width,height,color,style,uuid,no,parentTrans){
			if(width<0){
				width=-width;
				x-=width;
			}
			if(height<0){
				height=-height;
				y-=height;
			}
			var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
			rect.module=viscomposer.Object.hashmap.get(uuid);
			rect.setAttribute("x",x);
			rect.setAttribute("y",y);
			rect.setAttribute("width",width);
			rect.setAttribute("height",height);
			rect.setAttribute("style","fill:"+color+";"+style);
			rect.parentTrans=parentTrans;
			rect.paintUnder=parentTrans.module;
			rect.geometryType='geometry';
			rect.env=env;
			rect.index=i;
			return rect;
		};

		var createText=function(x,y,str,rotate,fontSize,fontFamily,color,uuid,no,parentTrans){
			var text=document.createElementNS("http://www.w3.org/2000/svg","text");
			text.module=viscomposer.Object.hashmap.get(uuid);
			text.setAttribute("text-anchor","middle");
			text.setAttribute("transform","translate("+x+","+y+") rotate("+rotate+")");
			text.setAttribute("style","font-size:"+fontSize+";font-family:"+fontFamily+";fill:"+color+";");
			text.textContent=str;
			text.parentTrans=parentTrans;
			text.paintUnder=parentTrans.module;
			text.geometryType='geometry';
			text.env=env;
			text.index=i;
			return text;
		}

		var createLine=function(x1,y1,x2,y2,width,color,uuid,no,parentTrans){
			var line=document.createElementNS("http://www.w3.org/2000/svg","line");
			line.module=viscomposer.Object.hashmap.get(uuid);
			line.setAttribute("x1",x1);
			line.setAttribute("y1",y1);
			line.setAttribute("x2",x2);
			line.setAttribute("y2",y2);
			line.setAttribute("style","stroke-width:"+width+";stroke:"+color+";");
			line.parentTrans=parentTrans;
			line.paintUnder=parentTrans.module;
			line.geometryType='line';
			line.env=env;
			line.index=i;
			return line;
		}

		var createPolyline=function(x,y,color,lineWidth,uuid,no,parentTrans){
			var points="";
			for(var i=0,ni=x.length;i<ni;++i){
			     points+=" "+x[i]+","+y[i]+" ";
			}
			var polyline=document.createElementNS("http://www.w3.org/2000/svg","polyline");
			polyline.module=viscomposer.Object.hashmap.get(uuid);
			polyline.setAttribute("points",points);
			polyline.setAttribute("style","fill:none;stroke-width:"+lineWidth+";stroke:"+color+";");
			polyline.parentTrans=parentTrans;
			polyline.paintUnder=parentTrans.module;
			polyline.geometryType='line';
			polyline.env=env;
			polyline.index=i;
			return polyline;
		}

		var createPath=function(d,style,uuid,no,parentTrans){
			var path=document.createElementNS("http://www.w3.org/2000/svg","path");
			path.module=viscomposer.Object.hashmap.get(uuid);
			path.setAttribute("d",d);
			path.setAttribute("style",style);
			path.parentTrans=parentTrans;
			path.paintUnder=parentTrans.module;
			path.geometryType='geometry';
			path.env=env;
			path.index=i;
			return path;
		}

		var createAxis=function(scale,orient,ticks,uuid,no,parentTrans){
			var container=document.createElementNS("http://www.w3.org/2000/svg","g");
			container.parentTrans=parentTrans;
			container.module=viscomposer.Object.hashmap.get(uuid);
			var axis=d3.svg.axis().scale(scale).orient(orient).ticks(ticks);//.outerTickSize(3).innerTickSize(3).tickPadding(0);
			d3.select(container).style("fill","none")
				.style("stroke","#000")
				.style("shape-rendering","crispEdges")
				.style("font", "3px sans-serif")
				.call(axis);
			container.removeChild(container.firstChild);
			container.geometryType='axis';
			/*$(container).find('text')
				.attr("transform","rotate(30)")
				.attr("style","text-anchor:left;");*/
			return container;
		};

		return function(code){
		    return eval('('+code+')');
		};
	}(),

	handler:(function(){
		var plus=function(str,d){
        	if(str.length==0){
        		return ''+d;
        	}else{
	            var ppos=str.lastIndexOf('+');
	            if(ppos==-1){
	                if(isNaN(str)){
	                    return str+'+'+d;
	                }else{
	                    return parseFloat(str)+d;
	                }
	            }else{
	                var prhs=str.substring(ppos+1);
	                if(!isNaN(prhs)){
	                    return str.substring(0,ppos)+'+'+(parseFloat(prhs)+d);
	                }else{
	                    return str+'+'+d;   
	                }
	            }
	        }
        };

		var curAction='normal';
		var curPainter='normal';
		var curState='none';
		var paintCallback=null;
        var oriX;
        var oriY;
	    var curX;
	    var curY;
		var svg=null;
		var svgRect=null;
		var canvasRect=null;
		var boundingRect=null;
		var parentModule=null;
		var parentNode=null;
		var shape=null;
		var startModeX={
			normal:null,
			indicatorPoint:null,
			indicatorEdge:null,
			slibleGeo:null,
		};
		var startModeY={
			normal:null,
			indicatorPoint:null,
			indicatorEdge:null,
			slibleGeo:null,
		};
		var endModeX={
			normal:null,
			indicatorPoint:null,
			indicatorEdge:null,
			slibleGeo:null,
		};
		var endModeY={
			normal:null,
			indicatorPoint:null,
			indicatorEdge:null,
			slibleGeo:null,
		};

		var prodefined={

		    dragProc:function(){
		        var selectedElement=null;
		        var curX=null;
		        var curY=null;
		        var curTranslate=null;
		        var oriTranslate=null;
		        var oriMouseout=null;
		        var oriMousemove=null;
		        var oriMouseup=null;

		        var applyChange=function(dxy,module){		        	
		        	var ni=2;
		        	if(module instanceof viscomposer.workflow.Line){
		        		ni=4;
		        	}
	                for(var i=0;i<ni;++i){
	                    var linkFrom;
	                    var d=dxy[i%2];
	                    var linkFrom=module.input[i].linkFrom;
	                    var moduleFrom=linkFrom&&linkFrom.port1.module;
	                    if(linkFrom&&moduleFrom&&moduleFrom.modifier){
		                    if(moduleFrom.modifier instanceof viscomposer.workflow.DirectModifier){
		                        var modifier=moduleFrom.modifier;
		                        if(modifier.modifierStr.length==0){
		                            modifier.modifierStr='parseFloat('+modifier.input[0]+')+'+d;
		                        }else{
		                            modifier.modifierStr=plus(''+modifier.modifierStr,d);
		                        }
		                    }else if(moduleFrom.modifier instanceof viscomposer.workflow.ScaleModifier){
		                        var modifier=moduleFrom.modifier;
		                        modifier.properties.offset+=d;
		                    }else{
		                        var workflow=linkFrom.workflow;
		                        var modifier=new viscomposer.workflow.DirectModifier(linkFrom.port1.varname,linkFrom.port2.varname);
		                        modifier.modifierStr=plus(''+modifier.modifierStr,d);
		                        var modifierModule=new viscomposer.workflow.ModifierModule(false,modifier);
		                        modifierModule.label='translation';
		                        modifierModule.mappingType='direct';
		                        var workflowDom=$(workflow.ui.elSelector+' .content');
		                        modifierModule.pos=[100,100];
		                        var port1=linkFrom.port1,
		                            port2=linkFrom.port2;
		                        linkFrom.disconnect();
		                        workflow.addModule(modifierModule);
		                        workflow.addLink(port1,modifierModule.input[0]);
		                        workflow.addLink(modifierModule.output[0],port2);
		                        workflow.ui.update();
		                    }
	                    }else{
	                    	if(module.input[i].value.length==0){
	                    		module.input[i].value=''+d;
	                    	}else{
	                        	module.input[i].value=plus(''+module.input[i].value,d);
	                        }
	                    }
	                }                    
	                module.update();
	                module.ui.update();
		        }
		        var deselectElement=function(){
		            if(selectedElement){
		                var module=selectedElement.module;

		                selectedElement.onmouseout=oriMouseout;
		                selectedElement.onmouseup=oriMouseup;
		                selectedElement.onmousemove=oriMousemove;
		                selectedElement=0;

		                viscomposer.app.tryRender(true);
		            }
		        };
		        var moveElement=function(evt){
		            if(!selectedElement){
		                return;
		            }
		            dx=evt.clientX-curX;
		            dy=evt.clientY-curY;

		            applyChange([dx,dy],selectedElement.module);

		            curTranslate[0]+=dx;
		            curTranslate[1]+=dy;
		            newTranslate='translate('+curTranslate.join(',')+')';

		            selectedElement.g.setAttributeNS(null,"transform",newTranslate);
		            //selectedElement.clippath.setAttributeNS(null,"transform",newTranslate);
		            curX=evt.clientX;
		            curY=evt.clientY;
		        };
		        var newMouseout=function(evt){
		            deselectElement();
		            oriMouseout.call(this,evt);
		        }

		        return function(evt){
		            selectedElement=evt.target;
		            var par=selectedElement.parentNode;
		            par.parentNode.appendChild(par);
		            var g=selectedElement.g;
		            if(!g){return;}
		            curX=evt.clientX;
		            curY=evt.clientY;
		            oriTranslate=g.getAttributeNS(null,"transform").slice(10,-1).split(',');
		            curTranslate=[];
		            for(var i=0;i<2;++i) {
		                curTranslate.push(oriTranslate[i]=parseFloat(oriTranslate[i]));
		            }
		            oriMouseout=selectedElement.onmouseout;
		            oriMousemove=selectedElement.onmousemove;
		            oriMouseup=selectedElement.onmouseup;
		            selectedElement.onmousemove=moveElement;
		            selectedElement.onmouseout=newMouseout;
		            selectedElement.onmouseup=deselectElement;
		        }
		    }(),

		    resizeProc:function(){
		        var selectedElement=null;
		        var curX=null;
		        var curY=null;
//		        var curTranslate=null;
//		        var oriTranslate=null;
		        var oriMouseout=null;
		        var oriMousemove=null;
		        var oriMouseup=null;

                var resize = function(dx, dy){
                    var gs = $(selectedElement).siblings("g");
                    var rects = $(gs[0]).children("rect");
                    var center = rects[0];
                    var left = rects[1];
                    var top = rects[2];
                    var right = rects[3];
                    var bottom = rects[4];
                    var tmpW, tmpH, tmpX, tmpY;
                    tmpW = parseFloat($(center).attr("width")) + dx;
                    $(center).attr("width", tmpW);
                    tmpH = parseFloat($(center).attr("height")) + dy;
                    $(center).attr("height", tmpH);
                    tmpW = parseFloat($(top).attr("width")) + dx;
                    $(top).attr("width", tmpW);
                    tmpW = parseFloat($(bottom).attr("width")) + dx;
                    $(bottom).attr("width", tmpW);
                    tmpY = parseFloat($(bottom).attr("y")) + dy;
                    $(bottom).attr("y", tmpY);
                    tmpH = parseFloat($(left).attr("height")) + dy;
                    $(left).attr("height", tmpH);
                    tmpH = parseFloat($(right).attr("height")) + dy;
                    $(right).attr("height", tmpH);
                    tmpX = parseFloat($(right).attr("x")) + dx;
                    $(right).attr("x", tmpX);
                    tmpX = parseFloat($(selectedElement).attr("x")) + dx;
                    tmpY = parseFloat($(selectedElement).attr("y")) + dy;
                    $(selectedElement).attr({
                        "x": tmpX,
                        "y": tmpY,
                    });
                    var module = selectedElement.module;
                    var widthPort = module.input[2];
                    var heightPort = module.input[3];
                    widthPort.value = parseFloat(widthPort.value) + parseFloat(dx);
                    heightPort.value = parseFloat(heightPort.value) + parseFloat(dy);
                    module.update();
                    module.ui.update();
                };
		        var deselectElement=function(){
		            if(selectedElement){

		                selectedElement.onmouseout=oriMouseout;
		                selectedElement.onmouseup=oriMouseup;
		                selectedElement.onmousemove=oriMousemove;
		                selectedElement=0;

		                viscomposer.app.tryRender(true);
		            }
		        };
		        var moveElement=function(evt){
                    evt.stopPropagation();
		            if(!selectedElement){
		                return;
		            }
		            var dx=evt.clientX-curX;
		            var dy=evt.clientY-curY;
                    resize(dx, dy);
		            curX=evt.clientX;
		            curY=evt.clientY;

		        };
		        var newMouseout=function(evt){
		            deselectElement();
		            oriMouseout.call(this,evt);
		        };

		        return function(evt){
		            selectedElement=evt.target;
		            //var par=selectedElement.parentNode;
		            //par.parentNode.appendChild(par);
		            var g=selectedElement.g;
		            if(!g){return;}
		            curX=evt.clientX;
		            curY=evt.clientY;
//		            oriTranslate=g.getAttributeNS(null,"transform").slice(10,-1).split(',');
//		            curTranslate=[];
//		            for(var i=0;i<2;++i) {
//		                curTranslate.push(oriTranslate[i]=parseFloat(oriTranslate[i]));
//		            }
		            oriMouseout=selectedElement.onmouseout;
		            oriMousemove=selectedElement.onmousemove;
		            oriMouseup=selectedElement.onmouseup;
		            selectedElement.onmousemove=moveElement;
		            selectedElement.onmouseout=newMouseout;
		            selectedElement.onmouseup=deselectElement;
		        }
		    }(),

		    panProc:function(){
		        var selectedElement=null;
		        var curX=null;
		        var curY=null;
		        var curTranslate=null;
		        var oriTranslate=null;
		        var oriMouseout=null;
		        var oriMousemove=null;
		        var oriMouseup=null;

		        var applyChange=function(dx,dy){
		        }
		        var deselectElement=function(){
		            if(selectedElement){
		                selectedElement.onmouseout=oriMouseout;
		                selectedElement.onmouseup=oriMouseup;
		                selectedElement.onmousemove=oriMousemove;
		                selectedElement=0;
		            }
		        }
		        var moveElement=function(evt){
		            if(!selectedElement){
		                return;
		            }
		            dx=evt.clientX-curX;
		            dy=evt.clientY-curY;

		            applyChange(dx,dy);

		            curTranslate[0]+=dx;
		            curTranslate[1]+=dy;
		            newTranslate='translate('+curTranslate.join(',')+')';

		            selectedElement.canvasControl.setAttributeNS(null,"transform",newTranslate);
		            //selectedElement.clippath.setAttributeNS(null,"transform",newTranslate);
		            curX=evt.clientX;
		            curY=evt.clientY;
		        };
		        var newMouseout=function(evt){
		            deselectElement();
		            oriMouseout.call(this,evt);
		        }

		        return function(evt){
		            selectedElement=evt.target;
		            var g=selectedElement.canvasControl;
		            if(!g){return;}
		            curX=evt.clientX;
		            curY=evt.clientY;
		            oriTranslate=g.getAttributeNS(null,"transform").slice(10,-1).split(',');
		            curTranslate=[];
		            for(var i=0;i<2;++i) {
		                curTranslate.push(oriTranslate[i]=parseFloat(oriTranslate[i]));
		            }

		            oriMouseout=selectedElement.onmouseout;
		            oriMousemove=selectedElement.onmousemove;
		            oriMouseup=selectedElement.onmouseup;
		            selectedElement.onmousemove=moveElement;
		            selectedElement.onmouseout=newMouseout;
		            selectedElement.onmouseup=deselectElement;
		        }
		    }(),

		    paintProc:function(){
		        var oriMouseout=null;
		        var oriMousemove=null;
		        var oriMouseup=null;

		        var deselectElement=function(evt){
		        	if(curAction!='paint'){return;}
		        	if(curState!='painting'){return;}
		        	var x=evt.clientX,
		        		y=evt.clientY;

	                svg.onmouseout=oriMouseout;
	                svg.onmouseup=oriMouseup;
	                svg.onmousemove=oriMousemove;

					curState='none';
					curAction='normal';

					shape.parentNode.removeChild(shape);
					shape=null;

	            	endModeX.normal=''+(curX-oriX);
	            	endModeY.normal=''+(curY-oriY);

	            	var x1Str,x2Str,y1Str,y2Str,widthStr,heightStr,offset,loopNum;

            		if(startModeX.indicatorPoint!==null&&endModeX.indicatorPoint!==null){
            			offset=Math.abs(endModeX.indicatorPoint-startModeX.indicatorPoint);
            			x1Str='layout().x';
            			x2Str='layout(i+'+offset+').x';
            			y1Str='layout().y';
            			y2Str='layout(i+'+offset+').y';
            			widthStr=x2Str+'-'+x1Str;
            			heightStr=y2Str+'-'+y1Str;
            			loopNum='layout().num-'+offset;
            		}

            		if(startModeX.slibleGeo!==null&&endModeX.slibleGeo!==null){
            			offset=Math.abs(endModeX.slibleGeo-startModeX.slibleGeo);
            			x1Str='slible(i).x';
            			x2Str='slible(i+'+offset+').x';
            			y1Str='slible(i).y';
            			y2Str='slible(i+'+offset+').y';
            			widthStr=x2Str+'-'+x1Str;
            			heightStr=y2Str+'-'+y1Str;
            			loopNum='env.sliblesNum-'+offset;
            		}

            		x1Str=x1Str||(startModeX.slibleGeo!==null)&&'slible(i).x'||(startModeX.indicatorPoint!==null)&&'layout().x'
            			||startModeX.indicatorEdge||startModeX.normal;
            		y1Str=y1Str||(startModeY.slibleGeo!==null)&&'slible(i).y'||(startModeY.indicatorPoint!==null)&&'layout().y'
            			||startModeY.indicatorEdge||startModeY.normal;
            		x2Str=x2Str||(endModeX.slibleGeo!==null)&&'slible(i).x'||(endModeX.indicatorPoint!==null)&&'layout().x'
            			||endModeX.indicatorEdge&&(endModeX.indicatorEdge);
            		y2Str=y2Str||(endModeY.slibleGeo!==null)&&'slible(i).y'||(endModeY.indicatorPoint!==null)&&'layout().y'
            			||endModeY.indicatorEdge&&(endModeY.indicatorEdge);
	            	widthStr=widthStr||x2Str&&(x2Str+'-'+x1Str)||endModeX.normal;
	            	heightStr=heightStr||y2Str&&(y2Str+'-'+y1Str)||endModeY.normal;
	            	x2Str=x2Str||x1Str+'+'+widthStr;
	            	y2Str=y2Str||y1Str+'+'+heightStr;
	            	loopNum=loopNum||'auto';

	            	switch(curPainter){
	            	case 'rect':
		            	console.log('('+x1Str+','+y1Str+','+widthStr+','+heightStr+')');

		            	var properties={x:x1Str,y:y1Str,width:widthStr,height:heightStr,type:"geometry",loopNum:loopNum,parent:parentNode};
	            		break;
	            	case 'line':
		            	console.log('('+x1Str+','+y1Str+') - ('+x2Str+','+y2Str+')');

		            	var properties={x1:x1Str,y1:y1Str,x2:x2Str,y2:y2Str,type:"geometry",loopNum:loopNum,parent:parentNode};
	            		break;
	            	case 'circle':
		            	console.log('('+x1Str+','+y1Str+','+widthStr+','+heightStr+')');

		            	var properties={x:x1Str,y:y1Str,width:widthStr,height:heightStr,type:"geometry",loopNum:loopNum,parent:parentNode};
	            		break;
	            	}
	            	if(parentModule){
	            		paintCallback(parentModule.childProperties(properties));
	            	}else{
	            		paintCallback(properties);
	            	}
	            	paintCallback=null;
		        }
		        var moveElement=function(evt){
		        	if(curAction!='paint'){return;}
		        	if(curState!='painting'){return;}
		        	var x=evt.clientX,
		        		y=evt.clientY;

		        	curX=x;
		        	curY=y;

		        	switch(curPainter){
		        	case 'rect':
			        	var width=curX-oriX,
			        		height=curY-oriY;
			        	x=oriX;y=oriY;

			        	if(width<0){
			        		width=-width;
			        		x-=width;
			        	}
			        	if(height<0){
			        		height=-height;
			        		y-=height;
			        	}
						shape.setAttribute("x",x-svgRect.left);
						shape.setAttribute("y",y-svgRect.top);
						shape.setAttribute("width",width);
						shape.setAttribute("height",height);
		        		break;
		        	case 'line':
						shape.setAttribute("x1",oriX-svgRect.left);
						shape.setAttribute("y1",oriY-svgRect.top);
						shape.setAttribute("x2",curX-svgRect.left);
						shape.setAttribute("y2",curY-svgRect.top);
		        		break;
		        	case 'circle':
			        	var width=curX-oriX,
			        		height=curY-oriY;
			        	x=oriX;y=oriY;

			        	if(width<0){
			        		width=-width;
			        		x-=width;
			        	}
			        	if(height<0){
			        		height=-height;
			        		y-=height;
			        	}
						shape.setAttribute("cx",x-svgRect.left);
						shape.setAttribute("cy",y-svgRect.top);
						shape.setAttribute("r",width);
		        		break;
		        	}
		        };
		        var newMouseout=function(evt){
		        	if(curAction!='paint'){return;}
		        	if(curState!='painting'){return;}
		            //deselectElement();
		            //oriMouseout.call(this,evt);
		        }

		        return function(evt){
		        	if(curAction!='paint'){return;}
		        	if(curState!='none'){return;}

		        	parentModule=this.paintUnder;
		        	parentNode=parentModule&&parentModule.workflow.node;

		        	var x=evt.clientX,
		        		y=evt.clientY;

		            svg=document.getElementById('canvasWindow').getElementsByTagName('svg')[0];
		    		svgRect=$(svg)[0].getBoundingClientRect();
		    		if(this===svg){
						boundingRect=$(svg.canvasControl.canvasRect)[0].getBoundingClientRect();
					}else{
						boundingRect=$(this)[0].getBoundingClientRect();
					}

		        	curX=oriX=x;
		        	curY=oriY=y;

		            oriMouseout=svg.onmouseout;
		            oriMousemove=svg.onmousemove;
		            oriMouseup=svg.onmouseup;
		            svg.onmousemove=moveElement;
		            svg.onmouseout=newMouseout;
		            svg.onmouseup=deselectElement;

			    	curState='painting';

		        	switch(curPainter){
		        	case 'rect':
						var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
						rect.setAttribute("x",oriX-svgRect.left);
						rect.setAttribute("y",oriY-svgRect.top);
						rect.setAttribute("width",0);
						rect.setAttribute("height",0);
						rect.setAttribute("style","stoke-width:3px;stroke:#ffdd33;fill:#ffdd33;fill-opacity:0.45;pointer-events:none;");
						shape=rect;
						break;
		        	case 'line':
						var line=document.createElementNS("http://www.w3.org/2000/svg","line");
						line.setAttribute("x1",oriX-svgRect.left);
						line.setAttribute("y1",oriY-svgRect.top);
						line.setAttribute("x2",oriX-svgRect.left);
						line.setAttribute("y2",oriY-svgRect.top);
						line.setAttribute("style","stroke-width:3px;stroke:#ffdd33;fill:#ffdd33;fill-opacity:0.45;pointer-events:none;");
						shape=line;
						break;
		        	case 'circle':
						var circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
						circle.setAttribute("cx",oriX-svgRect.left);
						circle.setAttribute("cy",oriY-svgRect.top);
						circle.setAttribute("r",0);
						circle.setAttribute("style","stoke-width:3px;stroke:#ffdd33;fill:#ffdd33;fill-opacity:0.45;pointer-events:none;");
						shape=circle;
						break;
					}
					svg.appendChild(shape);

					startModeX={
						normal:null,
						indicatorPoint:null,
						indicatorEdge:null,
						slibleGeo:null,
					};
					startModeY={
						normal:null,
						indicatorPoint:null,
						indicatorEdge:null,
						slibleGeo:null,
					};
					endModeX={
						normal:null,
						indicatorPoint:null,
						indicatorEdge:null,
						slibleGeo:null,
					};
					endModeY={
						normal:null,
						indicatorPoint:null,
						indicatorEdge:null,
						slibleGeo:null,
					};

					startModeX.normal=''+oriX-boundingRect.left;
					startModeY.normal=''+oriY-boundingRect.top;
		        }
		    }(),

		    rightClkProc:function(evt){
		    	var env=this.env;
		    	var index=this.index;
		    	var layout=function(key){
		    		var ret=env.layout&&env.layout[key]&&env.layout[key][index];
		    		if(ret===undefined){
		    			ret=env.layout&&env.layout[key];
		    		}
		    		return ret;
		    	}
		    	var rules=[],filters=[];
		    	if(index==0){
		    		rules.push('first');filters.push(['i==0','i!=0']);
		    	}else{
		    		rules.push('index='+index);filters.push(['i=='+index,'i!='+index]);
		    	}
		    	var num=layout('num');
		    	if(index==num-1){
		    		rules.push('last');filters.push(['i==layout().num-1','i!=layout().num-1']);
		    	}
		    	var row=layout('row'),col=layout('col');
		    	var rowNum=layout('rowNum'),colNum=layout('colNum');
		    	if(row!=undefined&&col!=undefined){
		    		if(row==col){
		    			rules.push('diagonal');filters.push(['layout().row==layout().col','layout().row!=layout().col']);
		    		}
		    		if(row+col==rowNum-1){
		    			rules.push('back-diagonal');filters.push(['layout().row+layout().col==layout().rowNum-1','layout().row+layout().col!=layout().rowNum-1']);
		    		}else if(row+col==colNum-1){
		    			rules.push('back-diagonal');filters.push(['layout().row+layout().col==layout().colNum-1','layout().row+layout().col!=layout().colNum-1']);
		    		}
		    		rules.push('row='+row+' and col='+col);filters.push(['layout().row=='+row+'&&layout().col=='+col,'!(layout().row=='+row+'&&layout().col=='+col+')']);
		    	}
		    	if(row!=undefined){
		    		rules.push('row='+row);filters.push(['layout().row=='+row,'layout().row!='+row]);
		    	}
		    	if(col!=undefined){
		    		rules.push('col='+col);filters.push(['layout().col=='+col,'layout().col!='+col]);
		    	}
		    	rules.push('custom filter');filters.push(['all','all']);

	            var menucoverDom = $("body > .menucover");
	            menucoverDom.css("display", "block");
	            menucoverDom.on("click", function(){
	                $("body > .menu").css("display", "none");
	                $(this).css("display", "none");
	            });

	            var menuDom = $("#canvasmenu");
	            $("body > .menu").css("display", "none");
	            menuDom.css({
	                "left": evt.clientX,
	                "top": evt.clientY,
	                "display": "block"
	            });

	            var splitMenuDom = $("#canvasmenu > .split > .submenu");
	            splitMenuDom.html("");
	            var splitOptions = {};
	            var splitOptionList = rules;
	            for(var i=0,ni=splitOptionList.length;i<ni;++i)
	            {
	                //splitOptionList.push(splitOptions[key]);
	                splitMenuDom.append('<div value="'+i+'">' + splitOptionList[i] + '</div>');
	            }
	            var splitMenuItemDom = splitMenuDom.children("div");

		    	var module=this.module;
		    	var workflow=module.workflow;
		    	var header=workflow.header;
		    	var node=workflow.node;
		    	var parent=node.parent;
	            splitMenuItemDom.on("click", function(){
                    menuDom.css("display", "none");
                    menucoverDom.css("display", "none");
	            	var i=parseInt($(this).attr("value"));
	            	filter=filters[i];

	            	header.filter=filter[1];
	            	node.dataSelectorStr=rules[i];

	            	var node2=viscomposer.app.scenegraph.newEmptyNode(parent);
	            	node2.filter=filter[0];
	            	node2.dataSelectorStr='others';

	            	viscomposer.app.tryRender();
	            });
		    },
		};

		return {
			beginPaint:function(callback,painter){
				curPainter=painter||'rect';
				curAction='paint';
				paintCallback=callback;
			},
		    copyHandler:function(obj,type){
		        var handler=viscomposer.Environment.handler[type];
		        if(handler){
			        handler.init.call(obj);
			        obj.onmouseover=handler.mouseover;
			        obj.onmouseout=handler.mouseout;
			        obj.onmousedown=handler.mousedown;
			        obj.ondblclick=handler.dblclick;
			    }
		    },
		    svg:{
		        init:function(){
		        },
		        mouseover:function(evt){
		        	evt&&evt.stopPropagation();
		        },
		        mouseout:function(evt){
		        	evt&&evt.stopPropagation();
		        },
		        mousedown:function(evt){
		        	evt&&evt.stopPropagation();
		        	switch(curAction){
		        	case 'normal':
		        		return prodefined.panProc.call(this,evt);
		        	case 'paint':
		        		return prodefined.paintProc.call(this,evt);
		        	}
		        },
		    },
		    indicator:{
		        init:function(){
		        	var initF0=function(){
		            	$(this).css('fill','transparent')
		                .css('stroke','#ccddff')
		                .css('strokeWidth','3')
		                .css('stroke-opacity','0.3')
		                .attr('transform','translate(0,0)');
		            };
		        	var onmouseoverF0=function(evt){
		        		evt&&evt.stopPropagation();
			            $(this).css('stroke','#334466')
			                .css('stroke-opacity','0.9');
			            var par=this.parentNode.parentNode;
			            par.parentNode.appendChild(par);
//			            if(evt){this.fg.resizer.onmouseover();}
			        };
			        var onmouseoutF0=function(evt){
		        		evt&&evt.stopPropagation();
			            $(this).css('stroke','#ccddff')
			                .css('stroke-opacity','0.3');
//			            if(evt){this.fg.resizer.onmouseout();}
			        };
			        var onmousedownF0=function(evt){
		        		evt&&evt.stopPropagation();
			        	viscomposer.ui.highlightModule(this.module);
		        		if(evt.which == 3){
		        			//right
				        	return prodefined.rightClkProc.call(this,evt);
		        		}else{
				        	switch(curAction){
				        	case 'normal':
				        		return prodefined.dragProc.call(this,evt);
				        	case 'paint':
				        		return prodefined.paintProc.call(this,evt);
				        	}
				        }
			        };
		        	var initF=function(){
			            $(this).css('fill','transparent')
			                .attr('transform','translate(0,0)');
		        	};
		        	var onmouseoverF=function(evt){
		        		evt&&evt.stopPropagation();
			            $(this).css('fill','#334466')
			                .css('fill-opacity','0.9');
			            this.fg.f[0].onmouseover();
			            var par=this.parentNode.parentNode;
			            par.parentNode.appendChild(par);

			            if(curAction=='paint'){
				            switch(curState){
				            case 'none':
				            	switch(this.posF){
				            	case'left':startModeX.indicatorEdge='0';break;
				            	case'top':startModeY.indicatorEdge='0';break;
				            	case'right':startModeX.indicatorEdge='parent().width';break;
				            	case'bottom':startModeY.indicatorEdge='parent().height';break;
				            	}
				            	break;
				            case 'painting':
				            	switch(this.posF){
				            	case'left':endModeX.indicatorEdge='0';break;
				            	case'top':endModeY.indicatorEdge='0';break;
				            	case'right':endModeX.indicatorEdge='parent().width';break;
				            	case'bottom':endModeY.indicatorEdge='parent().height';break;
				            	}
				            	break;
				            }
				        }
		        	};
		        	var onmouseoutF=function(evt){
		        		evt&&evt.stopPropagation();
			            $(this).css('fill','#transparent')
			                .css('fill-opacity','0');
			            this.fg.f[0].onmouseout();
			            if(curAction=='paint'){
				            switch(curState){
				            case 'none':
				            	switch(this.posF){
				            	case'left':startModeX.indicatorEdge=null;break;
				            	case'top':startModeY.indicatorEdge=null;break;
				            	case'right':startModeX.indicatorEdge=null;break;
				            	case'bottom':startModeY.indicatorEdge=null;break;
				            	}
				            	break;
				            case 'painting':
				            	switch(this.posF){
				            	case'left':endModeX.indicatorEdge=null;break;
				            	case'top':endModeY.indicatorEdge=null;break;
				            	case'right':endModeX.indicatorEdge=null;break;
				            	case'bottom':endModeY.indicatorEdge=null;break;
				            	}
				            	break;
				            }
				        }
		        	};
		        	var onmousedownF=function(evt){
		        		evt&&evt.stopPropagation();
		        		viscomposer.ui.highlightModule(this.module);
		        		if(evt.which == 3){
		        			//right
				        	return prodefined.rightClkProc.call(this,evt);
				        }else{
				        	switch(curAction){
				        	case 'normal':
				        		return;
				        	case 'paint':
				        		var ret=prodefined.paintProc.call(this,evt);
				            	switch(this.posF){
				            	case'left':startModeX.indicatorEdge='0';break;
				            	case'top':startModeY.indicatorEdge='0';break;
				            	case'right':startModeX.indicatorEdge='parent().width';break;
				            	case'bottom':startModeY.indicatorEdge='parent().height';break;
				            	}
				            	return ret;
				        	}
				        }
		        	};
		        	return function(){
		        		var f=this.f[0];
		            	initF0.call(f);
		            	f.onmouseover=onmouseoverF0;
		            	f.onmouseout=onmouseoutF0;
		            	f.onmousedown=onmousedownF0;
		            	f.g=this.g;
			            for(var i=1;i<5;++i){
			            	var f=this.f[i];
			            	initF.call(f);
			            	f.onmouseover=onmouseoverF;
			            	f.onmouseout=onmouseoutF;
			            	f.onmousedown=onmousedownF;
			            }
		            }
		        }(),
		        mouseover:null,
		        mouseout:null,
		        mousedown:null,
		    },
		    resizer:{
		        init:function(){
		            $(this).css('fill','#ccddff')
		                .css('fill-opacity','0.3')
		                .attr('transform','translate(0,0)')
		                .attr('visibility','visible');
		        },
		        mouseover:function(evt){
		        	evt&&evt.stopPropagation();
		            $(this).css('fill','#334466')
		            	.css('fill-opacity','0.9');
					if(evt){
			           	$(this).css('stroke','#ffdd33')
			            	.css('stroke-width','3')
			                .css('stroke-opacity','0.9');
			            this.indicator.f[0].onmouseover();
			        }
                    console.log("mouseover");
		            var par=this.parentNode;
		            par.parentNode.appendChild(par);
		        },
		        mouseout:function(evt){
		        	evt&&evt.stopPropagation();
		            $(this).css('fill','#ccddff')
		            	.css('fill-opacity','0.3')
		            	.css('stroke-width','0')
		                .css('stroke-opacity','0');
                    console.log("mouseout");
		            if(evt){this.indicator.f[0].onmouseout();}
		        },
		        mousedown:prodefined.resizeProc,
		    },
		    geometry:{
		        init:function(){
		        },
		        mouseover:function(evt){
		        	evt&&evt.stopPropagation();
		            this.oriStroke=$(this).css('stroke');
		            this.oriStrokeWidth=parseFloat($(this).css('stroke-width'));
		            this.oriFill=$(this).css('fill');
		            $(this).css('stroke','#334466')
		                .css('stroke-width',this.oriStrokeWidth+3)
		                .css('fill','#ccddff');

		            this.parentNode.appendChild(this);

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.slibleGeo=this.index;
			            	startModeY.slibleGeo=this.index;
			            	break;
			            case 'painting':
			            	endModeX.slibleGeo=this.index;
			            	endModeY.slibleGeo=this.index;
			            	break;
			            }
			        }
		        },
		        mouseout:function(evt){
		        	evt&&evt.stopPropagation();
		            $(this).css('stroke',this.oriStroke)
		                .css('stroke-width',this.oriStrokeWidth)
		                .css('fill',this.oriFill);

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.slibleGeo=null;
			            	startModeY.slibleGeo=null;
			            	break;
			            case 'painting':
			            	endModeX.slibleGeo=null;
			            	endModeY.slibleGeo=null;
			            	break;
			            }
			        }
		        },
		        mousedown:function(evt){
		        	evt&&evt.stopPropagation();
		        	viscomposer.ui.highlightModule(this.module);
	        		if(evt.which == 3){
	        			//right
			        	return prodefined.rightClkProc.call(this,evt);
			        }else{
			        	switch(curAction){
			        	case 'normal':
			        		return prodefined.dragProc.call(this,evt);
			        	case 'paint':
			        		ret=prodefined.paintProc.call(this,evt);
			            	startModeX.slibleGeo=this.index;
			            	startModeY.slibleGeo=this.index;
			            	return ret;
			        	}
			        }
		        },
		    },
		    line:{
		        init:function(){
		        },
		        mouseover:function(evt){
		        	evt&&evt.stopPropagation();
		            this.oriStroke=$(this).css('stroke');
		            this.oriStrokeWidth=parseFloat($(this).css('stroke-width'));
		            this.oriStrokeOpacity=parseFloat($(this).css('stroke-opacity'));
		            $(this).css('stroke','#334466')
		                .css('stroke-width',this.oriStrokeWidth+3)
		                .css('stroke-opacity',1);

		            this.parentNode.appendChild(this);

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.slibleGeo=this.index;
			            	startModeY.slibleGeo=this.index;
			            	break;
			            case 'painting':
			            	endModeX.slibleGeo=this.index;
			            	endModeY.slibleGeo=this.index;
			            	break;
			            }
			        }
		        },
		        mouseout:function(evt){
		        	evt&&evt.stopPropagation();
		            $(this).css('stroke',this.oriStroke)
		                .css('stroke-width',this.oriStrokeWidth)
		                .css('stroke-opacity',this.oriStrokeOpacity);

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.slibleGeo=null;
			            	startModeY.slibleGeo=null;
			            	break;
			            case 'painting':
			            	endModeX.slibleGeo=null;
			            	endModeY.slibleGeo=null;
			            	break;
			            }
			        }
		        },
		        mousedown:function(evt){
		        	evt&&evt.stopPropagation();
		        	viscomposer.ui.highlightModule(this.module);
	        		if(evt.which == 3){
	        			//right
			        	return prodefined.rightClkProc.call(this,evt);
			        }else{
			        	switch(curAction){
			        	case 'normal':
			        		return prodefined.dragProc.call(this,evt);
			        	case 'paint':
			        		ret=prodefined.paintProc.call(this,evt);
			            	startModeX.slibleGeo=this.index;
			            	startModeY.slibleGeo=this.index;
			            	return ret;
			        	}
			        }
		        },
		    },
		    indicatorPoint:{
		        init:function(){
		            $(this).css('fill','transparent')
		            	.css('stroke','#ccddff')
		            	.css('stroke-width','2')
		                .css('stroke-opacity','1')
		                .attr('transform','translate(0,0)')
		        },
		        mouseover:function(evt){
		        	evt&&evt.stopPropagation();

		            $(this.parentTrans.dom).find('.indicator-point')
		            	.css('stroke','#334466')
		            	.css('stroke-width','3')
		                .css('stroke-opacity','1');
		            var par=this.parentNode;
		            par.parentNode.appendChild(par);

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.indicatorPoint=this.index;
			            	startModeY.indicatorPoint=this.index;
			            	break;
			            case 'painting':
			            	endModeX.indicatorPoint=this.index;
			            	endModeY.indicatorPoint=this.index;
				            $(this)
				            	.css('fill','#334466')
				                .css('fill-opacity','1');
			            	break;
			            }
			        }
		        },
		        mouseout:function(evt){
		        	evt&&evt.stopPropagation();
		            $(this.parentTrans.dom).find('.indicator-point')
		            	.css('stroke','#ccddff')
		            	.css('stroke-width','2')
		                .css('stroke-opacity','1');

		            if(curAction=='paint'){
			            switch(curState){
			            case 'none':
			            	startModeX.indicatorPoint=null;
			            	startModeY.indicatorPoint=null;
			            	break;
			            case 'painting':
			            	endModeX.indicatorPoint=null;
			            	endModeY.indicatorPoint=null;
			            	if(!this.docked){
					            $(this)
					            	.css('fill','transparent')
					                .css('fill-opacity','0');
					        }
			            	break;
			            }
			        }
		        },
		        mousedown:function(evt){
		        	evt&&evt.stopPropagation();
		        	switch(curAction){
		        	case 'normal':
		        		return;
		        	case 'paint':
		        		ret=prodefined.paintProc.call(this,evt);
			            $(this)
			            	.css('fill','#334466')
			                .css('fill-opacity','1');
			            this.docked=true;
		            	startModeX.indicatorPoint=this.index;
		            	startModeY.indicatorPoint=this.index;
		            	return ret;
		        	}
		        },
		    },
		}
	})(),
};

