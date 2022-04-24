const FREQUENCY = 20.1;
const AMPLITUDE = 0.005;
const TYPE = 'SINE'
export default class Distortion {
    constructor() {
        this.distortiontype = TYPE;
        this.frequency = FREQUENCY;
        this.amplitude = AMPLITUDE
    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        if(elm.type == 'DISTORTIONTYPE') {
            this.moment = elm.value;
        }
        if(elm.type == 'FREQUENCY') {
            this.frequency = elm.value;
        }
        if(elm.type == 'AMPLITUDE') {
            this.amplitude = elm.value;
        }
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'DISTORTIONTYPE':
                if(['SINE','FRACT','NOISE'].indexOf(element.value) < 0) {
                    element.value = TYPE
                }
            break;
            case 'GLOW':
                if(isNaN(element.value)) {
                    element.value = GLOW;
                }
            break;
            case 'FREQUENCY':
                if(isNaN(element.value)) {
                    element.value = FREQUENCY;
                }
            break;
            case 'INTENSITY':
                if(isNaN(element.value)) {
                    element.value = INTENSITY;
                }
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}