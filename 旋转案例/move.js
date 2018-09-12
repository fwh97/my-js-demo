// JavaScript Document
function id(id) {
	return document.getElementById(id);
}
function getStyle(obj, attr)  //获取样式属性值兼容函数
{
	  if(obj.currentStyle)
	  {
		  return obj.currentStyle[attr];  //ie
	  }
	  else
	  {
		  return getComputedStyle(obj ,null)[attr]; //ff
	  }
}

function css(obj, attr, value)
{
	if(arguments.length==2){
		if(attr=="opacity"){  //透明度*100取整；
			return Math.round(getStyle(obj , attr)*100); //round 四舍五入 取整
		}
		else{
			return parseInt(getStyle(obj, attr))||0;
		}
	}
	else if(arguments.length==3) {
		switch (attr) {
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				value = Math.max(value, 0);
			case 'left':
			case 'top':
			case 'margin':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[ attr ] = value + 'px';
				break;
			case 'opacity':  
				obj.style.filter = "alpha(opacity:" +value+ ")";
				obj.style.opacity = value/100;
				break;
			default:
				obj.style[ attr ] = value;
		}
	}
	//return function (attr_in, value_in){css(obj, attr_in, value_in)};
}

//缓冲运动   //obj:对象，json以{}可以传一组的要进行的样式属性，fn:再调用一次，可以完成链式运动效果；
function bufferMove(obj ,json , fn) {
	var bStop=true;  //判断是否都到达
	var iSpeed=0;  //速度
	var iAttr=0;   //存放对象属性值；
	var attr='';
	for( attr in json){   //for in  遍历 传进来的json{}，attr就是每个样式属性；

		iAttr=css(obj, attr); //iAttr 属性值会不停获取最新的值
		json[attr]=Math.round(json[attr]);  //以防传进来的是有小数的；取整

		if(iAttr!=json[attr]) {  //任意其中一个值不到目标 就执行
			bStop = false;      //=false  就执行不了关闭
			iSpeed=(json[attr]-iAttr)/8;  //目标减去对象属性值；除 达到缓冲效果
			//ceil()向上取整， floor()向下取整；
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);  //变为1px 蹭过去

			css(obj, attr, iAttr+iSpeed); //设置样式值；
		}
	}  //for in end
	if(bStop){  //true 就关闭定时器
		clearInterval(obj.timer);
		if(fn)  fn.call(obj);  //判断有没有传fn这个参数；call(obj)改变这个函数this指向；
	}
}

//匀速运动
function moveMean(obj ,json , fn) {
	var bStop=true;  //判断是否都到达
	var iSpeed=0;  //速度
	var iAttr=0;   //存放对象属性值；
	var attr='';
	for( attr in json){   //for in  遍历 传进来的json{}，attr就是每个样式属性；
		iAttr=css(obj, attr); //iAttr 属性值会不停获取最新的值
		json[attr]=Math.round(json[attr]);  //以防传进来的是有小数的；取整

		if(iAttr!=json[attr]) {  //任意其中一个值不到目标 就执行
			bStop = false;      //=false  就执行不了关闭
			iSpeed=iAttr<json[attr] ? iSpeed=10 : iSpeed=-10;
			if(Math.abs(iAttr-json[attr])<10){
				css(obj, attr, json[attr]);
			}
			else{
				css(obj, attr, iAttr+iSpeed); //设置样式值；
			}
		}
	}  //for in end
	if(bStop){  //true 就关闭定时器
		clearInterval(obj.timer);
		if(fn)  fn.call(obj);  //判断有没有传fn这个参数；call(obj)改变这个函数this指向；
	}
}

function animation(obj,oTarget,iType, fn) {   //运动函数，iType:选择运动模式
	var fnMove=null;
	if(obj.timer) {
		clearInterval(obj.timer);
	}

	switch(iType) {  //默认:缓冲运动  1：均速运动  2；弹性运动；
		case 1:
			fnMove=moveMean;
			break;
		case 2:
			fnMove=elasticMove;
			break;
		default:
			fnMove=bufferMove;
	}

	obj.timer=setInterval(function (){  //定时器执行运动
		fnMove(obj, oTarget, fn);
	}, 30);
}

//弹性运动
function elasticMove(obj, json, fn) {   //我日了webstorm  有时候抽疯 ，页面得重新打开，才有效果
	var attr="";
	var iAttr=0;
	var bStop=true;  //判断是否都到达
	for( attr in json){
		json[attr]=Math.round(json[attr]);  //以防传进来的是有小数的；取整
		if(!obj.oSpeed)obj.oSpeed={};  //添加一个属性来存放速度值累加
		if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;  //每个属性都存放自己的速度值
		
		iAttr=css(obj,attr);  //获取属性值

		//abs()：绝对值 速度大于1时（速度有负数的时候所以要绝对值）并且对象到达目标大于1之差

		/*if ( Math.abs(obj.oSpeed[attr]) < 1 || Math.abs(obj.oSpeed[attr]-json[attr])<1 ) {
			bStop=false;
			obj.oSpeed[attr]+=(json[attr] - iAttr)/5; //目标减对象(要走的距离) +=速度累加 让速度值由小到大 除：弹性
			obj.oSpeed[attr] *= 0.7;      //!*= 模仿摩擦力 让速度值减小下去 ，最后停下来；
			css(obj, attr, iAttr+obj.oSpeed[attr]);   //最后偏差一两px 给它整回目标点；
			if(Math.abs(obj.oSpeed[attr])<1){
				css(obj,attr, json[attr]);
				bStop=true;
			}

		}*/
		if(attr=="zIndex"){
			css(obj ,attr, json[attr]);
		}

		if(iAttr!=json[attr] ||Math.abs(obj.oSpeed[attr]) > 1 || Math.abs(json[attr]-iAttr)>1) {  //任意其中一个值不到目标 就执行
			bStop=false;
			obj.oSpeed[attr]+=(json[attr] - iAttr)/5; //目标减对象(要走的距离) +=速度累加 让速度值由小到大 除：弹性
			obj.oSpeed[attr] *= 0.7;      //!*= 模仿摩擦力 让速度值减小下去 ，最后停下来；
			if ( Math.abs(obj.oSpeed[attr]) > 1 || Math.abs(json[attr]-iAttr)>1 ){
				css(obj, attr, iAttr+obj.oSpeed[attr]);
				if(Math.abs(obj.oSpeed[attr]) < 1&& Math.abs(iAttr-json[attr])<1 ){
					css(obj,attr, json[attr]);
				}
			}
			else if(Math.abs(obj.oSpeed[attr]) < 1&& Math.abs(obj.oSpeed[attr]-json[attr])<1 ){
				css(obj ,attr, json[attr]);
				console.log(obj.oSpeed[attr]);
			}
			else{
				css(obj, attr, json[attr]); //设置样式值；
			}
		}
		else{
			css(obj, attr, json[attr]);
		}
	}//for in end
		if(bStop){  //true 就关闭定时器
			clearInterval(obj.timer); console.log(obj.timer);
			if(fn)  fn.call(obj);  //判断有没有传fn这个参数 call改变指向
		}
}

//拖拽构造函数
function Drag(id){
	var _this=this;  //解决在事件里的this是当前触发对象；
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
	this.moveBump(this.oDiv,this.iSpeedX,this.iSpeedY);  //碰撞运动函数调用
};
//拖拽函数；
Drag.prototype.fnDown=function(ev){
	var _this=this;
	var oEvent=ev||event;

	this.disX=oEvent.clientX-this.oDiv.offsetLeft;  //获得鼠标在这个菜单里的位置；
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
	var oEvent=ev||event;            //不可以去掉
	var l=oEvent.clientX-this.disX;   //当前鼠标位置减去鼠标位置在这个菜单里的位置
	var t=oEvent.clientY-this.disY;

	this.oDiv.style.left=l+"px";
	this.oDiv.style.top=t+"px";
	this.iSpeedX=l-this.lastX; //拖动过程中 上次拖动位置距离拖动后下次的位置两者之间距离的值做速度；
	this.iSpeedY=t-this.lastY;
	this.lastX=l;
	this.lastY=t;
};

Drag.prototype.fnUp=function(){   //鼠标抬起 =null;释放空间；
	document.onmousemove=null;
	document.onmouseup=null;
	this.moveBump(this.oDiv,this.iSpeedX, this.iSpeedY);  //碰撞运动执行
};

Drag.prototype.moveBump=function(obj,iSpeedX, iSpeedY) {  //碰撞运动函数
	var _this=this;
	clearInterval(obj.timer);
	                               //当前可视区距离顶部和最左的距离 也看成滚动条滚动了的距离
	this.scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;  //滚动条滚动距离left
	this.scrollTop=document.documentElement.scrollTop||document.body.scrollTop;   //滚动条滚动距离top
	obj.timer=setInterval(function () {
		iSpeedY+=3;          //模仿重力 让其下坠 
		var l=obj.offsetLeft+iSpeedX-_this.scrollLeft;
		var t=obj.offsetTop+iSpeedY-_this.scrollTop;         //减去滚动条滚动距离获得在当前可视区位置
		if(l>=document.documentElement.clientWidth-obj.offsetWidth){  //碰撞到边缘反弹
			iSpeedX*=-0.8;
			l=document.documentElement.clientWidth-obj.offsetWidth;
		}
		else if(l<=0){  //碰撞到边缘反弹
			iSpeedX*=-0.8;//乘等于负0.8，负：速度反向（就反弹），乘：零点几要速度慢慢减小 达到摩擦缓冲效果
			l=0;   //不越出页面边缘
		}
		if(t>=document.documentElement.clientHeight-obj.offsetHeight){ //碰撞到边缘反弹
			iSpeedY*=-0.8;   //
			iSpeedX*=0.8;   // 左右方向模仿摩擦最后停下来
			t=document.documentElement.clientHeight-obj.offsetHeight;
		}
		else if(t<=0){  //碰撞到边缘反弹
			iSpeedY*=-1;
			iSpeedX*=0.8;
			t=0;
		}

		if(Math.abs(iSpeedX)<1){  //让速度停下来，要不然卡在0.几与-0.几的值之间
			iSpeedX=0;
		}
		if(Math.abs(iSpeedY)<1){
			iSpeedY=0;
		}

		if(iSpeedX==0&&iSpeedY==0&&t==document.documentElement.clientHeight-obj.offsetHeight){
			clearInterval(obj.timer);   //速度0和位置停在底部就关闭定时器
		}
		else{
			obj.style.left=l+_this.scrollLeft+"px"; //加滚动条距离，页面滚动后位置也能到当前可视区
			obj.style.top=t+_this.scrollTop+"px";
		}
	},30)
};
//右键菜单
function Textmenu(id){
	Drag.call(this,id);   //继承Drag
	var _this=this;
	this.aLi=this.oDiv.getElementsByTagName("li");
	this.oSpan=this.oDiv.getElementsByTagName("span")[0];

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

	for(i=0; i<this.aLi.length;i++)   // 菜单移入移除背景颜色
	{
		this.aLi[i].onmouseover=function ()
		{
			this.style.backgroundColor='greenyellow';
		};

		this.aLi[i].onmouseout=function ()
		{
			this.style.backgroundColor='#fff';
		};
	}                        //移入移除背景颜色 end;

	this.oDiv.onmousedown=function () {
		_this.fnDown();
		return false;
	};
	this.oSpan.onclick=function () {    //×隐藏菜单
		_this.oDiv.style.display="none";
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







