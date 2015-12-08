function(input){
    var width = 960,
        height = 500;
    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);
    var outPort = {links:[],nodes:[]};

    force.nodes(input.nodes)
        .links(input.links)
        .start();
    for(var i = 0;i < input.links.length;i++){
		input.links[i].source.weights=input.links[i].source.weights||0;
		input.links[i].source.weights+=input.links[i].value;
		input.links[i].target.weights=input.links[i].target.weights||0;
		input.links[i].target.weights+=input.links[i].value;
        outPort.links.push({"source_x":input.links[i].source.x,"source_y":input.links[i].source.y,
                            "target_x":input.links[i].target.x,"target_y":input.links[i].target.y,
                            "weight":input.links[i].value});
    }
	for(var j = 0;j < input.nodes.length;j++){
		outPort.nodes.push({
			"name":input.nodes[j].name,
			"x":input.nodes[j].x,
			"y":input.nodes[j].y,
			"weight":input.nodes[j].weight,
			"group":input.nodes[j].group
		});
	}
  	return {
		output:outPort
	};
}