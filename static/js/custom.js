// ANIMATE

var width = $(window).width();
function goRight() {
  $("#animate").animate({
  left: width
}, 100000, function() {
  setTimeout(goLeft, 0);
});
}
function goLeft() {
  $("#animate").animate({
  left: 0
}, 100, function() {
   setTimeout(goRight, 0);
});
}

setTimeout(goRight, 0);

$("#animate").on('click',function(){$('#animate').stop();
                goLeft();
})  

window.history.forward();
function noBack() { 
   setTimeout(0)
   window.history.forward();
 }
 
  document.onkeydown = function(e) {
    if(e.keyCode == 123) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
       return false;
    }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
       return false;
    }
  }
  document.onkeypress = function(e) {
   if(e.keyCode == 123) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
      return false;
   }
 }
 document.onmousedown = function(e) {
   if(e.keyCode == 123) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
      return false;
   }
   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
      return false;
   }
 }  
  
var div = document.createElement('div');
Object.defineProperty(div,'id',{get:function(){
      window.location.replace("https://www.google.com");
}});
setTimeout(()=>console.log(div),1000)