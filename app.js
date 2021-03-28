console.log('Javascript Running');
notesTile();
tabsTile();
closeQuick();

//toggling of Quick Copy button 

function closeQuick(){
  let hidden = document.getElementById('hidden');
  hidden.style.display="none";
  var copyText = document.getElementById("qname");
  copyText.value=(localStorage.getItem("name"));

  var copyText1 = document.getElementById("qemail");
  copyText1.value=(localStorage.getItem("email"));

  var copyText2 = document.getElementById("qother");
  copyText2.value=(localStorage.getItem("other"));
}


let hiddentoggle = document.getElementById('hiddentoggle');
hiddentoggle.addEventListener("click", function () {
  var ctr=0;
  let hidden = document.getElementById('hidden');
  if(hidden.style.display=="none")
  {
    window.setTimeout(function(){
      hidden.style.display = 'block';
      fadein();
    },0);
  }
  else
  {
    fadeout();
    window.setTimeout(function(){
      hidden.style.display = 'none';
    },700);
  }
  
  function fadein(){
    hidden.style.opacity = ctr !== 10 ? '0.'+ctr : 1;
    hidden.style.transform = ctr !== 10 ? 'scale('+('0.'+ctr)+')' : 'scale(1)';
    ctr++;
    
    if (ctr < 11)
      requestAnimationFrame(fadein);
    
    else
      ctr = 0;
  }

  function fadeout(){
    hidden.style.opacity = 1 - ('0.'+ctr);
    hidden.style.transform = 'scale('+(1 - ('0.'+ctr))+')';
    ctr++;
    
    if (ctr < 10)
      requestAnimationFrame(fadeout);
    else
      ctr = 0;
  }
})

// adding the notes

let addBtn = document.getElementById('addBtn');
addBtn.addEventListener("click", function (e) {
  let addTxt = document.getElementById("addTxt");
  let addLink = document.getElementById("addLink");
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  }
  else {
    notesObj = JSON.parse(notes)
  }
  notesObj.push({"text" : addTxt.value , "link" : addLink.value});
  localStorage.setItem("notes", JSON.stringify(notesObj));
  addTxt.value = "";
  addLink.value = "";
  console.log(notesObj);
  notesTile();
})

function notesTile() {
  let notes = localStorage.getItem("notes")
  if (notes == null) {
    notesObj = [];
  }
  else {
    notesObj = JSON.parse(notes);
  }
  console.log(notesObj);
  let notesComponent = "";
  notesObj.forEach(function (element, index) {
    notesComponent += `
    <div class="noteCard card my-2 mx-2 bg-dark text-white" style="border-radius: 20px">
    <div class="card-body">
    <h5 class="card-title"><b>Note #${index + 1} </b></h5>
    <a href=${element.link}><p class="card-text">${element.text}</p></a>
    </div>
    </div>
    `;
  });
  let notesElm = document.getElementById('notes');
  if (notesObj.length != 0) {
    notesElm.innerHTML = notesComponent;
  }
  else {
    notesElm.innerHTML = `<p> Its quite lonely here 😕 <br> Add a note!`
  }

}

// displaying the notes

function tabsTile() {
  let tabs = localStorage.getItem("tabs")
  if (tabs == null) {
    tabsObj = [];
  }
  else {
    tabsObj = JSON.parse(tabs);
    if(tabsObj.length==0)
    {
      console.log("style");
      document.getElementById("removeTab").style.display = "none";
    }
    else
      document.getElementById("removeTab").style.display = "inline-block";
  }
  for(var i=0;i<tabsObj.length;i++)
  {
    console.log("here2");
    var a = document.createElement("a");
    var node = document.createElement("li");
    a.textContent = tabsObj[i].title;
    a.setAttribute('href' , tabsObj[i].url);
    node.appendChild(a);
    document.getElementById("opentab").appendChild(node);
  }

}

// removing all notes

let removeBtn = document.getElementById('removeBtn');
removeBtn.addEventListener("click", function () {
  console.log('The note is being deleted');
  let notes = localStorage.getItem("notes")
  if (notes == null) {
    notesObj = [];
  }
  else {
    notesObj = JSON.parse(notes);
  }
  notesObj.splice(0);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  notesTile();
})


// removing all tabs

let removeTab = document.getElementById('removeTab');
removeTab.addEventListener("click", function () {
  console.log("Clearing tabs");
  let tabs = localStorage.getItem("tabs")
  if (tabs == null) {
    tabsObj = [];
  }
  else {
    tabsObj = JSON.parse(tabs);
  }
  tabsObj.splice(0);
  localStorage.setItem("tabs", JSON.stringify(tabsObj));
  document.getElementById("opentab").innerHTML = "";
  tabsTile();
})


// the search button

let search = document.getElementById('searchText');
search.addEventListener("input", function () {

  let inputVal = search.value.toLowerCase();
  console.log("input event", inputVal);
  let noteCards = document.getElementsByClassName('noteCard');
  Array.from(noteCards).forEach(function (element) {
    let cardText = element.getElementsByTagName("p")[0].innerText;
    if (cardText.includes(inputVal)) {
      element.style.display = "block";
    }
    else {
      element.style.display = "none";
    }
    console.log(cardText)
  })


})

//listing and closing tabs


let onetab = document.getElementById('onetab');
onetab.addEventListener("click",
  function list_session(callback) {
    chrome.windows.getAll({populate : true}, function (window_list) {
      tabsObj = [];
      for(var i=0;i<window_list.length;i++) {
        opentabs = [];
        for(var j=0;j<window_list[i].tabs.length;j++)
        {
          console.log("here");
          tabsObj.push({"url": window_list[i].tabs[j].url,"title": window_list[i].tabs[j].title});
          if(window_list[i].tabs[j].active==false)
          {
            opentabs.push(window_list[i].tabs[j].id)
          }
        }
        function onRemoved() {
          console.log(`Removed`);
        }

        function onError(error) {
          console.log(`Error: ${error}`);
        }

        var removing = chrome.tabs.remove(opentabs);
        console.log(removing);
      }
      localStorage.setItem("tabs", JSON.stringify(tabsObj));
      console.log(localStorage.tabs);
      tabsTile();
    }
    )})


// Quick Copy
let qnamec = document.getElementById('qnamec');
qnamec.addEventListener("click",
function list_session(callback) {
var copyText = document.getElementById("qname");
  copyText.select();
  localStorage.setItem("name", copyText.value);
  document.execCommand("copy");
})

let qemailc = document.getElementById('qemailc');
qemailc.addEventListener("click",
function list_session(callback) {
var copyText = document.getElementById("qemail");
localStorage.setItem("email", copyText.value);
  copyText.select();
  document.execCommand("copy");
})

let qotherc = document.getElementById('qotherc');
qotherc.addEventListener("click",
function list_session(callback) {
var copyText = document.getElementById("qother");
localStorage.setItem("other", copyText.value);
  copyText.select();
  document.execCommand("copy");
})


// conversion of uri to blob

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

// screenshot of the tab

let captureTab = document.getElementById('captureTab');
captureTab.addEventListener("click",
  function list_session(callback) {
    chrome.windows.getAll({populate : true}, function (window_list) {
      for(var i=0;i<window_list.length;i++) {
        for(var j=0;j<window_list[i].tabs.length;j++)
        {
          if(window_list[i].tabs[j].active==true)
          {
            var capturing = chrome.tabs.captureVisibleTab(async function(imageUri)
            {
              //const response = await fetch(imageUri)
              const blob = dataURItoBlob(imageUri);
              navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
            });
          }
        }
      }
    }
    )})