import speed from './speed.js'
export default class Movement {
    constructor() {
       this.speed = new speed();
       this.movementtype = 'LINEAR';
       this.moves = false;

    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        if(elm.type == 'MOVEMENT') {
            this.movementtype = elm.value;
        }
        if(elm.type == 'MOVES') {
            this.moves = elm.value;
        }
        if(element.type == 'SPEED') {
            this.speed.setProperty(elm.value,this.movementtype);
        }
    }
    parseCode(str) {
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'MOVEMENTTYPE':
                if(['LINEAR','CIRCULAR'].indexOf(element.value) < 0) {
                    element.value = 'LINEAR'
                }
            break;
            case 'MOVES':
                if(element.value) {
                    element.value = true;
                }
            break;
            case 'SPEED':
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}