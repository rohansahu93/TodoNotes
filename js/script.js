(function(){
       if(localStorage.getItem('trash'))
         {
    //for updating trash length while body load
        var trashNotes = JSON.parse(localStorage.getItem('trash'));
       document.getElementById('trashLink').innerHTML = "Trash("+trashNotes.length+")";
             
    //for deleting elements after 7 days from trash
        for(i=trashNotes.length-1 ; i>=0 ;i--){
        var one_day=1000*60*60*24;
        var time = new Date(trashNotes[i].timestamp);
        var d = new Date();
        var diff = d.getTime() - time.getTime();
        var diff_days = Math.round(diff/one_day);
        if(diff_days >= 7){
         trashNotes.splice(i,1);
         localStorage.setItem('trash', JSON.stringify(trashNotes));
        }
    else{
        break;
      } 
    }
  }
})();

//get all the notes stored in localstorage
function getNotes() {
    var notes = new Array;
    var notesStr = localStorage.getItem('note');
    if (notesStr !== null) {
        notes = JSON.parse(notesStr); 
    }
    return notes;
}

//get all the notes stored in localstorage
function getTrashNotes() {
    var trashNotes = new Array;
    var trashNotesStr = localStorage.getItem('trash');
    if (trashNotesStr !== null) {
        trashNotes = JSON.parse(trashNotesStr); 
    }
    return trashNotes;
}

//updated the trash length for reflecting in header
function updateTrashLength(trashNotes){
    document.getElementById('trashLink').innerHTML = "Trash("+trashNotes.length+")"; 
}

//empty the trashed notes
function emptyTrash(){
    var trashNotes = getTrashNotes();
    trashNotes.splice(0,trashNotes.length);
    saveTrashState(trashNotes);
    showTrashNotes();
    updateTrashLength(trashNotes);
    alert("trash is empty now...!!");
}

//object created for new note and trashnote
function note(title ,task , length)
    {
      this.id = new Date();
      this.title = title;
      this.note = task;
      this.timestamp = new Date();
    }

//saving the notes to localstorage after crud operations
function saveNotesState(notesArray)
{
    localStorage.setItem('note', JSON.stringify(notesArray));
    return false;
}

//saving the trashNotes to localstorage after crud operations
function saveTrashState(trashNotes){
    localStorage.setItem('trash', JSON.stringify(trashNotes));
    return false;
}

//add a new note and stored into localstorage
function addNote() 
{
    var task = document.getElementById('task').value;
    var title = document.getElementById('title').value;
    var notes = getNotes();
    var noteObject =new note(title ,task , notes.length) ;
    notes.push(noteObject);
    saveNotesState(notes);
    showNotes();
    document.getElementById('task').value = "";
    document.getElementById('title').value = "";
    return false;
}

//update note according to the id generated
function updateNote(id) 
{
    var title= $("#"+id).find(".note-title#" + id).val();
    var note = $("#"+id).find(".note-content#" + id).val();
    var notes = getNotes();
    for(var i=0;i<notes.length;i++){
        if(notes[i].id == id){
            notes[i].note=note;
            notes[i].title=title;
            notes[i].timestamp= new Date();
            break;
        }
    }
    
    saveNotesState(notes);
    showNotes();
    return false;
}
 
//move the note to trash with respect to id
function removeNote(id) {
    var notes = getNotes();
    var trashNotes = getTrashNotes();
    for(var i=0; i< notes.length; i++){
      if(notes[i].id == id){
        var trashNoteObject =new note(notes[i].title ,notes[i].note , trashNotes.length) ;
         trashNotes.push(trashNoteObject);
         localStorage.setItem('trash', JSON.stringify(trashNotes));
         notes.splice(i,1);
         break;
      }   
    }
    saveTrashState(trashNotes);
    saveNotesState(notes);
    showNotes();
    updateTrashLength(trashNotes);
    alert("Note has been moved to trash..!!!");
    return false;
}

//restore the trashNotes back to normal notes
function restoreTrashNote(id){
    var trashNotes = getTrashNotes();
    var notes = getNotes();
    for(var i=0;i<trashNotes.length;i++){
        if(trashNotes[i].id == id){
        var noteObject =new note(trashNotes[i].title ,trashNotes[i].note , notes.length) ;
         notes.push(noteObject);
         trashNotes.splice(i,1);
         break;
        }
    }
    saveTrashState(trashNotes);
    localStorage.setItem('note', JSON.stringify(notes));
    showTrashNotes();
    updateTrashLength(trashNotes);
    alert("Note has been restored..!!!");
    return false;   
}

//delete the note from trash with respect to id
function deleteTrashNote(id) {
    var result = confirm("Delete Note forever?");
    if(result)
        {
    var temp = 0;
    var trashNotes = getTrashNotes();
    for(var i=0; i< trashNotes.length; i++){
      if(trashNotes[i].id == id){
         trashNotes.splice(i,1);
         break;
      }   
    }
    saveTrashState(trashNotes);
    showTrashNotes();
    updateTrashLength(trashNotes);
    return false;
        }
}

//display all the notes  
function showNotes() {
    var notes = getNotes();
    var html = '<ul>';
    for(var i=0; i<notes.length; i++) {
        html += "<li><div class='colour1'>" + 
				"<form class='updateForm' id='"+notes[i].timestamp+"' onsubmit='updateNote(this.id)'>" +
                "<input type='text' class='note-title' placeholder='Untitled' maxlength='10' value='"+notes[i].title + "' id='"+notes[i].timestamp+"'/>" + 
				 "<textarea class='note-content' placeholder='Your content here' id='"+notes[i].timestamp+"' />"+notes[i].note+"</textarea>" + 
				 "<img src='../images/close.png' onclick='removeNote(this.id)' class='delete' id='" + notes[i].timestamp + "'  />" +
                 "<input type='submit' class='updated' value='update' id='" + notes[i].timestamp + "'/>" +
				 "</form></div></li>";
            };
    html += '</ul>';
    document.getElementById('notes').innerHTML = html;
}

//display the trash notes
function showTrashNotes(){
    var trashNotes = getTrashNotes();
    console.log(trashNotes);
    var html = '<ul>';
    for(var i=0; i<trashNotes.length; i++) {
        html += "<li><div class='colour1'>" + 
				 "<form class='restoreForm' id='"+trashNotes[i].timestamp+"'>" +
                 "<input type='text' class='note-title' placeholder='Untitled' disabled maxlength='10' value='"+trashNotes[i].title + "' id='"+trashNotes[i].timestamp+"'/>" + 
				 "<textarea class='note-content' placeholder='Your content here' disabled id='"+trashNotes[i].timestamp+"' />"+trashNotes[i].note+"</textarea>" + 
				 "<img src='../images/close.png' onclick='deleteTrashNote(this.id)' class='delete' id='" + trashNotes[i].timestamp + "'/>" +
                 "<input type='button' class='updated' value='restore' onclick='restoreTrashNote(this.id)' id='" + trashNotes[i].timestamp + "'/>" +
				 "</form></div></li>";
            };
    html += '</ul>';
    document.getElementById('trashNotes').innerHTML = html;  
}


//for dyanamically growing textarea
function autoGrow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}