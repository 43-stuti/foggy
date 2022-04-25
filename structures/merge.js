export default class Merge {
    constructor(orgs) {
        this.mergeorgs = []
        this.orgs = orgs;
        this.mergeGroup = null
    }
    setProperty(element) {
        let {valid,elm} = this.isValid(element);
            console.log('WTFF',elm,valid)
            if(!valid) {
                return false;
            }
            if(elm.type == 'MERGEORGS') {
                this.mergeorgs = [...this.mergeorgs,...elm.value];
            }
    }
    parseCode(str) {
    }
    isValid(element) {
        let valid = true;
        switch(element.type) {
            case 'MERGEORGS':
                if(!Array.isArray(element.value)) {
                    valid = false
                }
                let validArray = []
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