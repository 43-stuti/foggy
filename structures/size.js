const SIZE = 0.05;
const MAXGROWTH = 0.5;
export default class Size {
    constructor() {
        this.sizevalue = SIZE;
        this.grows= false;
        this.maxGrowth = MAXGROWTH;
        this.growthSpeed = 0.0
    }
    create(obj) {

    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        if(elm.type == 'SIZEVALUE') {
            this.sizevalue = elm.value;
        }
        if(elm.type == 'GROWS') {
            this.grows = elm.value;
        }
        if(elm.type == 'MAXGROWTH') {
            this.maxGrowth = elm.value;
        }
        if(element.type == 'GROWTHSPEED') {
            this.growthSpeed = elm.value;
        }
           
    }
    parseCode(str) {
    }
    isValid(element) {
        //check type
        let valid = true;
        switch(element.type) {
            case 'SIZEVALUE':
                if(isNaN(element.value) || element.value > 1 ) {
                    element.value = SIZE;
                }
                element.value = parseFloat(element.value)
            break;
            case 'GROWS':
                if(element.value) {
                    element.value = true;
                }
            break;
            case 'MAXGROWTH':
                if(isNaN(element.value) || element.value > 1) {
                    element.value = MAXGROWTH;
                }
                element.value = parseFloat(element.value)
            break;
            case 'GROWTHSPEED':
                if(isNaN(element.value)) {
                    element.value = GROWTHSPEED;
                }
                element.value = parseFloat(element.value)
            break;

        }
        return {
            valid:valid,
            elm:element
        }
    }
}