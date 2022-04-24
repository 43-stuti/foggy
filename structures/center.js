const CENTERX = Math.random();
const CENTERY = Math.random();
export default class Center {
    constructor() {
        this.centerx = CENTERX;
        this.centery = CENTERY;
        this.randomPos = false
    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        if(elm.type == 'CENTERX') {
            this.centerx = elm.value;
        }
        if(elm.type == 'CENTERY') {
            this.centery = elm.value;
        }
        if(elm.type == 'RANDOMPOS') {
            this.randomPos = elm.value;
            if(this.randomPos) {
                this.centerx = Math.random();
                this.centerx = Math.random();
            }
        }
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'CENTERX':
                if(isNaN(element.value) || element.value > 1 || element.value < 0) {
                    element.value = CENTERX;
                }
            break;
            case 'CENTERY':
                if(isNaN(element.value) || element.value > 1 || element.value < 0) {
                    element.value = CENTERY;
                }
            break;
            case 'RANDOMPOS':
                if(element.value) {
                    element.value = true;
                } else {
                    element.value = false;
                }
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}