import Parser from  './parser2.js'
import Program from './program2.js'
import jsToGlsl from './../GLSL/js-glsl.js'
import errorToGlsl from './../GLSL/error-glsl.js'
import shaderinit from './../GLSL/shaderinit2.js'
import ErrorProgram from './error-program.js'
let errorProgram = new ErrorProgram()
let program = new Program(errorProgram);
window.currDiv;
program.init()
const parser = new Parser(program)
//let toglsl = new jsToGlsl(program.collection);
let toglsl = new errorToGlsl(errorProgram);
let canvas = new shaderinit(toglsl);

window.editor = document.getElementById('text_editor_space');
window.ind = 0;
let init = () => {
    canvas.init();
    let shaderOutput = toglsl.init()
    canvas.updateShader(shaderOutput)
}
let recomplie = () => {
    //let parsedOutput = parser.parseCode(editor.value)
    //let exec = program.execute(parsedOutput)
    
    let shaderOutput = toglsl.init()
    canvas.updateShader(shaderOutput)
}
let parse = (txt) => {
  parser.parseCode(txt)
  //let exec = program.execute(parsedOutput)
}
let addNewLine = () => {
  const div = document.createElement("div");
  div.className = "codeText";
  div.id = `inst_${window.ind}`;
  div.setAttribute("contenteditable",true)
  window.editor.appendChild(div);
  const selection = window.getSelection();  
  const range = document.createRange();  
  selection.removeAllRanges();  
  range.selectNodeContents(div);  
  range.collapse(false);  
  selection.addRange(range);  
  div.focus();
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
      window.currDiv = document.getElementById(`inst_${window.ind}`);
      window.ind++;
      e.preventDefault();
      parse(window.currDiv.innerHTML);
      recomplie();
      addNewLine();
      window.editor.scrollTop = window.editor.scrollHeight;
    }
  });
  window.editor.addEventListener('recomplieshader', (e) => {
    console.log('recomplieshader')
    //recomplie();
  });