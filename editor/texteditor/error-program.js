import glslmap from "./glsl-function-map.js"
import intop from "./int-op.js"

export default class ErrorProgram {
    constructor() {
        //TODO:delayed functions!
        this.errorStack = []
        this.currentString = ''
    }
    addToFunctionStack = (inst) => {
    }
    error = (type,inst) => {
        console.log('ERRR',type,inst)
        //get keyword strength 
        //get arg1 
        //get arg2 
        //get op 
        //check if 0th is string
        let vals = inst.split(" ");
        let arr = [vals[0]||'',...vals?.[1]?.split('')];
        //[label,arg1,op,arg2]
        let op = this.labelStrength(arr[0])%5;
        let fn = (parseInt(arr[1]) || Math.floor((Math.random())*13))%13;
        let arg = vals[3] || Math.random();

        let opval = intop[op];
        let fnval = glslmap[fn];
        //pick x or y
        this.makeGLSL(op,opval,fnval,arg)

    }
    makeGLSL = (op,opval,fnval,arg) => {
        let xy = ''
        if(op % 2 == 0) {
            xy = 'y';
        } else {
            xy = 'x'
        }

        this.currentString += this[fnval?.fn](opval?.fn||'=',arg,xy);
        console.log(this.currentString)
    }
    labelStrength = (str) => {
        let val = 0;
        for (var i = 0; i < str.length; i++) {
            val += str.charCodeAt(i);
        }
        return val
    }
    cos(opval,arg,xy) {
        return `${xy} ${opval} cos(${xy}*${this.toFloat(arg)});`
    }
    sin(opval,arg,xy) {
        return `${xy} ${opval} sin(${xy}*${this.toFloat(arg)});`
    }
    tan(opval,arg,xy) {
        return `${xy} ${opval} tan(${xy}*${this.toFloat(arg)});`
    }
    fract(opval,arg,xy) {
        return `${xy} ${opval} fract(${xy}*${this.toFloat(arg)});`
    }
    pow(opval,arg,xy) {
        return `${xy} ${opval} pow(${this.toFloat(arg)},${xy});`
    }
    floor(opval,arg,xy) {
        return `${xy} ${opval} floor(${xy});`
    }
    length(opval,arg,xy) {
        return `${xy} ${opval} length(vec2(x,y));`
    }
    noise(opval,arg,xy) {
        return `${xy} ${opval} noise(vec2(x,y))*${arg});`
    }
    fbm(opval,arg,xy) {
        return `${xy} ${opval} fbm(vec2(x,y))*${arg});`
    }
    rotate(opval,arg,xy) {
        return `${xy} ${opval} (rotate2d(vec2(x,y))*${arg})).${xy};`
    }
    clamp(opval,arg,xy) {
        return `${xy} ${opval} rotate2d(vec2(x,y))*${arg}).${xy};`
    }
    toFloat = (val) => {
        val = val.toString();
        let split = val.split('.');
        return split[1] ? val : split[0]+'.0'
    }
    //add init
}

/**
ENTITIES: 
world and organisms 
*/