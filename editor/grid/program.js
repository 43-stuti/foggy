import node from './node.js';
const programCanvas = document.getElementById("programgrid");
const patternCanvas = document.getElementById("patterngrid");
const programCtx = programCanvas.getContext("2d");
const programGrid = new node(10,10,programCanvas,programCtx,40);
let programLoop = () => {
    programGrid.drawGrid()
}
//setInterval(programLoop, 1000 / 60);
programLoop()