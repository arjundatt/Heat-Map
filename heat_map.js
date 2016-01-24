/* Copyright (C) 2013, arjun d. sharma
* This file is part of Heat-Map.js.
*/

/* This is the driver code for the web application*/

var csv_data="";
var count_col=0;
var comma=new Array();
var min_total=9999999;
var max_total=-9999999;
var color_chart_low=["178A02","3ED618","94E95B","A6FF83","C8FFA3"];
var color_chart_high=["ffd5d5","ffbba9","ff7a74","ff1e15","d50101"];
var color_chart_opt_low=[["024d92","015fec","3094ff","76ceff","bbe7ff"],["178A02","3ED618","94E95B","A6FF83","C8FFA3"],["d50101","ff1e15","ff7a74","ffbba9","ffd5d5"],["eeac06","FFD700","FFF700","FFFF66","FFFF66"],["66023C","800080","BF00FF","DA70D6","E0B0FF"]];
var color_chart_opt_high=[["bbe7ff","76ceff","3094ff","015fec","024d92"],["C8FFA3","A6FF83","94E95B","3ED618","178A02"],["ffd5d5","ffbba9","ff7a74","ff1e15","d50101"],["FFFF66","FFFF66","FFF700","FFD700","eeac06"],["E0B0FF","DA70D6","BF00FF","800080","66023C"]];
var reg=new RegExp(/\t/);
var mode;
var no_of_textarea=1;

//Re-initiates state for next usage
function cleanUP(){
	if(file_upload_FLAG === 1){
		document.getElementById('csv_data1').value = ajax_call(file_name);
		$('#file_uploader_div').hide();
	}
	csv_data="";
	count_col=0;
	comma=[];
	min_total=9999999;
	max_total=-9999999;
	$('#col_list').html("");
	$('#bar_chart').html("");
	$('#row_list').html("");
	//$('#max_min_values').remove();
	retrieve_data('');
}

//Re-initiates state for next usage in multi_map mode
function cleanUp_multi_map(){
	csv_data="";
	count_col=0;
	comma=[];
	min_total=9999999;
	max_total=-9999999;
	$('#col_list').html("");
	$('#bar_chart').html("");
	$('#row_list').html("");
	$('.max_min_values').remove();
	for(i=2;i<no_of_textarea;i++){
		$("#col_list"+i).remove;
		$("#bar_chart"+i).remove;
		//$('#color_chart'+i+' .max_min_values').remove();
	}
}

// Inits mode change. Two mode: 1.single map mode 2.multi user mode
function mode_change(temp_mode){
	mode=temp_mode;
	if(mode === 2){
		file_upload_FLAG = 0;
		$('#multi_map').css("background-color","rgb(83, 1, 1)");
		$('#single_map').css("background-color","black");
		$('#graph_containers').hide();
	}
	else if(mode === 1){
		$('#single_map').css("background-color","rgb(83, 1, 1)");
		$('#multi_map').css("background-color","black");
	}
	/*****PASS THE PATH OF THE FILE 'generate_heamap.txt'(relative to the folder 'www') HERE. FOR EXAMPLE, IF THIS FILE'S ABSOLUTE PATH IS './wamp/www/upload/generate_heatmap.txt' THEN PASS THE PATH AS 'upload/generate_heatmap.txt'.*****/
	AJAX_retrieve_file_meta_data('generate_heatmap.txt'); 
}

function call_multi_mode(){
	document.multi_mode_form.submit();
}

// Resizes textarea
function incr_textarea(){
	var textarea=document.createElement('textarea');
	textarea.setAttribute('class','data_textarea');
	no_of_textarea++;
	textarea.id = "csv_data"+no_of_textarea;
	set_widthOFtextarea(no_of_textarea);
	textarea.value="Add Data in CSV or TSV fromat";
	textarea.style.width=(95/no_of_textarea)+"%";
	textarea.style.left=(0.3+1+((no_of_textarea-1)*95/no_of_textarea))+"%";
	document.getElementById('bar_chart').setAttribute('style','width:'+parseFloat(88/no_of_textarea)+'%;');
	document.getElementById('col_list').setAttribute('style','width:'+parseFloat(88/no_of_textarea)+'%;');
	document.getElementById('data_div').appendChild(textarea);
	add_heatmap_div();
	add_color_chart();
}

function set_widthOFtextarea(numb){
	for(var i=0;i<numb;i++){
		$('#csv_data'+(i+1)).css('width',(95/no_of_textarea)+"%");
		$('#csv_data'+(i+1)).css('left',(1+(i*95/no_of_textarea))+"%");
	}
}

function add_heatmap_div(){
	var h_div=document.createElement('div');
	h_div.setAttribute('class','heat_map_class');
	h_div.setAttribute('id','bar_chart'+no_of_textarea);
	for(var i=2;i<no_of_textarea;i++){
	document.getElementById('bar_chart'+i).setAttribute('style','width:'+parseFloat(88/no_of_textarea)+'%;left:'+parseFloat(10+((i-1)*90/no_of_textarea))+'%;');
	}
	h_div.setAttribute('style','width:'+parseFloat(88/no_of_textarea)+'%;left:'+parseFloat(10+((no_of_textarea-1)*90/no_of_textarea))+'%;');
	document.getElementById('map_div').appendChild(h_div);
}

// Adds color coding to heat map
function add_color_chart(){
	$('body').append("<div id='color_chart_cover"+no_of_textarea+"' style='position: absolute;top: 174px;width: 14.9%;background-color: rgb(255, 255, 255);'><div id='color_opt_low"+no_of_textarea+"' style='position: absolute;left: 21%;width: 47px;height: 150px;background-color: whitesmoke;border: 1px solid rgb(139, 139, 139);border-radius: 3px;z-index: 1;visibility:hidden;'><ul><li id='color_low_1_"+no_of_textarea+"' class='color_opt_list' style='background:#024d92;'></li></ul><ul><li id='color_low_2_"+no_of_textarea+"' class='color_opt_list' style='background:#178A02;'></li></ul><ul><li id='color_low_3_"+no_of_textarea+"' class='color_opt_list' style='background:#d50101;' ></li></ul><ul><li id='color_low_4_"+no_of_textarea+"' class='color_opt_list' style='background:#FFD700;'></li></ul><ul><li id='color_low_5_"+no_of_textarea+"' class='color_opt_list' style='background:#66023C;'></li></ul></div><div id='color_opt_high"+no_of_textarea+"' style='position: absolute;left: 100%;width: 47px;height: 150px;background-color: whitesmoke;border: 1px solid rgb(139, 139, 139);border-radius: 3px;z-index:1;visibility: hidden;'><ul><li id='color_high_1_"+no_of_textarea+"' class='color_opt_list' style='background:#02339B;' ></li></ul><ul><li id='color_high_2_"+no_of_textarea+"' class='color_opt_list' style='background:#178A02;'></li></ul><ul><li id='color_high_3_"+no_of_textarea+"' class='color_opt_list' style='background:#DD2501;'></li></ul><ul><li id='color_high_4_"+no_of_textarea+"' class='color_opt_list' style='background:#FFD700;'></li></ul><ul><li id='color_high_5_"+no_of_textarea+"' class='color_opt_list' style='background:#66023C;'></li></ul></div><div id='color_chart"+no_of_textarea+"' class='chart' style='width: 100%;position: absolute;color: #777;top: 0px;left: 0%;background: #F3F3F3;border: 1px solid rgb(80, 80, 80);overflow: hidden;padding: 5px 7px;-moz-border-radius: 3px;border-radius: 3px;height: 69px;font-size: 11px;line-height: 11px;vertical-align: baseline;'><ul style='list-style-type: none;overflow: hidden;clear: both;-webkit-padding-start: 14px;-moz-padding-start: 14px'><li id='q1_"+no_of_textarea+"' class='q1' title=''></li><li id='q2_"+no_of_textarea+"' class='q2'></li><li id='q3_"+no_of_textarea+"' class='q3'></li><li id='q4_"+no_of_textarea+"' class='q4'></li><li id='q5_"+no_of_textarea+"' class='q5'></li><li id='q6_"+no_of_textarea+"' class='q6'></li><li id='q7_"+no_of_textarea+"' class='q7'></li><li id='q8_"+no_of_textarea+"' class='q8'></li><li id='q9_"+no_of_textarea+"' class='q9'></li><li id='q10_"+no_of_textarea+"' class='q10'></li><li id='q11_"+no_of_textarea+"' class='q11' title=''></li></ul><p id='more' class='more' style='position: absolute;top: 53px;right: 16px;'>high</p><p id='less' class='less' style='position: absolute;top: 53px;left: 21px;'>low</p></div></div>");
	//alert((3+(15.1*(no_of_textarea-1))));
	
	$('#color_low_1_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_low[0][0],1,1,parseInt(this.id.replace("color_low_1_","")));}
	});
	$('#color_low_2_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_low[1][0],2,1,parseInt(this.id.replace("color_low_2_","")));}
	});
	$('#color_low_3_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_low[2][0],3,1,parseInt(this.id.replace("color_low_3_","")));}
	});
	$('#color_low_4_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_low[3][0],4,1,parseInt(this.id.replace("color_low_4_","")));}
	});
	$('#color_low_5_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_low[4][0],5,1,parseInt(this.id.replace("color_low_5_","")));}
	});
	$('#color_high_1_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_high[0][0],1,2,parseInt(this.id.replace("color_high_1_","")));}
	});
	$('#color_high_2_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_high[1][0],2,2,parseInt(this.id.replace("color_high_2_","")));}
	});
	$('#color_high_3_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_high[2][0],3,2,parseInt(this.id.replace("color_high_3_","")));}
	});
	$('#color_high_4_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_high[3][0],4,2,parseInt(this.id.replace("color_high_4_","")));}
	});
	$('#color_high_5_'+no_of_textarea).bind({
	click: function(){changeCOLOR_MAP(color_chart_opt_high[4][0],5,2,parseInt(this.id.replace("color_high_5_","")));}
	});
	
	
	if(no_of_textarea === 2)
		$('#color_chart_cover'+no_of_textarea).css('left',(18.2*(no_of_textarea-1))+'%');
	else
		$('#color_chart_cover'+no_of_textarea).css('left',(2+(16.3*(no_of_textarea-1)))+'%');
	
	$("#q1_"+no_of_textarea).toggle(function(){
	$('#color_opt_low'+(this.id.replace("q1_",""))).css("visibility","visible");
	},
	function(){
	$('#color_opt_low'+(this.id.replace("q1_",""))).css("visibility","hidden");
	});
	$("#q11_"+no_of_textarea).toggle(function(){
	$('#color_opt_high'+(this.id.replace("q11_",""))).css("visibility","visible");
	},
	function(){
	$('#color_opt_high'+(this.id.replace("q11_",""))).css("visibility","hidden");
	});
	
	$('#color_opt_low'+no_of_textarea+' ul').css({'list-style-type': 'none','overflow': 'hidden','clear': 'both','-webkit-padding-start': '17px','-webkit-margin-after': '5px','-webkit-margin-before': '12px','-moz-padding-start': '17px','-moz-margin-after': '5px','-moz-padding-before': '12px'});
	$('#color_opt_high'+no_of_textarea+' ul').css({'list-style-type': 'none','overflow': 'hidden','clear': 'both','-webkit-padding-start': '17px','-webkit-margin-after': '5px','-webkit-margin-before': '12px','-moz-padding-start': '17px','-moz-margin-after': '5px','-moz-padding-before': '12px'});

	$("#color_chart"+no_of_textarea+" li").css({'float':'left','margin-right': '1px','width': '8%','height': '14px'});
}

//Calculates normalized meterics
function compute_min_max_total(arr,count){
	var columns_min=new Array();
	var columns_max=new Array();
	for(var i=1;i<arr.length;i++){
		columns_min[i-1]=(arr[i].split(reg)).sort(function(a,b){return a-b})[1];
		columns_max[i-1]=(arr[i].split(reg)).sort(function(a,b){return a-b})[count-1];
	}
	columns_min.sort(function(a,b){return a-b});
	columns_max.sort(function(a,b){return a-b});

	if(min_total>columns_min[0])
		min_total=columns_min[0];
	if(max_total<columns_max[columns_max.length-1])
		max_total=columns_max[columns_max.length-1];
}

function multi_map_generate(){
	cleanUp_multi_map();
	try{
		var row_list_prev='',row_list_temp='';
		if(no_of_textarea > 1){
		for(var i=1;i<=no_of_textarea;i++){
			var csv_data_temp=document.getElementById('csv_data'+i).value;
			var lines=csv_data_temp.split("\n");
			for(var j=0;j<(lines.length-1);j++){
				row_list_temp=lines[j].split(reg)[0]+"\t";
			}
			if(row_list_prev !== ''){
				if(!(row_list_prev.localeCompare(row_list_temp))){
					if(i !== 1){
						retrieve_data_multi_map(csv_data_temp,i);
					}
				
				}
				else{
						throw("The row-names of some(or all) of the data entries don't match.");
				}
			}
			else if(i === 1){
						retrieve_data(csv_data_temp);	
			}
			
			row_list_prev=row_list_temp;
			row_list_temp="";
		}
		}
		else{
			retrieve_data('');
		}
		
	}
	catch(e){
		alert("Error : " + e);
	}
}

function retrieve_data_multi_map(data_rec,map_numb){
	csv_data=data_rec;
	if(valid_csv(csv_data)){
		var lines=csv_data.split("\n");
		count_col=lines[0].split(reg).length;
		min_total=9999999;
		max_total=-9999999;
		compute_min_max_total(lines,count_col);
		$("#bar_chart"+map_numb).css("height",(25*(lines.length-1))+"px");
		$("#map_div").css("height",((25*(lines.length-1))+50)+"px");
		var width=99.6/(count_col-1);
		$("#map_div").append('<div id="col_list'+map_numb+'" style="position: relative;left: '+(parseFloat(10+((map_numb-1)*90/no_of_textarea)))+'%;top: 0px;width: '+parseFloat(88/no_of_textarea)+'%;font-size: 10px;color: dimGray;"></div>');
		for(var i=1;i<lines.length;i++){
			var col_values=lines[i].split(reg);
			for(var j=1;j<count_col;j++){
				createBar((i-1)*25,(j-1)*width,map_numb+"_"+(i-1)+"_"+(j-1),width,col_values[j],color_value(col_values[j],min_total,max_total),(lines[0].split(reg))[j],map_numb);
				if(i===1){
					$("#col_list"+map_numb).append('<div class="col_list_class" style="left:'+((j-1)*width)+'%;width:'+(width)+'%;" title="'+lines[0].split(reg)[j]+'">'+lines[0].split(reg)[j]+'</div></div>');
				  }
			}
			//$("#row_list").append('<div class="list" style="">'+lines[i].split(reg)[0]+'</div>');
		}
		$("#color_chart"+map_numb).prepend('<p class="max_min_values" style="margin-left: 13PX;">Lowest Value = '+min_total+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#Map&nbsp;:&nbsp;'+map_numb+'<br/>Highest Value = '+max_total+'</p>');
		
	}
}


function retrieve_data(data_rec){
	csv_data=document.getElementById('csv_data1').value;
	if(valid_csv(csv_data)){
		var lines=csv_data.split("\n");
		count_col=lines[0].split(reg).length;
		compute_min_max_total(lines,count_col);
		$("#bar_chart").css("height",(25*(lines.length-1))+"px");
		$("#map_div").css("height",((25*(lines.length-1))+50)+"px");
		var width=99.6/(count_col-1);
		for(var i=1;i<lines.length;i++){
			var col_values=lines[i].split(reg);
			for(var j=1;j<count_col;j++){
				createBar((i-1)*25,(j-1)*width,(i-1)+"_"+(j-1),width,col_values[j],color_value(col_values[j],min_total,max_total),(lines[0].split(reg))[j],"");
				if(i===1){
					$("#col_list").append('<div class="col_list_class" style="left:'+((j-1)*width)+'%;width:'+(width)+'%;" title="'+lines[0].split(reg)[j]+'">'+lines[0].split(reg)[j]+'</div>');
				  }
			}
			$("#row_list").append('<div class="list" style="" title="'+lines[i].split(reg)[0]+'">'+lines[i].split(reg)[0]+'</div>');
		}
		//$('.max_min_values').remove();
		$("#color_chart").prepend('<p class="max_min_values" style="margin-left: 13PX;">Lowest Value = '+min_total+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#Map&nbsp;:&nbsp;1<br/>Highest Value = '+max_total+'</p>');
	}
}

function call_createGraph(value){
	$("[id$='bar_graph']").remove();
	$("#graph_title_text").remove();
	var lines=csv_data.split("\n");
	var col_values=lines[value+1].split(reg);
	for(var j=1;j<count_col;j++){
		var width_bar_graph=(parseFloat($("#bar_graph_div").css("width"))/(count_col-1))-1;
		createGraph(((j-1)*width_bar_graph),value+"_"+(j-1),width_bar_graph,col_values[j],(lines[0].split(","))[j],min_total,max_total);
	}
	$("#graph_title").html("<span id='graph_title_text'>"+col_values[0]+"</span>");
}

function call_createGraph_colwise(value){
	$("[id$='bar_graph_colwise']").remove();
	$("#colwise_graph_title_text").remove();
	value=value.replace("bar","");
	var colNo=parseInt(value.split("_")[1])
	var lines=csv_data.split("\n");
	for(var i=1;i<lines.length;i++){
		var width_bar_graph=(parseFloat($("#bar_graph_div").css("width"))/(lines.length-1))-1.1;
		lines[i].split(reg)[colNo]
		createGraph_colwise(((i-1)*(width_bar_graph+1)),(i-1)+"_"+colNo,width_bar_graph,lines[i].split(reg)[colNo+1],lines[i].split(reg)[0],min_total,max_total);
	}
	$("#colwise_graph_title").html("<span id='colwise_graph_title_text'>"+lines[0].split(reg)[colNo+1]+"</span>");
}

function color_value(value,min_v,max_v){
	var scaled_val=parseFloat((11*(parseFloat(value)-parseFloat(min_v)))/(parseFloat(max_v)-parseFloat(min_v)));
	if(scaled_val >=0 && scaled_val <=1 )
	{
		return color_chart_low[0];
	}
	else if(scaled_val >1 && scaled_val <=2 )
	{
		return color_chart_low[1];
	}
	else if(scaled_val >2 && scaled_val <=3 )
	{
		return color_chart_low[2];
	}
	else if(scaled_val >3 && scaled_val <=4 )
	{
		return color_chart_low[3];
	}
	else if(scaled_val >4 && scaled_val <=5 )
	{
		return color_chart_low[4];
	}
	else if(scaled_val >5 && scaled_val <=6 )
	{
		return "f5f5f5";
	}
	else if(scaled_val >6 && scaled_val <=7 )
	{
		return color_chart_high[0];
	}
	else if(scaled_val >7 && scaled_val <=8 )
	{
		return color_chart_high[1];
	}
	else if(scaled_val >8 && scaled_val <=9 )
	{
		return color_chart_high[2];
	}
	else if(scaled_val >9 && scaled_val <=10 )
	{
		return color_chart_high[3];
	}
	else if(scaled_val >10 && scaled_val <=11 )
	{
		return color_chart_high[4];
	}
	else
	{
		return "000000"
	}

}

function valid_csv(csv){
	var lines=csv.split(/\n/g);
	if(lines.length<1){alert("Invalid CSV data");
		return false;
	}
	else{
		for(var i=0;i<lines.length;i++){
			if(i===0){
				comma=lines[i].split(reg);

				count_col=comma.length;
			}
			else{
				comma=lines[i].split(reg);
				if(count_col !== comma.length){
					alert("Invalid CSV data");
					return false;
				}
			}
		}
	}
	return true;
}

function changeCOLOR_MAP(clr_click,opt,level,map_numb){
	clr_click="#"+clr_click;
	if(clr_click === $('#q1_'+map_numb).css('background') && level === 1){;}
	else if(clr_click === $('#q11'+map_numb).css('background') && level === 2){;}
	else if(level === 1){
		color_chart_low=color_chart_opt_low[opt-1];
		//alert(tell_COLOR_CODE(($('#q11_'+map_numb).css('background-color')),2)+"  "+$('#q11_'+map_numb).css('background-color'));////problem!!!color matching----high and low to be kept same as before
		color_chart_high=color_chart_opt_high[tell_COLOR_CODE(($('#q11_'+map_numb).css('background-color')),2)];
		changeCOLOR_low(map_numb);
	}
	else if(level === 2){
		color_chart_high=color_chart_opt_high[opt-1];
		color_chart_low=color_chart_opt_low[tell_COLOR_CODE(($('#q1_'+map_numb).css('background-color')),1)];
		changeCOLOR_high(map_numb);
	}
	
	if(mode === 1){
		$('#color_chart .max_min_values').remove();
		cleanUP();
	}
	else if(mode === 2){
		csv_data=document.getElementById('csv_data'+map_numb).value;
		count_col=0;
		comma=[];
		min_total=9999999;
		max_total=-9999999;
		if(map_numb === 1){
			$('#bar_chart').html("");
			$('#row_list').html("");
		}
		else{
			$('#bar_chart'+map_numb).html("");
			$('#col_list'+map_numb).html("");
		}
		$('#color_chart'+map_numb+' .max_min_values').remove();
		/*for(var i=2;i<=no_of_textarea;i++){
			$('#bar_chart'+i).html("");
		}*/
		//multi_map_generate();
		if(map_numb === 1){
			$('#color_chart .max_min_values').remove();		
			retrieve_data('');
		}
		else
			retrieve_data_multi_map(csv_data,map_numb);
	}
	$('div[id^="color_opt_low"]').css("visibility","hidden");
	$('div[id^="color_opt_high"]').css("visibility","hidden");
}

function changeCOLOR_low(map_numb){
	$('#q1_'+map_numb).css('background',"#"+color_chart_low[0]);
	$('#q2_'+map_numb).css('background',"#"+color_chart_low[1]);
	$('#q3_'+map_numb).css('background',"#"+color_chart_low[2]);
	$('#q4_'+map_numb).css('background',"#"+color_chart_low[3]);
	$('#q5_'+map_numb).css('background',"#"+color_chart_low[4]);
}

function changeCOLOR_high(map_numb){
	$('#q7_'+map_numb).css('background',"#"+color_chart_high[0]);
	$('#q8_'+map_numb).css('background',"#"+color_chart_high[1]);
	$('#q9_'+map_numb).css('background',"#"+color_chart_high[2]);
	$('#q10_'+map_numb).css('background',"#"+color_chart_high[3]);
	$('#q11_'+map_numb).css('background',"#"+color_chart_high[4]);
}

function tell_COLOR_CODE(color,level){
if(level === 1){
	if(color === hexToRgb("#"+color_chart_opt_low[0][0]) || color === color_chart_opt_low[0][0]){
		return 0;
	}
	else if(color === hexToRgb("#"+color_chart_opt_low[1][0]) || color === color_chart_opt_low[1][0]){
		return 1;
	}
	else if(color === hexToRgb("#"+color_chart_opt_low[2][0]) || color === color_chart_opt_low[2][0]){
		return 2;
	}
	else if(color === hexToRgb("#"+color_chart_opt_low[3][0]) || color === color_chart_opt_low[3][0]){
		return 3;
	}
	else if(color === hexToRgb("#"+color_chart_opt_low[4][0]) || color === color_chart_opt_low[4][0]){
		return 4;
	}
	else{
		return 1;
	}
}
else if(level === 2){}
	if(color === hexToRgb("#"+color_chart_opt_high[0][4]) || color === color_chart_opt_high[0][4]){
		return 0;
	}
	else if(color === hexToRgb("#"+color_chart_opt_high[1][4]) || color === color_chart_opt_high[1][4]){
		return 1;
	}
	else if(color === hexToRgb("#"+color_chart_opt_high[2][4]) || color === color_chart_opt_high[2][4]){
		return 2;
	}
	else if(color === hexToRgb("#"+color_chart_opt_high[3][4]) || color === color_chart_opt_high[3][4]){
		return 3;
	}
	else if(color === hexToRgb("#"+color_chart_opt_high[4][4]) || color === color_chart_opt_high[4][4]){
		return 4;
	}
	else{
		return 2;
	}
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var result_string="rgb("+parseInt(result[1], 16)+", "+parseInt(result[2], 16)+", "+parseInt(result[3], 16)+")";
	return result_string;
}
