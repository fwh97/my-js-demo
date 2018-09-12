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