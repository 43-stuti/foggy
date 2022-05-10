
export default class Org {
    constructor(name) {
        this.name = name;
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
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
        }
        return {
            valid:valid,
            elm:element
        }

    }
}

