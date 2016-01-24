/* Copyright (C) 2013, arjun d. sharma
* This file is part of Heat-Map.js.
*/

$('#close_arrow').click(function(){
$('#data_div').animate({
    width: "2%"
  }, 300 );
$(".data_textarea").hide();  
$("#close_arrow").hide();
$("#open_arrow").css("visibility","visible");  
$("#data_div").css("cursor","pointer");
$('.buttons_').hide();
});

$('#open_arrow').click(function(){
$('#data_div').animate({
    width: "97%"
  }, 300 );
$(".data_textarea").show();  
$("#open_arrow").css("visibility","hidden");  
$("#close_arrow").show();   
$("#data_div").css("cursor","normal");
$('.buttons_').show();
});

$('#add_textarea').click(function(){
incr_textarea();
});

$('#q1_1').toggle(function(){
$('#color_opt_low').css("visibility","visible");
},
function(){
$('#color_opt_low').css("visibility","hidden");
});

$('#q11_1').toggle(function(){
$('#color_opt_high').css("visibility","visible");
},
function(){
$('#color_opt_high').css("visibility","hidden");
});
$('#file_uploader_div').hide();