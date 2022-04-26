export default class Speed {
    constructor() {
        this.speedval = 0.0;
        this.angle= 0.0;
        this.rad = 0.01;
        this.delta = 0.12
    }
    setProperty(value,movement) {
        if(movement == 'LINEAR') {
            this.setLinear(value)
        }
        if(movement == 'CIRCULAR') {
            this.setCircluar(value)
        }
    }
    parseCode(str) {
    }
    setLinear(element) {
        if(element.type == 'SPEEDVAL') {
            this.speedval = parseFloat(element.value);
        }
        if(element.type == 'ANGLE') {
            this.angle = parseFloat(element.value);
        }
        this.delta = 0.0;
        this.rad = 0.0
    }
    setCircluar(element) {
        if(element.type == 'DELTA') {
            this.delta = parseFloat(element.value);
        }
        if(element.type == 'RAD') {
            this.rad = parseFloat(element.value);
        }
        this.speedval = 0.0;
        this.angle = 0.0
    }
}