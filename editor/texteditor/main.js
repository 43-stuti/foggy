import * as canvas from './../GLSL/shader.js'
import Parser from  './parser.js'
import Program from './program.js'
import jsToGlsl from './js-glsl.js'
const parser = new Parser()
let program = new Program({},[]);
let toglsl = new jsToGlsl();
const editor = document.getElementById('text_editor_space');

let init = () => {
    canvas.init();
}
let recomplie = () => {
    let parsedOutput = parser.parseCode(editor.value)
    let exec = program.execute(parsedOutput)
    let shaderOutput = toglsl.init(exec.variableStack,exec.world)
    canvas.updateShader(shaderOutput)
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
 editor.addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
      recomplie();
    }
  });