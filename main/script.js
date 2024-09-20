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
       document.getElementById("res").innerHTML= "<span class='material-symbols-outlined'>dark_mode</span>";
       root.style.setProperty("--res", "rgb(56, 56, 56)");
       root.style.setProperty("--themeicon", "white");
   }else if (sigma == "dark"){
       root.style.setProperty("--back", "rgb(56, 56, 56)");
       root.style.setProperty("--font", "white");
       root.style.setProperty("--tile", "rgb(70, 70, 70)");
       document.getElementById("res").innerHTML= "<span class='material-symbols-outlined'>light_mode</span>";
       root.style.setProperty("--res", "rgb(230, 230, 230)");
       root.style.setProperty("--themeicon", "black");
   }else{
       console.log("Invalid theme var input")
   }
 }
 var localvar;
 if(localStorage.getItem('theme')=="1"){var localvar = "dark"}else{var localvar = "light"}
 themeToggle(localvar);
