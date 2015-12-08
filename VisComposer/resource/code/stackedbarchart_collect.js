function(attr,species){
	var sectionNum=5
	var minmax=getMinMax(attr);
	var min=minmax[0],max=minmax[1];
    var x=[],y=[];
	for(var i=0;i<sectionNum;++i){
		x.push((min+(max-min)*(i+0.5)/(sectionNum-1)));
		y.push([0,0,0]);
	}
    for(var i=0;i<attr.length;++i){
		var section=parseInt((attr[i]-min)/(max-min)*(sectionNum-1));
		switch(species[i]){
		case 'setosa':
			++y[section][0];break;
		case 'versicolor':
			++y[section][1];break;
		case 'virginica':
			++y[section][2];break;
		}
    }
    return {output:{x:x,y:y}};
}