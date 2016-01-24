createBar = function createBar(top_pos,left_pos,bar_id,breadth,value,color,col_heading,map_numb) { 
		data = { id : bar_id+"bar", top : top_pos+"px", left : left_pos+"%" }
		//alert(map_numb);
		return $("<div />", { 
			"class" : "bar",
			'id' : data.id,
			'title': col_heading+" = "+value
			 })
		.css({
			position: "absolute",
			"top" : data.top,
			"left": data.left,
			"width":breadth+"%",
			"height":"25px",
			"background-color": "#"+color
		})
		.hover(function(){
		    if(document.getElementById(this.id+"_graph")){
            $("#"+this.id+"_graph").css("background-color","black");
            }
			else{
			call_createGraph(parseInt(this.id));
			$("#"+this.id+"_graph").css("background-color","black");
			//create_graph
			}
			
			if(document.getElementById(this.id+"_graph_colwise")){
            $("#"+this.id+"_graph_colwise").css("background-color","black");
            }
			else{
			call_createGraph_colwise(this.id);
			$("#"+this.id+"_graph_colwise").css("background-color","black");
			//create_graph
			}
			
			},function(){
			if(document.getElementById(this.id+"_graph")){
            $("#"+this.id+"_graph").css("background-color","whiteSmoke");
            }
			
			if(document.getElementById(this.id+"_graph_colwise")){
            $("#"+this.id+"_graph_colwise").css("background-color","whiteSmoke");
            }
			
		})
		.appendTo(document.getElementById("bar_chart"+map_numb));
	};	
createGraph = function createGraph(left_pos,graph_id,breadth,value,col_heading,min,max) { 
		data_bar = { id : graph_id+"bar_graph", bottom : "2px", left : (parseFloat(left_pos)+8.0) }
		return $("<div />", { 
			"class" : "graph",
			'id' : data_bar.id,
			'title': col_heading+" = "+value
			 })
		.css({
			position: "absolute",
			"left": data_bar.left+"px",
			"width":breadth+"px",
			"height":parseFloat(((parseFloat($("#bar_graph_div").css('height'))-25)*(parseFloat(value)-parseFloat(min)))/(parseFloat(max)-parseFloat(min)))+"px"
		})
		.hover(function(){
		    $("#"+this.id).css("background-color","black");
            },function(){
			$("#"+this.id).css("background-color","whiteSmoke");
		})
		.appendTo(document.getElementById("bar_graph_div"));
	};
	
createGraph_colwise = function createGraph_colwise(left_pos,graph_id,breadth,value,col_heading,min,max){
        data_bar_colwise = { id : graph_id+"bar_graph_colwise", bottom : "2px", left : (parseFloat(left_pos)+8.0) }
		return $("<div />", { 
			"class" : "graph_colwise",
			'id' : data_bar_colwise.id,
			'title': col_heading+" = "+value
			 })
		.css({
			position: "absolute",
			"left": data_bar_colwise.left+"px",
			"width":breadth+"px",
			"height":parseFloat(((parseFloat($("#bar_graph_div").css('height'))-25)*(parseFloat(value)-parseFloat(min)))/(parseFloat(max)-parseFloat(min)))+"px"
		})
		.hover(function(){
		    $("#"+this.id).css("background-color","black");
            },function(){
			$("#"+this.id).css("background-color","whiteSmoke");
		})
		.appendTo(document.getElementById("bar_graph_colwise_div"));
};	