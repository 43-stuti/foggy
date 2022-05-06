const GRAINS = 10;
const GLOW = 40.5;
const INTENSITY = 0.1;
const TYPE = 'BASIC';
//strips
export default class Color {
    constructor() {
        this.colortype = TYPE;
        this.r = 0.0,
        this.g = 0.0,
        this.b = 0.0,
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
                this.colortype = elm.value;
            }
            if(elm.type == 'GRAINS') {
                this.grains = elm.value;
            }
            if(elm.type == 'GLOW') {
                this.glow = elm.value;
            }
            if(elm.type == 'INTENSITY') {
                this.intensity = elm.value;
            }
            if(elm.type == 'R') {
                this.r = elm.value;
            }
            if(elm.type == 'G') {
                this.g = elm.value;
            }
            if(elm.type == 'B') {
                this.b = elm.value;
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
                element.value = parseFloat(element.value);
            break;
            case 'INTENISTY':
                if(isNaN(element.value)) {
                    element.value = INTENSITY;
                }
                element.value = parseFloat(element.value);
            break;
            case 'GRAINS':
                if(isNaN(element.value)) {
                    element.value = GRAINS;
                }
                element.value = parseFloat(element.value);
            break;
            case 'R':
                if(isNaN(element.value)) {
                    element.value = 0.0;
                }
                element.value = parseFloat(element.value);
            break;
            case 'G':
                if(isNaN(element.value)) {
                    element.value = 0.0;
                }
                element.value = parseFloat(element.value);
            break;
            case 'B':
                if(isNaN(element.value)) {
                    element.value = 0.0;
                }
                element.value = parseFloat(element.value);
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}