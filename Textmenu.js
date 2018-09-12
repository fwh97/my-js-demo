//自定义右键菜单构造函数
function Textmenu(id) {
	var _this=this;
	this.disX=0;
	this.disY=0;
	this.iSpeedX=0;
	this.iSpeedY=0;
	this.lastX=0;
	this.lastY=0;
	this.oUl=document.getElementById(id);
	this.aLi=this.oUl.getElementsByTagName("li");

	document.oncontextmenu=function () {
		_this.fnTextmenu();
		return false;  //取消默认事件行为；
	}
}

Textmenu.prototype.fnTextmenu=function(ev) {    //鼠标右键菜单事件
	var _this=this;
	var oEvent=ev||event;
	this.lastX=0;   //储存上一次 l(oEvent.clientX-disX;) 也就是上一次鼠标拖动的距离  lastY同理；
	this.lastY=0;
	this.oUl.style.left=oEvent.clientX+"px";     //oUl位置是鼠标当前x(left)位置
	this.oUl.style.top=oEvent.clientY+"px";
	this.oUl.style.display="block";

	for(i=0; i<this.aLi.length;i++)   //oUl>li 移入移除背景颜色
	{
		this.aLi[i].onmouseover=function ()
		{
			this.style.backgroundColor='#ccc';
		}

		this.aLi[i].onmouseout=function ()
		{
			this.style.backgroundColor='#fff';
		}
	};                        //移入移除背景颜色 end;

	this.oUl.onmousedown=function () {
		_this.fnDown();
		return false;
	}
	clearInterval(this.oUl.timer);
};

Textmenu.prototype.fnDown=function(ev) {        //拖拽菜单（oUl） ;
	var _this=this;
	var oEvent=ev||event;                     
	this.disX=oEvent.clientX-this.oUl.offsetLeft;    //获得鼠标位置在这个菜单里的位置；
	this.disY=oEvent.clientY-this.oUl.offsetTop;

	document.onmousemove=function () {
		_this.fnMove();
		return false;
	}
	document.onmouseup=function () {
		_this.fnUp();
	}
	clearInterval(this.oUl.timer);    //关闭碰撞运动定时器
};

Textmenu.prototype.fnMove=function(ev) {
	var oEvent=ev||event;                   
	var l=oEvent.clientX-this.disX;         //当前鼠标位置减去鼠标位置在这个菜单里的位置
	var t=oEvent.clientY-this.disY;

	this.oUl.style.left=l+"px";     //菜单的位置
	this.oUl.style.top=t+"px";

	this.iSpeedX=l-this.lastX;      //此刻菜单位置减去上次位置来做速度
	this.iSpeedY=t-this.lastY;
	this.lastX=l;          //储存上次位置 ；
	this.lastY=t;
};

Textmenu.prototype.fnUp=function() {     //鼠标抬起 =null;释放空间；
	document.onmousemove=null;
	document.onmouseup=null;
	this.startMove(this.oUl, this.iSpeedX, this.iSpeedY);            //碰撞运动函数；
};

Textmenu.prototype.startMove=function(obj, iSpeedX, iSpeedY)       //模仿皮球碰撞运动函数；
{
	clearInterval(obj.timer);       //一开始就关闭一次 解决定时器会累加bug；

	obj.timer=setInterval(function ()     //开启定时器运动
	{
		iSpeedY+=3;      //速度Y+=3  让它下坠（地心引力）

		var l=obj.offsetLeft+iSpeedX;    //皮球left+速度x
		var t=obj.offsetTop+iSpeedY;

		if(l>=document.documentElement.clientWidth-obj.offsetWidth)//碰到页面可视区边缘
		{
			iSpeedX*=-0.8;    //负0.8 速度就反向   0.8让速度越来越小
			l=document.documentElement.clientWidth-obj.offsetWidth;//等于这个位置
		}
		else if(l<=0)
		{
			iSpeedX*=-0.8;
			l=0;

		}
		if(t>=document.documentElement.clientHeight-obj.offsetHeight)
		{
			iSpeedY*=-0.8;
			iSpeedX*=0.8;
			t=document.documentElement.clientHeight-obj.offsetHeight;
		}
		else if(t<=0)
		{
			iSpeedY*=-1;
			iSpeedX*=0.8;
			t=0;
		}

		if(Math.abs(iSpeedX)<1)      
		{
			iSpeedX=0;
		}

		if(Math.abs(iSpeedY)<1)
		{
			iSpeedY=0;
		}

		if(iSpeedX==0 && iSpeedY==0 && t==document.documentElement.clientHeight-obj.offsetHeight)
		{
			clearInterval(obj.timer);         //速度0和位置停在底部就关闭定时器
		}
		else
		{
			obj.style.left=l+'px';
			obj.style.top=t+'px';
		}

	},30);
};