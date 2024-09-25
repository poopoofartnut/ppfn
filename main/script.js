
if (!localStorage.getItem('theme')) {
    localStorage.setItem("theme", "1")
 }

 function change() {
   if (localStorage.getItem('theme') == '1') {
     localStorage.setItem("theme", '0')
     themeToggle("light");
   } else {
     localStorage.setItem("theme", '1')
     themeToggle("dark");
   }
 }
 function themeToggle(sigma){
   let root = document.documentElement;
   if(sigma == "light"){
       root.style.setProperty("--back", "rgb(230, 230, 230)");
       root.style.setProperty("--font", "black");
       root.style.setProperty("--tile", "rgb(200, 200, 200)");
       document.getElementById("res").innerHTML= "<span id='g' class='material-symbols-outlined'>dark_mode</span>";
       root.style.setProperty("--res", "rgb(56, 56, 56)");
       root.style.setProperty("--themeicon", "white");
   }else if (sigma == "dark"){
       root.style.setProperty("--back", "rgb(56, 56, 56)");
       root.style.setProperty("--font", "white");
       root.style.setProperty("--tile", "rgb(70, 70, 70)");
       document.getElementById("res").innerHTML= "<span id='g' class='material-symbols-outlined'>light_mode</span>";
       root.style.setProperty("--res", "rgb(230, 230, 230)");
       root.style.setProperty("--themeicon", "black");
   }else{
       console.log("Invalid theme var input")
   }
 }
var testData = [
    {
        "name":"skibidi game",
        "img":"/ppfn/main/placeholder.png",
        "src":"#"
    },
    {
        "name":"skibidi game1",
        "img":"/ppfn/main/placeholder.png",
        "src":"#"
    },
    {
        "name":"skibidi game2",
        "img":"/ppfn/main/placeholder.png",
        "src":"#"
    },
    {
        "name":"skibidi game3",
        "img":"/ppfn/main/placeholder.png",
        "src":"#"
    },
    {
        "name":"skibidi game4",
        "img":"/ppfn/main/placeholder.png",
        "src":"#"
    }
];
 var localskib;
 if(localStorage.getItem('theme')=="1"){var localskib = "dark"}else{var localskib = "light"}
 themeToggle(localskib);
 // Variable to hold the locations
var dataArr = {};
// Load the locations once, on page-load.
$(function() { 
    $.getJSON("/ppfn/main/gamelist.json").done(function(data) {
        window.dataArr = data.pages;
    }).fail(function(data) {
        console.log('no results found');
        
    });
}); 

// Respond to any input change, and show first few matches
$("#search").on('keypress keyup change input', function() { 
    var div = document.getElementById("tilecontainer");
    var arrival = $(this).val().toLowerCase();
    div.innerHTML = "";
    dataArr.filter(function(game) {
        // look for the entry with a matching `code` value
        return (game.name.toLowerCase().indexOf(arrival) !== -1);
    }).map(function(game) {
        // get titles of matches
        var tile = document.createElement('s');
        tile.href = "https://google.com";
        tile.classList.add("tile");
        tile.innerHTML = '<img src="'+game.img+'" alt="placeholder"><p class="sigma">'+game.name+'</p>';
        div.append(tile);
         
    });
    
         // create one text with a line per matched title
});
// submit button is not needed really
    var div = document.getElementById("tilecontainer");
    var arrival = '';
    div.innerHTML = "";
    dataArr.filter(function(game) {
        // look for the entry with a matching `code` value
        return (game.name.toLowerCase().indexOf(arrival) !== -1);
    }).map(function(game) {
        // get titles of matches
        var tile = document.createElement('s');
        tile.href = "https://google.com";
        tile.classList.add("tile");
        tile.innerHTML = '<img src="'+game.img+'" alt="placeholder"><p class="sigma">'+game.name+'</p>';
        div.append(tile);
         
});
    