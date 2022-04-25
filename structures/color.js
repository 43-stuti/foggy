const GRAINS = 10;
const GLOW = 40.5;
const INTENSITY = 0.1;
const TYPE = 'BASIC';
//strips
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
            console.log('WTFFFFFFFFFFFFFFFF',elm,valid)
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
            if(elm.type == 'COLORARRAY') {
                console.log('HEHEHEH',elm.value)
                this.colorarray.push(elm.value);
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
                if(!element.value.r) {
                    element.value.r = 0.0
                }
                if(!element.value.g) {
                    element.value.g = 0.0
                }
                if(!element.value.b) {
                    element.value.b = 0.0
                }
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}