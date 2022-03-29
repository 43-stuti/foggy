export default class Program {
    
  	constructor(world,variableStack) {
      this.variableStack = variableStack
    }
    defineVariable = (ip) => {
      if(this.variableStack[ip.arg]) {
        console.log('already defined')
      } else {
        this.variableStack[ip.arg] = {};
      }
    }
    addVariableProperty = (ip) => {
      /**
       Add type check and range check 
       */
      console.log('VP',this.variableStack[''])
      if(!this.variableStack[ip.op]) {
        return false
      }
      if(['density','color','lifespan','residesIn','bornOn'].indexOf(ip.fn) == -1) {
        console.log('undefined property')
        return false
      }
      /**
       type check:
       TODO: Move to a separate function
       */
      switch(ip.fn) {
        case 'density':
        break;
        case 'color':
        break;
        case 'lifespan':
        break;
        case 'residesIn':
        break;
        case 'bornOn':
        break;

      }

      /**
       add property to variable
       */
      
       this.variableStack[ip.op][ip.fn] = ip.val;
    }
    verify = (input) => {
      if(!input.fn) return {isValid:false}
      if(input.fn == 'spawn') {
        if(!input.arg || !input.op) return {isValid:false}
        return {isValid:true,type:1}
      } else {
        if(!input.val || !input.op) return {isValid:false}
        return {isValid:true,type:2}
      }
    }
    execute = (input) => {
      this.variableStack = {};
      input.forEach((ip) => {
        let verify = this.verify(ip);
        if(verify.isValid) {
          switch(verify.type) {
            case 1:
              this.defineVariable(ip)
            break;
            case 2:
              this.addVariableProperty(ip)
            break;
          }
        }
      })
      return this.variableStack
    }
}

/**
 ENTITIES: 
 world and organisms 
 */