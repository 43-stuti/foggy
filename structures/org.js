import color from './color.js'
import distortion from './distortion.js'
import movement from './movement.js'
import size from './size.js'
import merge from './merge.js'
import center from './center.js'
export default class Org {
    constructor(name,type,orgs) {
        this.name = name;
        this.size = new size();
        this.colour = new color();
        this.center = new center(name);
        this.distortion = new distortion();
        this.movement = new movement();
        this.merge = new merge(orgs);
        this.type = type || 'UNI';
        this.children = [];
        this.extinct = false;
        this.mutations = [];
        this.orgs = orgs;
        this.inDestruction = false;
    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
        if(!valid) {
            return false;
        }
        this.mutations.push(elm);
        if(elm.type == 'NAME') {
            this.name = elm.value[0];
        }
        if(elm.type == 'CHILDREN') {
            this.children = [...this.children,...elm.value];
        }
        if(elm.type == 'COLOR') {
            this.colour.setProperty(elm.value)
        }
        if(elm.type == 'SIZE') {
            this.size.setProperty(elm.value)
        }
        if(elm.type == 'DISTORTION') {
            this.distortion.setProperty(elm.value)
        }
        if(elm.type == 'MOVEMENT') {
            this.movement.setProperty(elm.value)
        }
        if(elm.type == 'CENTER') {
            this.center.setProperty(elm.value)
        }
        if(elm.type == 'MERGE') {
            this.merge.setProperty(elm.value)
            
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
            case 'CHILDREN':
                if(!Array.isArray(element.value)) {
                    valid = false
                }
                let validArray=[]
                element.value.forEach(elm => {
                    if(this.orgs[elm] && !this.orgs[elm].extinct) {
                        validArray.push(elm)
                    }
                });
                element.value = validArray
            break;
        }
        return {
            valid:valid,
            elm:element
        }

    }
}

