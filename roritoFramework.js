<!--Rorito Framework-->
$$$.model={
"onStartup":[], //accordian specific ds
"accordian":[], //accordian specific ds
"modals":[] //modal specific ds
};
function $$$(cid)
{
let element=document.getElementById(cid);
if(!element) throw "Invalid ID : "+cid;
return new RoritoElement(element);
}

//class RoritoElement
function RoritoElement(element)
{
this.element=element;
this.html=function(content){
if(typeof this.element.innerHTML=="string")
{
if((typeof content)=="string")
{
this.element.innerHTML=content;
}
return this.element.innerHTML;
}
return null;
}
this.value=function(content){
if(typeof this.element.value)
{
if((typeof content)=="string")
{
this.element.value=content;
}
return this.element.value;
}
return null;
}
}

//form validation starts here
$$$.isFormValid=function(arg){
var flag=true;
for(var key in arg)
{
if(arg.hasOwnProperty(key))
{
var tmp=arg[key];
var elem=document.getElementsByName(key)[0];
if(elem.type=="checkbox")
{
if(tmp.requiredState!=null && tmp.requiredState==true)
{
if(elem.checked==false && tmp.displayAlert==true)
{
alert(tmp.errors.requiredState);
flag=false;
}
}
continue;
}
var elemErrorSection=document.getElementById(tmp.errorPane);
elemErrorSection.innerHTML="";
if(tmp.required!=null && tmp.required==true)
{
if(elem.type!="radio" && elem.value.length==0) 
{
elemErrorSection.innerHTML=tmp.errors.required;
flag=false;
}
if(elem.type=="radio" && elem.checked==false)
{
elemErrorSection.innerHTML=tmp.errors.required;
flag=false;
}
}
if(tmp.maxLength!=null)
{
if(elem.value.length>tmp.maxLength) 
{
elemErrorSection.innerHTML=tmp.errors.maxLength;
flag=false;
}
}
if(tmp.invalid!=null)
{
if(elem.value==tmp.invalid) 
{
elemErrorSection.innerHTML=tmp.errors.invalid;
flag=false;
}
}
}
}
return flag;
}
//form validation part ends here

//ajax part starts here
$$$.ajax=function(jsonObject){
//validating different property in JSON object
if(!jsonObject["url"]) throw "url property is missing in call to ajax";
let url=jsonObject["url"];
if((typeof url)!="string") throw "url property should be of string type in call to ajax";

let methodType="GET";
if(jsonObject["methodType"]) 
{
if((typeof jsonObject["methodType"])!="string") throw "methodType property should be of string type in call to ajax";
methodType=jsonObject["methodType"].toUpperCase();
if(["GET","POST"].includes(methodType)==false) throw "methodType should be of GET/POST type in call to ajax";
}

let success=null;
if(jsonObject["success"])
{
if((typeof jsonObject["success"])!="function") throw "success property should be of function type in call to ajax";
success=jsonObject["success"];
}

let failure=null;
if(jsonObject["failure"])
{
if((typeof jsonObject["failure"])!="function") throw "failure property should be of function type in call to ajax";
failure=jsonObject["failure"];
}
var xmlHttpRequest=new XMLHttpRequest();
if(methodType=="GET")
{
xmlHttpRequest.onreadystatechange=function(){
if(this.readyState==4)
{
if(this.status==200)
{
success(this.responseText);
}
else
{
failure();
}
}
}
if(jsonObject["data"])
{
let queryString="";
let val=jsonObject["data"];
for(var prop in val)
{
if(queryString.length!=0) queryString+="&";
queryString=queryString+prop+"="+encodeURI(val[prop]);
}
url=url+"?"+queryString;
}
xmlHttpRequest.open(methodType,url,true);
xmlHttpRequest.send();
}
if(methodType=="POST")
{
xmlHttpRequest.onreadystatechange=function(){
if(this.readyState==4)
{
if(this.status==200)
{
success(this.responseText);
}
else
{
failure();
}
}
}
let sendJson=false;
if(jsonObject["sendJSON"]) sendJson=jsonObject["sendJSON"];
if((typeof sendJson)!="boolean") throw "sendJSON property should be of boolean type in ajax call";
let val={};
let queryString="";
if(jsonObject["data"])
{
val=jsonObject["data"];
if(sendJson==false)
{
for(var prop in val)
{
if(queryString.length!=0) queryString+="&";
queryString=queryString+prop+"="+encodeURI(val[prop]);
}
}
}
xmlHttpRequest.open(methodType,url,true);
if(sendJson==true) 
{
xmlHttpRequest.setRequestHeader("Content-Type","application/json");
xmlHttpRequest.send(JSON.stringify(val));
}
else 
{
xmlHttpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xmlHttpRequest.send(queryString);
}
}
}
//ajax part ends here

//modal part starts here
$$$.modals={};
$$$.modals.show=function(mid){
var modal=null;
for(var i=0;i<$$$.model.modals.length;i++)
{
if($$$.model.modals[i].getContentId()==mid)
{
modal=$$$.model.modals[i];
break;
}
}
if(modal==null) return;
modal.show();
};
//modal class
function Modal(cref)
{
var objectReference=this;
this.beforeOpen=null;
this.afterOpen=null;
this.beforeClose=null;
this.afterClose=null;

var contentReference=cref;
this.getContentId=function(){
return contentReference.id;
};

var modalMaskDivision=document.createElement("div");
modalMaskDivision.classList.add("modalMask");
modalMaskDivision.style.display='none';
var modalDivision=document.createElement("div");
modalDivision.classList.add("modal");
modalDivision.style.display='none';
document.body.appendChild(modalMaskDivision);
document.body.appendChild(modalDivision);


var headerDivision=document.createElement("div");
headerDivision.classList.add("header");
modalDivision.appendChild(headerDivision);

if(contentReference.hasAttribute("size"))
{
var size=contentReference.getAttribute("size");
let xpos=size.indexOf("x");
if(xpos==-1) xpos=size.indexOf("X");
if(xpos==-1) throw "In case of modal size should be specified as widhtxheight";
if(xpos==0 || xpos==size.length-1) throw "In case of modal size should be specified as widhtxheight";
let width=size.substring(0,xpos);
let height=size.substring(xpos+1); 
modalDivision.style.width=width+"px";
modalDivision.style.height=height+"px";
}
else
{
modalDivision.style.width="400px";
modalDivision.style.height="300px";
}

if(contentReference.hasAttribute("header"))
{
var headerText=contentReference.getAttribute("header");
headerDivision.innerHTML=headerText;
}

if(contentReference.hasAttribute("maskColor"))
{
var maskColor=contentReference.getAttribute("maskColor");
modalMaskDivision.style.backgroundColor=maskColor;
}

if(contentReference.hasAttribute("modalBackgroundColor"))
{
var modalBackgroundColor=contentReference.getAttribute("modalBackgroundColor");
modalDivision.style.backgroundColor=modalBackgroundColor;
}

if(contentReference.hasAttribute("beforeOpen"))
{
objectReference.beforeOpen=contentReference.getAttribute("beforeOpen");
}

if(contentReference.hasAttribute("afterOpen"))
{
objectReference.afterOpen=contentReference.getAttribute("afterOpen");
}

if(contentReference.hasAttribute("beforeClose"))
{
objectReference.beforeClose=contentReference.getAttribute("beforeClose");
}

if(contentReference.hasAttribute("afterClose"))
{
objectReference.afterClose=contentReference.getAttribute("afterClose");
}

var closeButton=null;
if(contentReference.hasAttribute("closeButton"))
{
closeButton=contentReference.getAttribute("closeButton");
}

var closeButtonSpan=null;
if(closeButton && closeButton.toUpperCase()=="TRUE")
{
closeButtonSpan=document.createElement("span");
closeButtonSpan.classList.add("closeButton");
var textNode=document.createTextNode("X");
closeButtonSpan.appendChild(textNode);
headerDivision.appendChild(closeButtonSpan);
}

var contentDivision=document.createElement('div');
contentDivision.classList.add("content");
contentDivision.style.height=(modalDivision.style.height.substring(0,modalDivision.style.height.length-2)-93)+"px";
contentReference.remove();
contentDivision.appendChild(contentReference);
//if user set the content display none,we ensure that it should be visible 
contentReference.style.display='block';
contentReference.style.visibility='visible';
modalDivision.appendChild(contentDivision);

var footerDivision=document.createElement("div");
footerDivision.classList.add("footer");
modalDivision.appendChild(footerDivision);
if(contentReference.hasAttribute("footer"))
{
var footerText=contentReference.getAttribute("footer");
footerDivision.innerHTML=footerText;
}

this.show=function(){
var onOpen=true;
if(objectReference.beforeOpen)
{
onOpen=eval(objectReference.beforeOpen);
}
if(onOpen)
{
modalMaskDivision.style.display='block';
modalDivision.style.display='block';
if(objectReference.afterOpen) setTimeout(function(){eval(objectReference.afterOpen);},100);
}
};

if(closeButtonSpan)
{
closeButtonSpan.addEventListener('click',function(){
var onClose=true;
if(objectReference.beforeClose)
{
onClose=eval(objectReference.beforeClose);
}
if(onClose)
{
modalMaskDivision.style.display='none';
modalDivision.style.display='none';
if(objectReference.afterClose) setTimeout(function(){eval(objectReference.afterClose);},80);
}
});
}
}
//modal part ends here

//accordian part starts here
$$$.clickAction=function(panelIndex,accordianIndex)
{
if($$$.model.accordian[accordianIndex].expandedIndex==-1)
{
$$$.model.accordian[accordianIndex].panels[panelIndex+1].style.display=$$$.model.accordian[accordianIndex].panels[panelIndex+1].oldDisplay;
$$$.model.accordian[accordianIndex].expandedIndex=panelIndex+1;
return;
}
//if it clicks on the same opened accordian
if(panelIndex+1==$$$.model.accordian[accordianIndex].expandedIndex)
{
$$$.model.accordian[accordianIndex].panels[$$$.model.accordian[accordianIndex].expandedIndex].style.display='none';
$$$.model.accordian[accordianIndex].expandedIndex=-1;
return;
}
$$$.model.accordian[accordianIndex].panels[$$$.model.accordian[accordianIndex].expandedIndex].style.display='none';
$$$.model.accordian[accordianIndex].panels[panelIndex+1].style.display=$$$.model.accordian[accordianIndex].panels[panelIndex+1].oldDisplay;
$$$.model.accordian[accordianIndex].expandedIndex=panelIndex+1;
return;
}

$$$.toAccordian=function(id)
{
var panels=[];
let accordIndex=0;
let accord=document.getElementById(id);
let childElem=accord.childNodes;
for(var i=0;i<childElem.length;i++)
{
if(childElem[i].nodeName=="H3")
{
panels[panels.length]=childElem[i];
}
if(childElem[i].nodeName=="DIV")
{
panels[panels.length]=childElem[i];
}
}
if((panels.length)%2!=0) throw "not a even length";
for(var i=0;i<panels.length;i++)
{
if(panels[i].nodeName!="H3") throw "h3 not forming a pair";
if(panels[++i].nodeName!="DIV") throw "div not forming a pair";
}
function tmpAction(i,accordIndex)
{
return function(){
return $$$.clickAction(i,accordIndex);
}
}
for(var i=0;i<panels.length;i+=2)
{
panels[i].onclick=tmpAction(i,$$$.model.accordian.length);
panels[i+1].oldDisplay=panels[i+1].style.display;
panels[i+1].style.display='none';
}
$$$.model.accordian[$$$.model.accordian.length]={
"panels":panels,
"expandedIndex":-1
};
}

$$$.onDocumentLoaded=function(func)
{
if(typeof (func)!="function") throw "Expected function but found :"+typeof (func);
$$$.model.onStartup[$$$.model.onStartup.length]=func;
}
//start of initFramework
$$$.initFramework=function(){
//setting of accordian pane starts here
for(let x=0;x<$$$.model.onStartup.length;x++)
{
$$$.model.onStartup[x]();
}
//setting of accordian pane ends here
//setting of modal starts here 
var element=document.querySelectorAll('[forModal=true]');
for(var i=0;i<element.length;i++)
{
var modal=new Modal(element[i]);
$$$.model.modals.push(modal);
}
//setting of modal ends here
}
//end of initFramework
//accordian part ends here
window.addEventListener('load',$$$.initFramework);
