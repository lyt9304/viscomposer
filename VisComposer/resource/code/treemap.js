function(input){ 
 var round = Math.round,
        size = [1080, 720], // width, height
        padding = null,// padding between parent node and children node
        pad = PadNull,
        mode = "squarify",
        ratio = 0.5 * (1 + Math.sqrt(5)), // golden ratio
        data = null,
        nodes = null;
        // Compute the area for each child based on value & scale.
 var color = d3.scale.category20c();
    function scale(children, k) {
        var i = -1,
            n = children.length,
            child,
            area;
        while (++i < n) {
            area = (child = children[i]).weight * (k < 0 ? 0 : k);
            child.area = isNaN(area) || area <= 0 ? 0 : area;
        }
    }

    // Recursively arranges the specified node's children into squarified rows.
    function squarify(node) {
        var children = node.children;
        if (children && children.length) {

            var rect = pad(node),
                row = [],
                child,
                remaining = [],
                best = Infinity, // the best row score so far
                score, // the current row score
                u = mode === "slice" ? rect.dx
                    : mode === "dice" ? rect.dy
                    : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx
                    : Math.min(rect.dx, rect.dy), // initial orientation
                n;
			for(var s = 0;s < children.length;s++){
				var z = remaining.push(children[s]);
			}
			scale(remaining, rect.dx * rect.dy / node.weight);
			row.area = 0;
			while ((n = remaining.length) > 0) {
				row.push(child = remaining[n - 1]);
				row.area += child.area;
				if (mode !== "squarify" || (score = worst(row, u)) <= best) { // continue with this orientation
					remaining.pop();
					best = score;
				} else { // abort, and try a different orientation
					row.area -= row.pop().area;
					position(row, u, rect, false);
					u = Math.min(rect.dx, rect.dy);
					row.length = row.area = 0;
					best = Infinity;
				}
			}
			if (row.length) {
				position(row, u, rect, true);
				row.length = row.area = 0;
			}
			children.forEach(squarify);
		}
	}

        // Computes the score for the specified row, as the worst aspect ratio.
    function worst(row, u) {
        var s = row.area,
            r,
            rmax = 0,
            rmin = Infinity,
            i = -1,
            n = row.length;
        while (++i < n) {
            if (!(r = row[i].area)) continue;
            if (r < rmin) rmin = r;
            if (r > rmax) rmax = r;
        }
        s *= s;
        u *= u;
        return s
            ? Math.max((u * rmax * ratio) / s, s / (u * rmin * ratio))
            : Infinity;
    }

        // Positions the specified row of nodes. Modifies `rect`.
    function position(row, u, rect, flush) {
        var i = -1,
            n = row.length,
            x = rect.x,
            y = rect.y,
            v = u ? round(row.area / u) : 0,
                o;
            if (u == rect.dx) { // horizontal subdivision
                if (flush || v > rect.dy)
                    v = rect.dy; // over+underflow
                while (++i < n) {
                    o = row[i];
                    o.x = x;
                    o.y = y;
                    o.dy = v;
                    x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
                }
                o.z = true;
                o.dx += rect.x + rect.dx - x; // rounding error
                rect.y += v;
                rect.dy -= v;
            } else { // vertical subdivision
            if (flush || v > rect.dx)
                v = rect.dx; // over+underflow
                while (++i < n) {
                    o = row[i];
                    o.x = x;
                    o.y = y;
                    o.dx = v;
                    y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
                }
                o.z = false;
                o.dy += rect.y + rect.dy - y; // rounding error
                rect.x += v;
                rect.dx -= v;
            }
        }

    function treemap(dataObj_ex) {
        function struct(parent,value){
            this.parent = parent;
            this.value = value;
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.weight = 0;
            this.children = [];
        };
        function find(value,struct){
            for(var i = 0;i < struct.children.length;i++){
                if(value == struct.children[i].value){
                    return struct.children[i];
                }
            }
            return null;
        }
        function cal_weight(node){
            if(node.children.length == 0)
                return node.weight;
            for(var x = 0;x < node.children.length;x++){
                node.weight += cal_weight(node.children[x]);
            }
            return node.weight;
        }
        var dataObj = [];
        for(var z = 0; z < dataObj_ex.length;z++){
            var p = [];
            p.push(dataObj_ex[z]["DISTRICT"]);
            p.push(dataObj_ex[z]["STATE"]);
            p.push(dataObj_ex[z]["COMPANY NAME"]);
            p.push(dataObj_ex[z]["LIABILITIES (MILLIONS)"]);
            dataObj.push(p);
        }
        console.log(dataObj);
        var root = new struct(null,'root');
        var rows = dataObj.length;
        var columns = dataObj[0].length;
        console.log(rows,columns);
        nodes = root;
        for(var i = 0;i < rows;i++){
            var ptr = nodes;
            for(var j = 0;j < columns;j++){
                if(j == columns - 1){
                    ptr.weight = Math.sqrt(parseInt(dataObj[i][j]));
                    ptr.district = dataObj[i][1];
                    break;
                }
                var target = find(dataObj[i][j],ptr);
                if(target == null){
                    var son = new struct(ptr,dataObj[i][j]);
                    ptr.children.push(son);
                    ptr = son;
                }
                else{
                    ptr = target;
                }
            }
        }
        cal_weight(root);
        var root = nodes;
        root.x = 0;
        root.y = 0;
        root.dx = size[0];
        root.dy = size[1];
        scale([root], root.dx * root.dy / root.weight);
        squarify(root);
        return nodes;
    }
    
    function PadNull(node) {
        return {x: node.x, y: node.y, dx: node.dx, dy: node.dy, value: node.value};
    }
    //构建treemap，输出结构n
    var n = treemap(input);
    console.log(n);
    //params存储各个矩形的大小和位置
    var params = [];
    function pushNode(node){
        for(var i = 0;i < node.children.length;i++){
            if(node.children[i].children.length == 0){
                params.push([node.children[i].x,node.children[i].y,node.children[i].dx,node.children[i].dy,color(node.children[i].district),node.children[i].value]);
                if(i == node.children.length - 1)
                    return;
            }
            else{
                pushNode(node.children[i]);
            }
        }
    }
    pushNode(n);
    var portOut = {
        'output':[]
    }
    for(var i = 0;i < params.length;i++){
        portOut.output.push({"x":params[i][0],"y":params[i][1],"width":params[i][2],"height":params[i][3],"color":params[i][4],"text":params[i][5]});
    }
    console.log(portOut);
	
	return {output:portOut};
	
}