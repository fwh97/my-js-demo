
$().extend('size', function (){
	return this.elements.length;
});

$().extend('animate',function (json ,fn)
{
	var i=0; 
	for(i=0; i<this.elements.length; i++)
	{
		startMove(this.elements[i], json, fn);
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
		};
		
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
	return this;
})


$().extend('drag',function ()
{
	var i=0;
	for(i=0; i<this.elements.length; i++)
	{
		drag(this.elements[i]);
	}
	
	function drag(oDiv)
	{
		
		var lastX=0;
		var lastY=0;
		
		oDiv.onmousedown=function (ev)
		{
			var oEvent=ev||event;
			
			var disX=oEvent.clientX-oDiv.offsetLeft;
			var disY=oEvent.clientY-oDiv.offsetTop;
			
			document.onmousemove=function (ev)
			{
				var oEvent=ev||event;
				
				var x=oEvent.clientX-disX
				var y=oEvent.clientY-disY
							
				oDiv.style.left=x+'px';
				oDiv.style.top=y+'px';
				
				iSpeedX=x-lastX;
				iSpeedY=y-lastY;
				
				lastX=x;
				lastY=y;
			}
			
			document.onmouseup=function ()
			{
				document.onmouseup=null;
				document.onmousemove=null;
				
				startMove(oDiv);
			}
			
			clearInterval(oDiv.timer);
			return false;
		}
		
	}

var iSpeedX=0;
var iSpeedY=0;

	  function startMove(obj)
	  {
		  clearInterval(obj.timer);
		  
		  obj.timer=setInterval(function ()
		  {
			  iSpeedY+=3;
			  
			  var l=obj.offsetLeft+iSpeedX;
			  var t=obj.offsetTop+iSpeedY;
			  
			  if(l>=document.documentElement.clientWidth-obj.offsetWidth)
			  {
				  iSpeedX*=-0.8;
				  l=document.documentElement.clientWidth-obj.offsetWidth;
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
				  clearInterval(obj.timer);
			  }
			  else
			  {
				  obj.style.left=l+'px';
				  obj.style.top=t+'px';
			  }
			  
		  },30);
		  
	  }
	
});

















