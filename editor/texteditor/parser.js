export default class Parser {
    constructor() {

    }
    parseString(str) {
        let split1 = str.split(".");
        let fn;
        let val;
        let arg;
        if(split1?.[1].indexOf("=") != -1) {
            val = split1?.[1].split("=");
            fn = val?.[0]?.trim()
            val = val?.[1]?.trim()
        }
        if(split1?.[1].indexOf("(") != -1) {
            arg = split1?.[1].match(/\(([^)]+)\)/)
            fn = split1?.[1].replace(arg?.[0],'').trim()
            arg = arg?.[1].trim()

        }
        return {
            op:split1?.[0],
            val: val,
            fn:fn, 
            arg:arg
        }

    }
    parseCode(str) {
        let codeArr = str.split('\n');
        let parsedOutput = [];
        codeArr.forEach((line) => {
            parsedOutput.push(this.parseString(line))
        })
        return parsedOutput
    }
    isValid() {

    }
}