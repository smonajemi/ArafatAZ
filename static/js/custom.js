var x = 1;
document.getElementById("remove").style.visibility="hidden";
function addText(){
    // document.getElementById("remove").style.background="red";
    document.getElementById("remove").style.visibility="visible";
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount)+1;
    }
    document.getElementById("addText").innerHTML += "<li><input type='text' id='textbox'"+ x++ +"'></li>";
   
}

function removeText(){
    var elmnt = document.getElementById("addText");
    elmnt.removeChild(elmnt.lastElementChild);
    if(elmnt.firstChild == null){
        document.getElementById("remove").style.visibility="hidden";
    }
}
