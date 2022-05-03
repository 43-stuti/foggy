import Org from './org.js'
export default class Collection {
    constructor() {
        this.organisms = {}
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.counter = 0;
    }
    add(obj) {
       if(this.organisms[obj?.name]) {
           console.log("Duplicate organism");
           return false;
       }
       this.organisms[obj?.name] = new Org(obj?.name,obj?.type||'UNI',this.organisms);
    }
    checkCollectionValues() {
        //reset merge values
        //check colour and add pattern
        this.r = 0;
        this.g = 0;
        this.b = 0;
        let maxr={value:0,org:null},maxg={value:0,org:null},maxb={value:0,org:null}
        for(let org in this.organisms) {
            console.log('LALLA',this.organisms,this.organisms[org]?.colour)
            this.r += this.organisms[org]?.colour?.r;
            this.g += this.organisms[org]?.colour?.g;
            this.b += this.organisms[org]?.colour?.b;
            if(this.organisms[org]?.colour?.r > maxr.value) {
                maxr.value = this.organisms[org]?.colour?.r;
                maxr.org = org
            }

            if(this.organisms[org]?.colour?.g > maxg.value) {
                maxg.value = this.organisms[org]?.colour?.g;
                maxg.org = org
            }

            if(this.organisms[org]?.colour?.b > maxb.value) {
                maxb.value = this.organisms[org]?.colour?.b;
                maxb.org = org
            }
        }

        if(Object.keys(this.organisms).length > 2) {
            let pr = this.r/(this.r+this.b+this.g);
            let pg = this.g/(this.r+this.b+this.g);
            let pb = this.b/(this.r+this.b+this.g);
            let prob = Math.random();
            let org;
            console.log('PROB',prob);
            if(prob > 0.5) {
                if(pr >= 0.5) {
                   org = maxr?.org;
                }
                if(pg >= 0.5) {
                    org = maxg?.org
                }
                if(pb >= 0.5) {
                    org = maxb?.org
                }
                if(org) {
                    setTimeout(()=> {
                        this.organisms[org].colour.r = 1 - this.organisms[org]?.colour.r;
                        this.organisms[org].colour.g = 1 - this.organisms[org]?.colour.g;
                        this.organisms[org].colour.b = 1 - this.organisms[org]?.colour.b;
                    },2000)
                    
                }
            }
            
            //update color
        }

    }
}