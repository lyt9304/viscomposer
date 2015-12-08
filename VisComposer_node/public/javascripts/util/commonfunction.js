viscomposer.util.generateUUID=function(){

		// http://www.broofa.com/Tools/Math.uuid.htm
		
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = new Array(36);
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i == 8 || i == 13 || i == 18 || i == 23 ) {
			
					uuid[ i ] = '-';
			
				} else if ( i == 14 ) {
			
					uuid[ i ] = '4';
			
				} else {
			
					if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];

				}
			}
			
			return 'u'+uuid.join('');

		};

}();

viscomposer.util.copyObject=function(lhs,rhs){
	//TODO - deal with string
	for(var key in rhs){
		var item=rhs[key];
		if(item instanceof Object){
			if(item.clone){
				lhs[key]=item.clone();
			}else{
				lhs[key]={};
				viscomposer.util.copyObject(lhs[key],item);
			}
		}else{
			lhs[key]=item;
		}
	}
};

viscomposer.util.deleteObject=function(rhs){
	//TODO - deal with string
	for(var key in rhs){
		var item=rhs[key];
		if(item instanceof Object){
			if(item.destory){
				item.destory();
			}else{
				viscomposer.util.deleteObject(item);
			}
		}else{
			item=null;
		}
		delete rhs[key];
	}
};

viscomposer.util.storeObject=function(rhs,objectLib){
	if(rhs instanceof viscomposer.VObject){
		var uuid=rhs.uuid;
		objectLib[uuid]=rhs.store();
		return {type:"uuid",value:uuid};
		//TODO
	}

	if(!rhs instanceof Obejct){
		return {type:"normal",value:rhs};
	}
	
	var ret={};
	for(var key in rhs){
		if(rhs.hasOwnProperty(key)){
			var value=rhs[key];
			ret[key]=viscomposer.util.storeObject(value,objectLib);
		}
	}

	return {type:"object",value:uuid};
};

viscomposer.util.loadObject=function(rhs,objectLib){
	switch(rhs.type){
	case "uuid":
		var uuid=rhs.value;
		return viscomposer.VObject.load(objectLib[uuid]);
	case "object":
		var ret={};
		for(var key in rhs){
			if(rhs.hasOwnProperty(key)){
				var value=rhs[key];
				ret[key]=viscomposer.util.loadObject(value,objectLib);
			}
		}
		return ret;
	case "normal":default:
		return rhs.value;
	}

	if(rhs instanceof viscomposer.VObject){
		var uuid=rhs.uuid;
		objectLib[uuid]=rhs.store();
		return {type:"uuid",value:uuid};
		//TODO
	}

	if(!rhs instanceof Obejct){
		return {type:"normal",value:rhs};
	}
	
	var ret={};
	for(var key in rhs){
		if(rhs.hasOwnProperty(key)){
			var value=rhs[key];
			ret[key]=viscomposer.util.storeObject(value,objectLib);
		}
	}

	return {type:"object",value:uuid};
};

viscomposer.util.processConflict=function(str0,list){
	var str=str0;
	if(list[str.toLowerCase()]){
		var no=2;
		do{
			str=str0+'_'+no;
			++no;
		}while(list[str.toLowerCase()]);
	}
	list[str.toLowerCase()]=true;

	return str;
};

viscomposer.util.processConflict2=function(str0,list){
	var str=str0;
	if(list[str.toLowerCase()]){
		var no=2;
		do{
			str=str0+' #'+no;
			++no;
		}while(list[str.toLowerCase()]);
	}
	list[str.toLowerCase()]=true;

	return str;
};

viscomposer.util.isEmpty=function(obj){
	for(var key in obj) {
		if(obj.hasOwnProperty(key)){
			return false;
		}
	}return true;
};

viscomposer.util.addIndent=function(str,num){
	var indent='';
	for(var i=0;i<num;++i){
		indent+='    ';
	}
	return str.replace(/\n+/g, '\n'+indent).replace(/\r+/g, '')
};

viscomposer.util.angle=function(start,end){
	var diff_x=end.x-start.x,
		diff_y=end.y-start.y;
	return 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
};
viscomposer.util.centerWindow = function(selector){
    var popWindow=$(selector);
    var popWindowLeft=(parseFloat($(window).width()) - parseFloat(popWindow.width())) / 2;
    popWindow.css('left', popWindowLeft+"px");
};

viscomposer.util.PanelPositionList={
    Circle:[370, 100],
    Text:[370, 100],
    View:[580, 150],
    Rect:[370, 100],
    PolyLine:[370, 100],
    Line:[370,100],
    Path:[370,100],

    barchart:[100, 160],
    crossmatrix:[700, 220],
    parallelcoordinates:[700, 220],

};

