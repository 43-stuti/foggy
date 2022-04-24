import color from './color.js'
import distortion from './distortion.js'
import movement from './movement.js'
import size from './size.js'
import merge from './merge.js'
import center from './center.js'
export default class Org {
    constructor(name) {
        this.name = name;
        this.size = new size();
        this.colour = new color();
        this.center = new center();
        this.distortion = new distortion();
        this.movement = new movement();
        this.merge = [];
    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        if(elm.type == 'NAME') {
            this.name = elm.value[0];
        }
        if(elm.ype == 'COLOUR') {
            this.colour.setProperty(elm.value)
        }
        if(elm.type == 'SIZE') {
            this.size.setProperty(elm.value)
        }
        if(elm.type == 'DISTORTION') {
            this.size.setProperty(elm.value)
        }
        if(elm.type == 'MOVEMENT') {
            this.movement.setProperty(elm.value)
        }
        if(elm.type == 'CENTER') {
            this.center.setProperty(elm.value)
        }
        if(elm.type == 'MERGE') {
            //this.size.setProperty(elm.value)
            
        }
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'NAME':
                if(!(typeof element.value == 'string')) {
                    valid = false;
                }
            break;
            case 'COLOUR':
            break;
            case 'SIZE':
            break;
            case 'DISTORTION':
            break;
            case 'MOVEMENT':
            break;
            case 'CENTER':
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}

