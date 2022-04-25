export default class Speed {
    constructor() {
        this.xspeed = 0.0;
        this.yspeed= 0.0;
        this.r = 0.01;
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
        if(element.type == 'XSPEED') {
            this.x = element.value;
        }
        if(element.type == 'YSPEED') {
            this.y = element.value;
        }
        this.delta = 0.0;
        this.r = 0.0
    }
    setCircluar(element) {
        if(element.type == 'DELTA') {
            this.delta = element.value;
        }
        if(element.type == 'R') {
            this.r = element.value;
        }
        this.x = 0.0;
        this.y = 0.0
    }
}