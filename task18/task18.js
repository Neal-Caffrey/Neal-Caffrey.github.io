

function addEventHander(ele,event,hanlder){
  if(ele.addEventListener){
    ele.addEventListener(event,hanlder,false);
  }
  else if(ele.attachEvent){
    ele.attachEvent("on" + event,hanlder);
  }
  else{
    ele["on"+event] = hanlder;
  }
}


var numInput = document.getElementById('num-input'),
	leftIn = document.getElementById('left-in'),
	rightIn = document.getElementById('right-in'),
	leftOut = document.getElementById('left-out'),
	rightOut = document.getElementById('right-out'),
	container = document.getElementById('container');

var Data = [];

function check(){
	if((/^[0-9]+$/).test(numInput.value)){
		return true;
	}
	else{
		alert("输入必须是数字！");
		return false;
	}
}



function Lin(){
	if(check()){
		Data.unshift(numInput.value);
		renderUI();
	}
	
}

function Lou(){
	if(Data.length!=0){
		alert("删除"+Data[0]);
		Data.shift(numInput.value);
		renderUI();
	}
	else{
		alert("队列为空！");
	}
}

function Rin(){
	if(check()){
		Data.push(numInput.value);
		renderUI();
	}

}

function Rou(){
	if(Data.length!=0){
		alert("删除"+Data[Data.length-1]);
		Data.pop(numInput.value);
		renderUI();
	}
	else{
		alert("队列为空！");
	}

}

function del(){
	var div = container.getElementsByTagName('div');
	var callback = function(o){

			return function(){
				Data.splice(o,1);
				renderUI();
			}	
	}
	for(var o = 0; o<div.length;o++){
		addEventHander(div[o],'click',callback(o));
	}
	
			
}

function renderUI(){
	var item = '';
	for(var i = 0;i<Data.length;i++){
		item += '<div>' + Data[i] + '</div>';
	}
	container.innerHTML = item;
	del();
}
function init(){
	addEventHander(leftIn,'click',Lin);
	addEventHander(leftOut,'click',Lou);
	addEventHander(rightIn,'click',Rin);
	addEventHander(rightOut,'click',Rou);
}
	
init();





