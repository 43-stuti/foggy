let buttonstate = 0;
let button = document.getElementById("ascii");
let img = document.getElementById("ascii-img");
img.style.zIndex = -1

let guide = document.getElementById("guide");
let img_guide = document.getElementById("guide-img");
img_guide.style.zIndex = -1;

let download = document.getElementById("link");
button.addEventListener('click', (e) => {
   
    img.style.opacity = 1 - img.style.opacity;
    img.style.zIndex = (1 - Math.abs(img.style.zIndex))*-1;
  });

  guide.addEventListener('click', (e) => {
   
    img_guide.style.opacity = 1 - img_guide.style.opacity;
    img_guide.style.zIndex = (1 - Math.abs(img.style.zIndex))*-1;
  });

  download.addEventListener('click', (e) => {
    window.captureFrame = true;
  });