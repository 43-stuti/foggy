export default class Program {
    
  	constructor(world,variableStack) {
      this.variableStack = variableStack
      this.world = {
        evolve:false
      }
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
      if(['density','color','lifespan','residesIn','bornOn','growthRate'].indexOf(ip.fn) == -1) {
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
        case 'growthRate':
        break;

      }

      /**
       add property to variable
       */
      
       this.variableStack[ip.op][ip.fn] = ip.val;
    }
    addWorldProperty = (ip) => {
      /**
       Add type check and range check 
       */
      console.log('VP',this.variableStack[''])
      
      if(['evolve','create'].indexOf(ip.fn) == -1) {
        console.log('undefined property')
        return false
      }
      /**
       type check:
       TODO: Move to a separate function
       */
      switch(ip.fn) {
        case 'evolve':
        break;
        case 'create':
        break;

      }

      /**
       add property to variable
       */
        console.log('SET PROP',ip.fn,ip.val)
       this.world[ip.fn] = ip.val;
    }
    verify = (input) => {
      if(!input.fn) return {isValid:false}
      if(input.fn == 'spawn') {
        if(!input.arg || !input.op) return {isValid:false}
        return {isValid:true,type:1}
      } else {
        if(input.op == 'world') {
          return {isValid:true,type:3}
        } else {
          if(!input.val || !input.op) return {isValid:false}
          return {isValid:true,type:2}
        }
      }
    }
    execute = (input) => {
      this.variableStack = {};
      input.forEach((ip) => {
        let verify = this.verify(ip);
        console.log('verify',verify)
        if(verify.isValid) {
          switch(verify.type) {
            case 1:
              this.defineVariable(ip)
            break;
            case 2:
              this.addVariableProperty(ip)
            break;
            case 3:
              this.addWorldProperty(ip)
            break;
          }
        }
      })
      return {
        world:this.world,
        variableStack:this.variableStack
      }
    }
}

/**
 ENTITIES: 
 world and organisms 
 */