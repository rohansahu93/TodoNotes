"use strict"; 

//global objet to call methods on load as required
var toDos ={};

//IIFE
(function(){
    
        //global vaiables
        var notes = new Array;
        var notesStr = localStorage.getItem('note');
        var trashNotes = new Array;
        var trashNotesStr = localStorage.getItem('trash');
        if (notesStr !== null) {
            notes = JSON.parse(notesStr); }
        if (trashNotesStr !== null) {
            trashNotes = JSON.parse(trashNotesStr); }
    
       //for deleting todos after 7 days from trash
       if(localStorage.getItem('trash')){   
        for(var i=trashNotes.length-1 ; i>=0 ;i--){
            var one_day=1000*60*60*24;
            var time = new Date(trashNotes[i].id);
            var d = new Date();
            var diff = d.getTime() - time.getTime();
            var diff_days = Math.round(diff/one_day);
            if(diff_days >= 7){
              trashNotes.splice(i,1);
              saveTrashState();
            }
        else{
        break;
        } 
     }
  }

    //updated the trash length for reflecting in header
    toDos.updateTrashLength = function(){
        document.getElementById('trashLink').innerHTML = "Trash("+trashNotes.length+")"; 
    }

    //empty the trashed notes
    toDos.emptyTrash = function(){
        trashNotes.splice(0,trashNotes.length);
        saveTrashState();
        toDos.showTrashNotes();
        toDos.updateTrashLength();
        alert("trash is empty now...!!");
    }

    //object created for new note and trashnote
    function note(title ,task ,toDoType)
        {
            var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
          var nd = new Date(utc + (3600000*(+5.5)));
          this.id = new Date();
          this.title = title;
          this.note = task;
          this.type = toDoType;
          this.timestamp = nd.toLocaleString();
    
    // create new Date object for different city
    // using supplied offset
        }

    //saving the notes to localstorage after crud operations
    function saveNotesState()
    {
        localStorage.setItem('note', JSON.stringify(notes));
        return false;
    }

    //saving the trashNotes to localstorage after crud operations
    function saveTrashState(){
        localStorage.setItem('trash', JSON.stringify(trashNotes));
        return false;
    }
    
    //add a new note and stored into localstorage
    toDos.addNote = function() 
    {
        var task = document.getElementById('task').value;
        var title = document.getElementById('title').value;
        //check for empty fields
        if(task == '' || title == ''){
            alert("Please fill both the fields....!!");
            return false;
        }
        var toDoType = "note";
        var noteObject =new note(title ,task , toDoType) ;
        notes.unshift(noteObject);
        saveNotesState();
        toDos.showNotes();
        document.getElementById('task').value = "";
        document.getElementById('title').value = "";
        return false;
    }
    
    //add the image note in the localStorage
    toDos.addImageNote = function(){
        var bannerImage = document.getElementById('bannerImg').value;
        var title = document.getElementById('title').value;
        //check for empty fields
        if(bannerImage == '' || title == ''){
            alert("Please fill both the fields....!!");
            return false;
        }
        var img = document.getElementById('demoImg');
        var file = document.getElementById('bannerImg').files[0];            
        var toDoType = "image";
        var fReader = new FileReader();
        fReader.onload = function() {
            //console.log(fReader.result);
            document.getElementById('demoImg').src = fReader.result;
            var task  = getBase64Image(img);
            var noteObject =new note(title , task , toDoType)
            notes.unshift(noteObject);
            saveNotesState();
            toDos.showNotes();
        };
       fReader.readAsDataURL(file);
       document.getElementById('bannerImg').value = "";
       document.getElementById('title').value = "";
    }

    //update note according to the id generated
    toDos.updateNote = function(id){
        var d = new Date();
        var title = document.getElementById(id).getElementsByClassName("note-title")[0].value;
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000*(+5.5)));
        for(var i=0;i<notes.length;i++){
            if(notes[i].id == id){
                if(notes[i].type == "note"){
                    var note = document.getElementById(id).getElementsByClassName("note-content")[0].value;
                    notes[i].id= new Date();
                    notes[i].note=note;
                    notes[i].title=title;
                    notes[i].timestamp = nd.toLocaleString();
                    break;
                    }
                else if(notes[i].type == "image"){  
                    var x = notes[i];
                    var bannerImage = document.getElementById('file-input').value;
                    var img = document.getElementById(id).getElementsByClassName("noteImage")[0];
                    var file = document.getElementById('file-input').files[0]; 
                    var fReader = new FileReader();
                    fReader.onload = function() {
                        //console.log(fReader.result);
                                img.src = fReader.result;
                                var task  = getBase64Image(img);
                                x.id= new Date();
                                x.note=task;
                                x.title=title;
                                x.timestamp = nd.toLocaleString();
                                saveNotesState();
                                toDos.showNotes();
                     };
                    fReader.readAsDataURL(file); 
                }
            }
        }
 
        saveNotesState();
        toDos.showNotes();
        return false;
    }

//move the note to trash with respect to its timestamp id
    toDos.removeNote = function(id) {
        for(var i=0; i< notes.length; i++){
          if(notes[i].id == id){
            var trashNoteObject =new note(notes[i].title ,notes[i].note , notes[i].type ) ;
             trashNotes.unshift(trashNoteObject);
             localStorage.setItem('trash', JSON.stringify(trashNotes));
             notes.splice(i,1);
             break;
          }   
        }
        saveTrashState();
        saveNotesState();
        toDos.showNotes();
        toDos.updateTrashLength();
        alert("Note has been moved to trash..!!!");
        return false;
    }

    //restore the trashNotes back to normal notes
    toDos.restoreTrashNote = function(id){
        for(var i=0;i<trashNotes.length;i++){
            if(trashNotes[i].id == id){
            var noteObject =new note(trashNotes[i].title ,trashNotes[i].note , trashNotes[i].type) ;
             notes.unshift(noteObject);
             trashNotes.splice(i,1);
             break;
            }
        }
        saveTrashState();
        saveNotesState();
        toDos.showTrashNotes();
        toDos.updateTrashLength();
        alert("Note has been restored..!!!");
        return false;   
    }

    //delete the note from trash with respect to timestamp id
    toDos.deleteTrashNote = function(id) {
        console.log(id);
        var result = confirm("Delete Note forever?");
        if(result){
        for(var i=0; i< trashNotes.length; i++){
          if(trashNotes[i].id == id){
             console.log("t");
             trashNotes.splice(i,1);
             break;
          }   
        }
        saveTrashState();
        toDos.showTrashNotes();
        toDos.updateTrashLength();
        return false;
       }
    }

    //display all the notes  
    toDos.showNotes = function() {
        var html = '<ul>';
        for(var i=0; i<notes.length; i++) {
            html += "<li><div class='colour1'>" + 
                        "<form class='updateForm' id='"+notes[i].id+"' onsubmit='toDos.updateNote(this.id)'>" +
                "<input type='text' class='note-title' placeholder='Untitled' maxlength='10' value='"+notes[i].title + "' id='"+notes[i].id+"'/>";
                if(notes[i].type == "image"){
                var imgSrc = fetchImage(notes[i].note);
                html+="<input id='file-input' type='file' style='display:none;'/><label for='file-input'><img src="+imgSrc+" width='180' height='200' id='tableBanner' class='noteImage' id='"+notes[i].id+"'/></label>";
                }
            else if(notes[i].type == "note"){
               html+="<textarea class='note-content' placeholder='Your content here' id='"+notes[i].id+"' />"+notes[i].note+"</textarea>";
            }
            html+="<img src='../images/close.png' onclick='toDos.removeNote(this.parentNode.id)' class='delete'/>" +
                    "<h6 class='timestamp'>"+notes[i].timestamp+"</h6><input type='submit' class='updated' value='update'/>" +
                    "</form></div></li>";
                };
        html += '</ul>';
        document.getElementById('notes').innerHTML = html;
    }

    //display all the trash notes
    toDos.showTrashNotes = function(){
        var html = '<ul>';
        for(var i=0; i<trashNotes.length; i++) {
            html += "<li><div class='colour1'>" + 
                        "<form class='updateForm' id='"+trashNotes[i].id+"'>" +
                "<input type='text' class='note-title' placeholder='Untitled' maxlength='10' value='"+trashNotes[i].title + "' id='"+trashNotes[i].id+"'/>";
                if(trashNotes[i].type == "image"){
                  var imgSrc = fetchImage(trashNotes[i].note);
                  html+="<img src="+imgSrc+" id='tableBanner' class='noteImage' class='tableBanner'/>";
                }
            else if(trashNotes[i].type == "note"){
                  html+="<textarea class='note-content' placeholder='Your content here' id='"+trashNotes[i].id+"' />"+trashNotes[i].note+"</textarea>";
            }
            html+="<img src='../images/close.png' onclick='toDos.deleteTrashNote(this.id)' class='delete' id='" + trashNotes[i].id + "'/>" +
                       "<h6 class='timestamp'>"+trashNotes[i].timestamp+"</h6><input type='button' class='updated' value='restore' onclick='toDos.restoreTrashNote(this.id)' id='" + trashNotes[i].id + "'/>" +
                        "</form></div></li>";
                };
        html += '</ul>';
        document.getElementById('trashNotes').innerHTML = html;  
    }

    //convert thr image data into binary
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    //return the url of image for displaying
    function fetchImage (dataImage) {
        return "data:image/png;base64," + dataImage;
    }
    
    /*
    render the adding notes html content after clicked in dropdown list
    */
    $("#notesOpen").click(function(){
        $("#add").remove();
        $("#content").remove();
        $('#toDoMain').append('<div class="input-group input-group-lg inputBox" id="content"><textarea class="form-control note_area" id="task" placeholder="take a note.." aria-describedby="sizing-addon1" required onkeyup="autoGrow(this)"></textarea></div>');
        $('#toDoMain').append('<div id="add" class="addButton" ><input type="submit" class="button"  onclick="toDos.addNote()" value="Done"></div>');
        $("#imgFile").remove();
    });
    
    /*
    render the adding imageNote html content when clicked in dropdown list
    */ 
    $("#imgOpen").click(function(){
        $("#add").remove();
        $("#imgFile").remove();
        $('#toDoMain').append('<div class="input-group input-group-lg inputBox" id="imgFile"><input type="file" required id="bannerImg"/></div>');
        $('#toDoMain').append('<div id="add" class="addButton" ><input type="submit" class="button" onclick="toDos.addImageNote()" value="Done"></div>');
        $("#content").remove();
    });
    
})();

var elements = document.getElementsByTagName('body');
var id = elements[0].getAttribute('id');

if(id == "mainPage"){toDos.showNotes();}
if(id == "trashPage"){toDos.showTrashNotes();}
toDos.updateTrashLength;

//for dyanamically growing textarea
function autoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}