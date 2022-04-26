import Parser from  './parser.js'
import Program from './program.js'
import jsToGlsl from './js-glsl.js'
import shaderinit from './../GLSL/shaderinit.js'

let program = new Program();
const parser = new Parser(program)
let toglsl = new jsToGlsl(program.collection);
let canvas = new shaderinit(toglsl);
window.editor = document.getElementById('text_editor_space');
let ind = 0;
let init = () => {
    canvas.init();
}
let recomplie = () => {
    //let parsedOutput = parser.parseCode(editor.value)
    //let exec = program.execute(parsedOutput)
    
    let shaderOutput = toglsl.init()
    canvas.updateShader(shaderOutput)
}
let parse = () => {
  let parsedOutput = parser.parseCode(editor.value)
  //let exec = program.execute(parsedOutput)
}
let addNewLine = () => {
  const div = document.createElement("div");
  div.className = "codeText"
  div.setAttribute("contenteditable",true)
  window.editor.appendChild(div)
}
/**
 on click update shader
 */
init()

/**
 new parser 
 read new line 
 pass it to parser 
 pass the returned value from parser to the program 
 program passes the global variable to main 
 main passes it to prog to glsl 
 */
 window.editor.addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
      ind++;
      //e.preventDefault();
      parse();
      recomplie();
      //addNewLine();
    }
  });
  window.editor.addEventListener('recomplieshader', (e) => {
    console.log('recomplieshader')
    //recomplie();
  });