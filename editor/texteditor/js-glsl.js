export default class jsToGlsl {
    constructor() {
    }
    starter = () => {
        let codeString = `
       
        void main() {
            vec2 st = 2.*(gl_FragCoord.xy - 0.*uResolution.xy) / min(uResolution.x, uResolution.y);
            //more colour to a separate function
            vec3 color = vec3(.0);
        `
        return codeString
    }
    forLoop = (index,scale, amp, m_dist, time_offset) => {
        /*
        TODO: add range conditiions
        TODO: start evolution
        *adjust fuse levels
        *increase population
        NOTE: This also sets the colour
         */
        let codeString = 
        `
        float m_dist_${index} = ${m_dist}.0;
        vec2 st_${index} = ${scale}.0*st+${index}.0/6.;
        vec2 i_st_${index} = floor(st_${index});
        vec2 f_st_${index} = fract(st_${index});
        for (int j= -1; j <= 1; j++ ) {
            for (int i= -1; i <= 1; i++ ) {
                // Neighbor place in the grid
                vec2 neighbor = vec2(float(i),float(j));
    
                // Random position from current + neighbor place in the grid
                vec2 offset = random2(i_st_${index} + neighbor);
    
                // Animate the offset
                offset = 0.5 + 0.5*sin(time + 36.2831*offset);
    
                // Position of the cell
                vec2 pos = neighbor + offset - f_st_${index};
    
                // Cell distance
                float dist = length(pos);
    
                // Metaball it!
                m_dist_${index} = min(m_dist_${index}, m_dist_${index}*dist);
            }    
        }
        //TODO: add conditions for effect
        `
        if(index == 0) {
            codeString += `color += step(0.005, m_dist_${index});`
        } else {
            codeString += `color += (0.005, m_dist_${index});`
            let colour = ['r','g','b']
            
            let picker = colour[Math.floor(Math.random() * colour.length)];
            codeString += `color.${picker} += ${index}.0/5.0;`
        }
        return codeString
    }
    init = (organisms,world) => {
        let codeString = this.starter()
        let ind = 0;
        for(let org in organisms) {
           console.log('ORG',org)
           let obj = this.normalizeValues(organisms[org],world);
           if(obj.density) {
            codeString += this.forLoop(ind,obj.density||0,0,1)
           }
           ind++;
        }
       codeString += `gl_FragColor = vec4(color,1.0);
        }
       `
       return codeString
    }
    normalizeValues = (org,world) => {
        return org
    }
    /**
     becky : {
         density:0.2, 
         dob:% of total 
         colour: 'ABC',
     }
     make a splash. 
     grow it 
     */
}
/**
    #VARIABLES 
    - scale 
    - m_dist_calc[]
    - offset[] 
    - pivot_points[]
    - colour and shape effect[]

 */

    /**
     for loop function 
     call it as many organisms are spawned 
     */