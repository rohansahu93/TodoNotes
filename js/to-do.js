//get all the notes stored in localstorage
function get_notes() {
    var notes = new Array;
    var notes_str = localStorage.getItem('note');
    
    if (notes_str !== null) {
        notes = JSON.parse(notes_str); 
    }
    return notes;
}

//object created for new note
function note( title ,task)
    {
      var notes = get_notes();
      this.id = notes.length;
      this.title = title;
      this.note = task;
      this.created_time = new Date();
    }

//saving the notes to localstorage after crud operations
function saveNotes(notesArray)
{
    localStorage.setItem('note', JSON.stringify(notesArray));
    show();
    return false;
}

//add a new note and stored into localstorage
function addNote() 
{
    var task = document.getElementById('task').value;
    var title = document.getElementById('title').value;
    var notes = get_notes();
    var task_Object =new note(title , task) ;
    notes.push(task_Object);
    saveNotes(notes);
 
    return false;
}

//update note according to the id generated
function updateNote(id) 
{
    var title= $("#"+id).find(".note-title#" + id).val();
    var note = $("#"+id).find(".note-content#" + id).val();
    console.log(title);
    var notes = get_notes();
    for(var i=0;i<notes.length;i++){
        if(notes[i].id == id){
            notes[i].note=note;
            notes[i].title=title;
            notes[i].timestamp= new Date();
            break;
        }
    }
    
    saveNotes(notes);
    return false;
}
 
//delete note with respect to id
function removeNote(id) {
    var temp = 0;
    var notes = get_notes();
    
  for(var i=0; i< notes.length; i++){
     if(notes[i].id == id){
         console.log("heloo");
         notes.splice(i,1);
         temp = 1;
         break;
     }   
    }
    
    if(id  >= 0 && temp == 1)
        {    
  for(var i=id; i< notes.length; i++)
          {
      notes[i].id = notes[i].id - 1
          }
        }
    else
    {    
  for(var i=id+1; i< notes.length; i++){
      notes[i].id = notes[i].id - 1;
        }
    }
    
    saveNotes(notes);
 
    return false;
}

//display all the notes  
function show() {
    var notes = get_notes();
 
    var html = '<ul>';
    for(var i=0; i<notes.length; i++) {
        html += "<li><div class='colour1'>" + 
					"<form class='updateForm' id='"+i+"' onsubmit='updateNote(this.id)'>" +
            "<input type='text' class='note-title' placeholder='Untitled' maxlength='10' onkeyup='auto_grow(this)' value='"+notes[i].title + "' id='"+i+"'/>" + 
					"<textarea class='note-content' placeholder='Your content here' onkeyup='auto_grow(this)' id='"+i+"' />"+notes[i].note+"</textarea>" + 
					"<img src='../images/close.png' onclick='removeNote(this.id)' class='delete' id='" + i + "'  />" +
                   "<input type='submit' class='updated' value='update' id='" + i + "'/>" +
					"</form></div></li>";
            };
    
    html += '</ul>';
    
    document.getElementById('notes').innerHTML = html;

}

//for dyanamically growing textarea
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

show();
