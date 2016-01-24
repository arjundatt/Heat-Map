/* Copyright (C) 2013, arjun d. sharma
* This file is part of Heat-Map.js.
*/

var file_upload_FLAG = 0;
var LIST_FILES=new Array();
var applicationROOT="www";

/* This file is resposible for retrieving data from the files 
* uploaded to the server or data pasted in the textbox
*/

function AJAX_retrieve_file_meta_data(root_file){
	LIST_FILES=[];
	var txtFile;
	var tmp_metaData;
	if (window.XMLHttpRequest)
					{// code for IE7+, Firefox, Chrome, Opera, Safari
						txtFile = new XMLHttpRequest();
					}
					else
					{// code for IE6, IE5
						txtFile = new ActiveXObject("Microsoft.XMLHTTP");
					}
	txtFile.open("POST", root_file, false);
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState === 4) { 
			if (txtFile.status === 200) {
					tmp_metaData=txtFile.responseText;
				LIST_FILES = (txtFile.responseText).replace(/\r+/g,"").replace(/^\n+/,"").replace(/\n+$/,"").split(/\n/g);
			}
		}
	}
	txtFile.send(null);
	if(tmp_metaData.search(/\S/g) !== -1)
		get_fileName(LIST_FILES);
	else
		alert("Error: No files specified");
}

function get_fileName(list){
	if(list.length === 0)
		alert("No files in the database to parse");
	else if(list.length === 1){
		if(mode === 2){
			call_multi_mode();
		}
		else{
			document.getElementById('csv_data1').value=AJAX_retrieve_file_data(parse_fileName(list[0]));
			cleanUP();
		}
	}
	else if(list.length > 1){
		if(mode === 1){
			call_multi_mode();
		}
		else{
		//alert(list.length);
			for(i=0; i<list.length; i++){
				if(i>0){
					incr_textarea();
				}
				//alert("csv_data"+(i+1));
				document.getElementById("csv_data"+(i+1)).value=AJAX_retrieve_file_data(parse_fileName(list[i]));
			}
			multi_map_generate();
		}
	}
	
}

function AJAX_retrieve_file_data(file_name){
	var currFileData="";
	var txtFile;
	if (window.XMLHttpRequest)
					{// code for IE7+, Firefox, Chrome, Opera, Safari
						txtFile = new XMLHttpRequest();
					}
					else
					{// code for IE6, IE5
						txtFile = new ActiveXObject("Microsoft.XMLHTTP");
					}
	txtFile.open("POST", "http://203.100.70.227:8000/"+file_name, false);
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState === 4) { 
			if (txtFile.status === 200) {
				
				curr_fileData = (txtFile.responseText).replace(/\r+/g,"").replace(/^\s+/,"").replace(/\s+$/,"");
			}
		}
	}
	txtFile.send(null);
	return curr_fileData;
}

function parse_fileName(file_name){
	var flag=false;
	var cannonical_split = file_name.split(/\\|\//);
	var rel_file_path="";
	for(j=0;j<cannonical_split.length;j++){
		if(cannonical_split[j] === applicationROOT && !flag)
			flag = true;
		else if(flag){
			rel_file_path=rel_file_path + cannonical_split[j];
			if(j !== cannonical_split.length-1)
				rel_file_path=rel_file_path + "/";
		}
		else if(!flag){;}
	}
	return rel_file_path;
}
