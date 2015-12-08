function(input){
	var diameter = 960,
		format = d3.format(",d"),
		color = d3.scale.category20c();

	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5);
  var p = bubble.nodes(classes(input));
  var output = [];
  for(var i = 1;i < p.length;i++){
    output.push({'r':p[i].r,'x':p[i].x,'y':p[i].y,'packageName':p[i].packageName})
  }
	return {
		output:output
	};

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	function classes(root) {
		var classes = [];
		function recurse(name, node) {
			if (node.children) 
			{
				node.children.forEach(function(child){ 
					recurse(node.name, child); 
				});
			}else 
			{
				classes.push({packageName: name, className: node.name, value: node.size});
			}
		}
		recurse(null, root);
		return {children: classes};
	}
}