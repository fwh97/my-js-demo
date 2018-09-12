
function myAddEvent(obj, sEvent, fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+sEvent, function (){
			if(false==fn.call(obj))
			{
				return false;
				event.cancelBubble=true;
			}
		});
	}
	else
	{
		obj.addEventListener(sEvent, function (ev){
			if( false==fn.call(obj) )
			{
				ev.preventDefault();
				ev.cancelBubble=true;
				
			}		}  ,false);
	}
}

function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var re=new RegExp('\\b'+sClass+'\\b', 'i');
	var i=0;
	
	for(i=0;i<aEle.length;i++)
	{
		if(re.test(aEle[i].className))
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

function getStyle(obj, attr){
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr]
    }
    else{
        return obj.getComputedStyle(obj, false)[attr];
    }
}

function VQuery(vArg){
    this.element=[];
    switch(typeof(vArg))
    {
        case 'function' :
            myAddEvent(window, 'load', vArg);
            break;
        case 'string':
            switch(vArg.charAt(0))
            {
                case '#':
                    var obj=document.getElementById(vArg.substring(1));
                    this.element.push(obj);
                    break;
                case '.':
                    this.element=getByClass(document, vArg.substring(1));
                    break;
                default :
                    this.element=document.getElementsByTagName(vArg);
            }
            break;
        case 'object':
            this.element.push(vArg);
            break;
    }
}

VQuery.prototype.click=function(){
    for(var i=0; i<this.element.length; i++){
         myAddEvent(this.element[i], click, fn);
    }
    return this;
}

VQuery.prototype.show=function(){
    for(var i=0; i<this.element.length; i++){
         this.element[i].style.display='block';
    }
    return this;
}

VQuery.prototype.hide=function(){
    for(var i=0; i<this.element.length; i++){
         this.element[i].style.display='none';
    }
    return this;
}

VQuery.prototype.hover=function(fnOver, fnOut){
    for(var i=0; i<this.element.length; i++){
        myAddEvent(this.element[i], 'mouseover', fnOver);
        myAddEvent(this.element[i], 'mouseout', fnOut);
    }
    return this;
}

VQuery.prototype.css=function(attr, value){
    if(arguments.length==2)
    {
        for(var i=0; i<this.element.length; i++)
        {
            this.element[i].style[attr]=value;
        }
    }
    else{
        if(typeof attr=='string'){
            return getStyle(this.element[0], attr);
        }
        else{
            for(var i=0; i<this.element.length; i++)
            {
                var j='';
                for(j in attr){
                    if(j=='opacity'){
                        this.element[i].style.opacity=attr[j]/100;
                        this.element[i].style.filter='alpha(opacity:'+(attr[j])+')';
                    }                   
                    else{
                        this.element[i].style[j]=attr[j];
                    }
                }
            }
        }
    }       
    return this;
}

VQuery.prototype.attr=function(attr, value)
{
    if(arguments==2)
    {
        for(var i=0; i<this.element.length; i++){
            this.element[i][attr]=value;
        }
    }
    else{
        return this.element[0][attr];
    }
    return this;
}

VQuery.prototype.toggle=function(){
    var _arguments=arguments;
    
    for(var i=0; i<this.element.length; i++){
        addToggle(this.element[i]);
    }
    function addToggle(obj){
        var icount=0;
        myAddEvent(obj, 'click', function(){
            _arguments[icount++%_arguments.length].call(obj);
        });
    }
    return this;
}

VQuery.prototype.eq=function(n){
    return $(this.element[n]);
}

function getIndex(obj){
    var oNode=obj.parentNode.children;
    for(var i=0; i<oNode.length; i++){
        if(oNode[i]==obj){
            return i;
        }
    }
}

VQuery.prototype.index=function(){
    return getIndex(this.element[0]);
}

function appendArr(arr1, arr2)
{
	var i=0;
	for(i=0;  i<arr2.length; i++)
	{
		arr1.push(arr2[i]);
	}
}

VQuery.prototype.find=function (str)
{
	var aRuselt=[];
	var i=0;
	
	for(i=0; i<this.element.length; i++)
	{
		switch(str.charAt(0))
		{
			case '.':
			      var aEle=getByClass(this.element[i], str.substring(1));
				  aRuselt=aRuselt.concat(aEle);
				  break;
			
			default:
			      var aEle=this.element[i].getElementsByTagName(str);
				  //aRuselt=aRuselt.concat(aEle);
				  appendArr(aRuselt, aEle);
		}
	}
	
	var newVquery=$();
	newVquery.element=aRuselt;
	return newVquery;
}

VQuery.prototype.bind=function(sEv, fn){
    for(var i=0; i<this.element.length; i++){
        myAddEvent(this.element[i], sEv, fn);
    }
    return this;
}

VQuery.prototype.extend=function(name, fn){
    return VQuery.prototype[name]=fn;
}

function $(vArg){
    return new VQuery(vArg);
}















