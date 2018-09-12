// JavaScript Document

function getStyle(obj, attr)
{
	  if(obj.currentStyle)
	  {
		  return obj.currentStyle[attr];
	  }
	  else
	  {
		  return getComputedStyle(obj ,false)[attr];
	  }
}

function startMove(obj ,json ,fn)
{
	clearInterval(obj.timer);
	
	obj.timer=setInterval(function ()
	{
		var bStop=true;
		//var attr='';
		
		for(var attr in json)
		{
			var iAttr=0;
			if(attr=='opacity')
			{
				iAttr=parseInt(parseFloat(getStyle(obj,attr))*100);
			}
			else
			{
				iAttr=parseInt(getStyle(obj, attr));
			}
			
			var iSpeed=(json[attr]-iAttr)/8;
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			
			if(iAttr!=json[attr])
			{
				bStop=false;
			}
			
			if(attr=='opacity')
			{
				obj.style.opacity=(iAttr+iSpeed)/100;
				obj.style.filter='alpha(opacity:'+(iAttr+iSpeed)+')';
			}
			else
			{
				obj.style[attr]=iAttr+iSpeed+'px';
			}
		}
		
		if(bStop)
		{
			clearInterval(obj.timer);
			if(fn)
			{
				fn();
			}
		}
		
	},30);
}

function Drag(id){
	var _this=this;
	this.disX=0;
	this.disY=0;
	this.iSpeedX=0;
	this.iSpeedY=0;
	this.lastX=0;
	this.lastY=0;
	this.scrollTop=0;
	this.scrollLeft=0;
	this.oDiv=document.getElementById(id);
	this.oDiv.onmousedown=function(){
		_this.fnDown();
		return false;
	};
}
//窗口滚动执行
Drag.prototype.fnScroll=function () {
	this.iSpeedX=0;
	this.iSpeedY=1;
	//console.log(this);
	this.moveBump(this.oDiv,this.iSpeedX,this.iSpeedY);  //碰撞运动函数调用
};
//拖拽碰撞函数；
Drag.prototype.fnDown=function(ev){
	var _this=this;
	var oEvent=ev||event;

	this.disX=oEvent.clientX-this.oDiv.offsetLeft;
	this.disY=oEvent.clientY-this.oDiv.offsetTop;
	/* document.onmousemove=this.fnMove(ev);        //这种方式写 不能持续触发事件； */
	document.onmousemove=function(){
		_this.fnMove();
		return false;
	};
	document.onmouseup=function(){
		_this.fnUp();
	};
	clearInterval(this.oDiv.timer);  //鼠标按下关闭碰撞运动；
};

Drag.prototype.fnMove=function(ev){
	var oEvent=ev||event;
	var l=oEvent.clientX-this.disX;
	var t=oEvent.clientY-this.disY;

	this.oDiv.style.left=l+"px";
	this.oDiv.style.top=t+"px";
	this.iSpeedX=l-this.lastX; //拖动过程中 上次拖动位置距离拖动后下次的位置两者之间距离的值做速度；
	this.iSpeedY=t-this.lastY;
	this.lastX=l;
	this.lastY=t;
};

Drag.prototype.fnUp=function(){
	document.onmousemove=null;
	document.onmouseup=null;
	this.moveBump(this.oDiv,this.iSpeedX, this.iSpeedY);  //碰撞运动执行
};

Drag.prototype.moveBump=function(obj,iSpeedX, iSpeedY) {
	var _this=this;
	clearInterval(obj.timer);
	this.scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;  //滚动条滚动距离left
	this.scrollTop=document.documentElement.scrollTop||document.body.scrollTop;   //滚动条滚动距离top
	obj.timer=setInterval(function () {
		iSpeedY+=3;          //
		var l=obj.offsetLeft+iSpeedX-_this.scrollLeft;
		var t=obj.offsetTop+iSpeedY-_this.scrollTop;         //减去滚动距离获得在当前可视区位置
		if(l>=document.documentElement.clientWidth-obj.offsetWidth){  //碰撞到边缘反弹
			iSpeedX*=-0.8;
			l=document.documentElement.clientWidth-obj.offsetWidth;
		}
		else if(l<=0){  //碰撞到边缘反弹
			iSpeedX*=-0.8;//乘等于负0.8，负：速度反向（就反弹），乘：零点几要速度慢慢减小 达到缓冲效果
			l=0;   //不越出页面边缘
		}
		if(t>=document.documentElement.clientHeight-obj.offsetHeight){ //碰撞到边缘反弹
			iSpeedY*=-0.8;
			iSpeedX*=0.8;
			t=document.documentElement.clientHeight-obj.offsetHeight;
		}
		else if(t<=0){  //碰撞到边缘反弹
			iSpeedY*=-1;
			iSpeedX*=0.8;
			t=0;
		}

		if(Math.abs(iSpeedX)<1){  //让速度停下来，要不然卡在1与-1的值之间跳来跳去
			iSpeedX=0;
		}
		if(Math.abs(iSpeedY)<1){
			iSpeedY=0;
		}

		if(iSpeedX==0&&iSpeedY==0&&t==document.documentElement.clientHeight-obj.offsetHeight){
			clearInterval(obj.timer);
		}
		else{
			obj.style.left=l+_this.scrollLeft+"px";
			obj.style.top=t+_this.scrollTop+"px";
		}
	},30)
};
//右键菜单
function Textmenu(id){
	Drag.call(this,id);   //继承Drag
	var _this=this;
	this.aLi=this.oDiv.getElementsByTagName("li");

	document.oncontextmenu=function () {
		_this.fnTextmenu();
		return false;  //取消默认事件行为；
	}
}
for(var key in Drag.prototype){   //for in 继承原型方法；
	Textmenu.prototype[key]=Drag.prototype[key];
}
Textmenu.prototype.fnTextmenu=function(ev) {    //鼠标右键菜单事件
	var _this=this;
	var oEvent=ev||event;
	this.lastX=0;   //储存上一次 l(oEvent.clientX-disX;) 也就是上一次鼠标拖动的距离  lastY同理；
	this.lastY=0;
	this.scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
	this.scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
	this.oDiv.style.left=oEvent.clientX+this.scrollLeft+"px";//鼠标X轴位置加滚动页面距离
	this.oDiv.style.top=oEvent.clientY+this.scrollTop+"px";
	this.oDiv.style.display="block";

	this.oDiv.onmousedown=function () {
		_this.fnDown();
		return false;
	};

	clearInterval(this.oDiv.timer);   //右键关闭运动
};

//回到顶部
function TopMove(id) {
	var _this=this;
	this.oBtn=document.getElementById(id);
	this.timer=null;
	this.iSpeed=0;
	this.bIf=true;
	this.scrollTop=0;

	this.oBtn.onclick=function () {
		_this.timer=setInterval(function () { //不知为啥 要嵌套一个function要不然下面clearInterval抽疯不执行；
			_this.moveScrollTop();
		}, 30);
	}
}
TopMove.prototype.moveScrollTop=function() {
	//当前页面可视区到顶部距离
	this.scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
	if(this.scrollTop==0){
		clearInterval(this.timer);
	}
	this.bIf=true;
	this.iSpeed=Math.floor(-this.scrollTop/8);
	document.documentElement.scrollTop=document.body.scrollTop=this.iSpeed+this.scrollTop;
};







