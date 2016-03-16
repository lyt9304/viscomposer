/**
 * @fileoverview 场景树管理类
 */

viscomposer.scenegraph.SceneGraph=function(){
	viscomposer.Object.call(this);

    this.label='SceneGraph';
    this.roots=[];
    this.nodeNames={};
    var properties=this.properties={
        width:1080,
        height:720,
        color:'#ffffff',
    };

    var svgRoot=document.getElementById('canvasWindow').getElementsByTagName('svg')[0];
    svgRoot.setAttribute("style","background:#f2f2f2");
    var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
    svgRoot.appendChild(defs);
    var clipID=viscomposer.util.generateUUID();
    var clippath=document.createElementNS("http://www.w3.org/2000/svg","clipPath");
    clippath.setAttribute("id",clipID);
    var canvasClip=this.canvasClip=document.createElementNS("http://www.w3.org/2000/svg","rect");
    canvasClip.setAttribute("x","0");
    canvasClip.setAttribute("y","0");
    canvasClip.setAttribute("width",(properties.width+0)+"px");
    canvasClip.setAttribute("height",(properties.height+0)+"px");
    clippath.appendChild(canvasClip);
    defs.appendChild(clippath);

    var container=this.svgRoot=document.createElementNS("http://www.w3.org/2000/svg","g");
    container.setAttribute("clip-path","url(#"+clipID+")");
    container.setAttribute("transform","translate(10,10)");
    svgRoot.appendChild(container);
    svgRoot.canvasControl=container;
    var handler=viscomposer.Environment.handler;
    handler.copyHandler(svgRoot,'svg');
    var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x","0");
    rect.setAttribute("y","0");
    rect.setAttribute("width",(properties.width+0)+"px");
    rect.setAttribute("height",(properties.height+0)+"px");
    rect.setAttribute("style","stroke:#ccddff;stroke-width:2;fill:"+properties.color+";pointer-events:none;");
    container.appendChild(rect);
    container.canvasRect=rect;

    viscomposer.app.disableRender();
    var workflow=this.indicatorWorkflow=new viscomposer.workflow.Workflow();
    var indicator=new viscomposer.workflow.Indicator();
    workflow.addModule(indicator);
    viscomposer.app.enableRender();
};

viscomposer.scenegraph.SceneGraph.prototype=Object.create(viscomposer.Object.prototype);
viscomposer.scenegraph.SceneGraph.prototype.constructor=viscomposer.scenegraph.SceneGraph;

viscomposer.scenegraph.SceneGraph.prototype.clone=function(){
    var newObj=new viscomposer.scenegraph.SceneGraph();
    newObj.copy(this);

    return newObj;
}

viscomposer.scenegraph.SceneGraph.prototype.copy=function(rhs){
    if(!rhs){return;}
    
    viscomposer.Object.prototype.copy.call(this,rhs);

    this.label=rhs.label;


    var roots=this.roots;
    for(i=0,ni=roots.length;i<ni;++i){
        roots[i].destroy();
    }
    this.roots=[];
    roots=rhs.roots;
    for(i=0,ni=roots.length;i<ni;++i){
        var root=roots[i].clone();
        root.parent=this;
        this.roots.push(root);
    }

    viscomposer.util.deleteObject(this.properties);
    this.properties={};
    viscomposer.util.copyObject(this.properties,rhs.properties);
};

viscomposer.scenegraph.SceneGraph.prototype.destroy=function(){
    viscomposer.Object.prototype.destroy.call(this);

    this.label='SceneGraph';
    var roots=this.roots;
    for(i=0,ni=roots.length;i<ni;++i){
        roots[i].destroy();
    }
    this.roots=[];
    viscomposer.util.deleteObject(this.properties);
    this.properties={};
};

viscomposer.scenegraph.SceneGraph.prototype.newEmptyNode=function(parent){
    if(parent&&parent!==this){//如果有父结点的话
        var node=new viscomposer.scenegraph.Node(this,parent,true);
        parent.children.push(node);
        parent.workflow.updateOutputPorts();
    }else{//如果没有父节点，那么祖先就是根节点
        var node=new viscomposer.scenegraph.Node(this,null,true);
        node.parent=this;
        this.roots.push(node);
    }

    this.ui.update();

    return node;
}

viscomposer.scenegraph.SceneGraph.prototype.newNode=function(parent,type,properties,predefinedLabel){
    viscomposer.app.disableRender();

    properties=properties||{};
    if(parent&&parent!==this){
        var node=new viscomposer.scenegraph.Node(this,parent);
        parent.children.push(node);
        parent.workflow.updateOutputPorts();
    }else{
        var node=new viscomposer.scenegraph.Node(this);
        node.parent=this;
        this.roots.push(node);
    }
    var workflow=node.workflow;
    var loopNum=properties.loopNum;
    if(loopNum!==undefined&&loopNum!==null){
        workflow.header.loopNum=loopNum;
    }
    
    properties.underLayout=parent&&parent.workflow&&parent.workflow.hasLayout();

    var moduleClass=viscomposer.app.primitiveRegistry[type];
    if(moduleClass){
        var module=new moduleClass(properties);
        workflow.addModule(module);

        node.type=type;
        node.label=viscomposer.util.processConflict2(predefinedLabel||module.label,this.nodeNames);
    }else{
        var module=new viscomposer.workflow.View(properties);
        workflow.addModule(module);

        node.type='view';
        node.label=viscomposer.util.processConflict2(predefinedLabel||'New Node',this.nodeNames);
    }

    viscomposer.app.enableRender();
    viscomposer.app.tryRender();

    return node;
};

viscomposer.scenegraph.SceneGraph.prototype.loadNode=function(parent,str){
    var obj=JSON.parse(str);
    var node=viscomposer.scenegraph.Node.load({},obj,this,parent);
    node.update();
    if(parent){
        parent.children.push(node);
        parent.workflow.updateOutputPorts();
    }else{
        node.parent=this;
        this.roots.push(node);
    }

    this.ui.update();
    return node;
};

viscomposer.scenegraph.SceneGraph.prototype.createTemplate=function(){
    return 'function(input){return {};}';
};
viscomposer.scenegraph.SceneGraph.prototype.getEnv=
viscomposer.scenegraph.SceneGraph.prototype.getEnv_=function(){
    var svgRoot=this.svgRoot;
    var svgRect=$(svgRoot)[0].getBoundingClientRect();
    var rootTransfrom={
        dom:svgRoot,
        x:0,y:0,
        width:svgRect.width,
        height:svgRect.height,
    };
    return {root:rootTransfrom,transform:rootTransfrom};
};

viscomposer.scenegraph.SceneGraph.prototype.run=function(simplify){
    var properties=this.properties;
    var svgRoot=this.svgRoot;
    while(svgRoot.lastChild){
        svgRoot.removeChild(svgRoot.lastChild);
    };
    svgRoot.containers=null;
    var rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x","0");
    rect.setAttribute("y","0");
    rect.setAttribute("width",parseInt(properties.width)+"px");
    rect.setAttribute("height",parseInt(properties.height)+"px");
    rect.setAttribute("style","stroke:#ccddff;stroke-width:2;fill:"+properties.color+";pointer-events:none;");
    this.canvasClip.setAttribute("width",parseInt(properties.width)+"px");
    this.canvasClip.setAttribute("height",parseInt(properties.height)+"px");
    svgRoot.appendChild(rect);
    svgRoot.canvasRect=rect;
    var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
    svgRoot.appendChild(defs);
    var appendContainer=function(node){
        var container=document.createElementNS("http://www.w3.org/2000/svg","g");
        container.setAttribute("transform","translate("+0+","+0+")");
        node.appendChild(container);
        return container;
    };

    var handler=viscomposer.Environment.handler;

    var roots=this.roots;
    var stack=[{node:{children:roots},data:[[]],env:[this.getEnv()],curChild:0}];
    while(stack.length>0){
        last=stack[stack.length-1];
        var pIndex=last.curChild;
        var lastNode=last.node;
        if(lastNode.children.length==0&&lastNode.workflow&&lastNode.workflow.hasLayout()){
            var workflow=this.indicatorWorkflow;
            workflow.node=lastNode;

            var indicating=true;
        }else{            
            p=last.node.children[last.curChild++];            
            
            if(!p){
                stack.pop();
                continue;
            }

            var workflow=p.workflow;
            var indicating=false;   
            
            if(!workflow){
                stack.pop();
                continue;
            }
        }
        workflow.prepare(simplify);
        var header=workflow.header;
        var dataSelector={};
        for(var i=0,ni=header.input.length;i<ni;++i){
            var inputport=header.input[i];
            dataSelector[inputport.port1.varname]=viscomposer.Environment.build(inputport.createTemplate());
        }

        var lastData=last.data;
        var lastEnv=last.env;
        var lastLoop=lastData.length;

        var inputInfo=workflow.getExternalPorts();
        var importedData=workflow.getImportedData();
        var extraData={};
        for(var j=0;j<importedData.length;++j){
            var dataInfo=importedData[j].dataInfo;
            extraData[importedData[j].varname]=dataInfo&&dataInfo.data;
        }

        var dataOut=[];
        var envOut=[];
        var workflowObj=viscomposer.Environment.build(workflow.createTemplate(simplify));
        for(var j=0,nj=lastLoop;j<nj;++j){
            var curEnv=window.env=lastEnv[j];
            curEnv.index=j;

            var dataIn=lastData[j][pIndex];
            var loop=header.getLoopNum(dataIn)||1;

            var input=[];
            for(var k=0;k<loop;++k){
                var obj={};
                for(var key in dataIn){
                    var prop=dataIn[key];
                    obj[key]=prop&&dataSelector[key](prop,k);
                }
                input.push(obj);
            }
            var output=workflowObj.run(input,loop,extraData,curEnv);
            workflow.properties.num+=output.loop;

            var curTrans=curEnv.transform&&curEnv.transform.dom||svgRoot;
            // render
            var geometry=output.geometry,
                env=output.env;
            curEnv.slibles=curEnv.slibles||{};
            curEnv.sliblesNum=output.loop;
            for(var k=0;k<output.loop;++k){
                var envk=env[k];
                var transk=envk.transform;
                var transkDom;
                if(transk&&transk.dom){
                    transkDom=transk.dom;

                    var parentTrans=transkDom.parentTrans.clipDom||curTrans;
                    parentTrans.containers=parentTrans.containers||{};
                    var container=parentTrans.containers[transkDom.module.uuid]||appendContainer(parentTrans);
                    parentTrans.containers[transkDom.module.uuid]=container;
                    container.appendChild(transkDom);

                    var clippath=transk.clippath;
                    var indicator=transk.indicator;
                    var resizer=transk.resizer;
                    if(clippath&&indicator&&resizer){
                        defs.appendChild(clippath);
                        //transkDom.appendChild(indicator);
                        indicator.clippath=clippath.firstChild;
                        indicator.g=transkDom.parentNode;
                        handler.copyHandler(indicator,'indicator');
                        //transkDom.appendChild(resizer);
                        resizer.clippath=clippath.firstChild;
                        resizer.g=transkDom.parentNode;
                        handler.copyHandler(resizer,'resizer');
                    }
                }else{
                    transkDom=curTrans;
                }
                var geok=geometry[k];
                for(var l=0,ln=geok.length;l<ln;++l){
                    var geokl=geok[l];
                    if(geokl.isIndicator){
                        handler.copyHandler(geokl,'indicatorPoint');
                    }else{
                        handler.copyHandler(geokl,geokl.geometryType);
                    }
                    switch(geokl.geometryType){
                    case 'axis':
                        var parentTrans=geokl.parentTrans.dom;
                        break;
                    default:
                        var parentTrans=geokl.parentTrans.clipDom;
                    }
                    parentTrans=parentTrans||transkDom;
                    parentTrans.containers=parentTrans.containers||{};
                    var container=parentTrans.containers[geokl.module.uuid]||appendContainer(parentTrans);
                    parentTrans.containers[geokl.module.uuid]=container;
                    container.appendChild(geokl);
                    geok[l].g=container;
                }

                var newEnv={};
                for(var key in curEnv){
                    var envValue=curEnv[key];
                    switch(key){
                    case 'layout':
                        var layoutEnv=newEnv.layout={};
                        for(var key in envValue){
                            if(envValue[key] instanceof Array){
                                layoutEnv[key]=envValue[key][k];
                            }else{
                                layoutEnv[key]=envValue[key];
                            }
                        }
                        break;
                    case 'parent':case 'slibles':
                        break;
                    default:
                        newEnv[key]=envValue;
                    }
                }
                for(var key in envk){
                    var envValue=envk[key];
                    switch(key){
                    case 'layout':
                        var layoutEnv=newEnv.layout=newEnv.layout||{};
                        for(var key in envValue){
                            layoutEnv[key]=envValue[key];
                        }
                        break;
                    case 'parent':case 'slibles':
                        break;
                    default:
                        newEnv[key]=envk[key];
                    }
                    if(k==0){
                        curEnv.slibles[key]=[];
                    }
                    curEnv.slibles[key].push(envk[key]);
                }

                envOut.push(newEnv);
            }
            // pop transform
            dataOut=dataOut.concat(output.data);
        }

        delete envOut.slibles;

        if(indicating){
            stack.pop();
            continue;
        }

        last={node:p,data:dataOut,env:envOut,curChild:0};
        stack.push(last);
    }
};