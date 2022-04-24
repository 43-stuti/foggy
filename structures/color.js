const GRAINS = 10;
const GLOW = 40.5;
const INTENSITY = 0.1;
const TYPE = 'BASIC';
export default class Color {
    constructor() {
        this.colortype = TYPE;
        this.colorarray = [];
        this.grains = GRAINS;
        this.glow = GLOW;
        this.intensity = INTENSITY;
    }

    setProperty(element) {
        let {valid,elm} = this.isValid(element);
            if(!valid) {
                return false;
            }
            if(elm.type == 'COLORTYPE') {
                this.moment = elm.value;
            }
            if(elm.type == 'GRAINS') {
                this.moves = elm.value;
            }
            if(elm.type == 'GLOW') {
                this.moves = elm.value;
            }
            if(elm.type == 'INTENSITY') {
                this.moves = elm.value;
            }
            if(element.type == 'COLORARRAY') {
                this.moves = elm.value;
            }
    }
    create(obj) {

    }
    parseCode(str) {
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'COLORTYPE':
                if(['BASIC','SWIRL','SHINE','GLOW'].indexOf(element.value) < 0) {
                    element.value = TYPE
                }
            break;
            case 'GLOW':
                if(isNaN(element.value)) {
                    element.value = GLOW;
                }
            break;
            case 'INTENISTY':
                if(isNaN(element.value)) {
                    element.value = INTENSITY;
                }
            break;
            case 'GRAINS':
                if(isNaN(element.value)) {
                    element.value = GRAINS;
                }
            break;
            case 'COLORARRAY':
                if(!Array.isArray(element.value)) {
                    valid = false;
                }
                element.value.forEach((clr) => {
                    if(!clr.r) {
                        clr.r = 0.0
                    }
                    if(!clr.g) {
                        clr.g = 0.0
                    }
                    if(!clr.b) {
                        clr.b = 0.0
                    }
                    
                })
            break;
        }
        return {
            valid:valid,
            element:element
        }

    }
}