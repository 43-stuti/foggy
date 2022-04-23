let organismsObj = [{
    size:0.2,
    moves:true,
    moment: 'LINEAR',
    speed: {
        x:0.0009,
        y:0.0005
    },
    canMergeWith:[3],
    colour: {
        type:'GLOW',
        intensity:10.5,
        glow:3.6,
        array :[{
            r:1.0,
            g:0.2,
            b:0.3
        }]
    },
    center:{
        x:0.7,
        y:0.2
    },
    density:1,
    distortion : {
        type:'SINE',
        frequecy:20.1,
        amplitude:0.02
    }

}, {
    size:0.06,
    center:{
        x:0.7,
        y:0.2
    },
    colour : {
        type:'SWIRL',
        grains:600,
        array:[{
            r:0.4,
            g:0.29,
            b:0.075
        },{
            r:1.0,
            g:0.321,
            b:0.427
        },{
            r:1.0,
            g:0.418,
            b:0.572
        }]
    },
    density:1

},{
    size:0.07,
    grows:true,
    growthSpeed: 0.0007,
    maxGrowth: 0.1,
    center:{
        x:0.6,
        y:0.4
    },
    colour: {
        type:'GLOW',
        intensity:10.5,
        glow:0.1,
        array:[{
            r:0.1,
            g:0.6,
            b:0.3
        }]
    },
    density:1,
    distortion : {
        type:'SINE',
        frequecy:60.1,
        amplitude:0.05
    }

},{
    size:0.1,
    center:{
        x:0.5,
        y:0.5
    },
    moves:true,
    moment: 'CIRCULAR',
    speed: {
        r:0.03,
        delta:0.12
    },
    colour: {
        type:'SHINE',
        intensity:40.5,
        glow:0.02,
        array:[{
            r:1.0,
            g:0.6,
            b:0.3
        }]
    },
    density:1

}]
let mergeArray = [];
let started = 0;
export default class jsToGlsl {
    
    constructor() {
    }
    starter = () => {
        let codeString = `
       
        void main() {
            float fields[4];
            vec3 fieldColors[4];
            float distance[4];
            float totalDist = 0.0;
            for(int i=0;i<4;i++) {
                fields[i] = 0.0;
                fieldColors[i] = vec3(0.0,0.0,0.0);
                distance[i] = 0.0;
            }
            vec2 st = (gl_FragCoord.xy - 0.*uResolution.xy);
            float res = min(uResolution.x, uResolution.y);
            st = st/res;
            vec3 color = vec3(.0);
        `
        return codeString
    }
    forLoop = (index,scale, amp, m_dist, time_offset,isEvolving) => {
        /*
        TODO: add range conditiions
        TODO: start evolution
        *adjust fuse levels
        *increase population
        NOTE: This also sets the colour
         */
        if(!isEvolving) {
            time_offset = 0;
        }
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
                    offset = 0.5 + 0.5*sin(time*${time_offset}.0 + 36.2831*offset);
        
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
            codeString += `color += 1. - step(0.005, m_dist_${index});`
        } else {
            if(index % 2 == 0) {
                codeString += `color += 1. - (m_dist_${index});`
            } 
            else {
                codeString += `color += 1. - smoothstep(0.005,0.0055, m_dist_${index});`
            }
            
            let colour = ['r','g','b']
            
            let picker = colour[Math.floor(Math.random() * colour.length)];
            codeString += `color.${picker} += ${index}.0/5.0;`
        }
        return codeString
    }
    colour = (blobObj,index) => {
        let {size,distortion,colour} = blobObj;
        let codeString = `vec3 colour_${index} = vec3(0.1,0.2,0.3);`
        let value = colour?.type;
        switch(value) {
            case 'SWIRL' :
                //TODO: Statrt with 3 colours. Add more when understood algo
                //remap uvs
                //TODO: random swirl
                codeString = `
                    vec2 uv = posn_${index} ;
                    for(int i = 0; i < ${colour.grains}; i++)
                        uv *= rotationMatrix(asin(length(uv)));
                    vec3 colour_${index} = uv.y*${colour?.array?.[0]};
                    colour_${index} += uv.x*${colour?.array?.[1]};
                    colour_${index} += (length(uv-st))*0.2*${colour?.array?.[2] || `vec3(1.,1.0,1.0)`};
                `
            break;
            case 'GLOW' :
                codeString = `
                    float glow_${index} = 1.0/length(posn_${index});
                    glow_${index} = pow(glow_${index}/${colour.intensity},${colour.glow});
                    vec3 colour_${index} = glow_${index}*${colour?.array?.[0] || `vec3(1.,1.0,1.0)`};
                `
            break;
            case 'SHINE' :
                codeString = `
                    vec3 colour_${index} = smoothstep(${size}-0.05,${size},(length(posn_${index})))*${colour?.array?.[0] || `vec3(1.,1.0,1.0)`};
                `
            break;
            case 'BASIC' :
                codeString = `
                    vec3 colour_${index} = ${colour?.array?.[0] || `vec3(1.0,1.0,1.0)`}
                `
            break;
            /*case 'SHINE' :
            break;
            case 'GRADIENT' :
            break;*/
        }
        return codeString
    }
    shape = (blobObj,index) => {
        //TODO: Hollow circle
        let {size,distortion,colour} = blobObj;
        let codeString = `float shape_${index} = (1.-step(${size},length(posn_${index})));`;
        let waveDistortion,r;
        let value = distortion?.type;
        switch(value) {
            case 'SINE':
                waveDistortion = `
                    sin(posn_${index}.x*3.14*${distortion.frequecy})*${distortion.amplitude}`
                
                codeString = 
                    `
                        float r_${index} = sizes[${index}]*${waveDistortion};
                        posn_${index} = (posn_${index}) - r_${index};
                        float shape_${index} = (1.-step(sizes[${index}],length(posn_${index})));
                    `
            break;
            case 'FRACT':
                waveDistortion  = `
                    fract(posn_${index}.x)`
                
                codeString += 
                    `
                        float r_${index} = sizes[${index}]*${waveDistortion};
                        posn_${index} = (posn_${index}) - r_${index};
                        float shape_${index} = (1.-step(sizes[${index}],length(posn_${index})));
                    `
            break;
            case 'NOISE':
                codeString = ` float shape_${index} = ((length((posn_${index}))-random2(((posn_${index}))).x*sizes[${index}])*(1.0));`
            break;
        }
        codeString += `
                        distance[${index}] = length((posn_${index}));
                        totalDist += distance[${index}];
                     `
        return `${codeString}`
    }
    blob = (blobObj,index) => {
        /*
            add distortion
        */
        let codeString = `
            //vec2 posn_${index} = (st-${blobObj.center});
            vec2 posn_${index} = (st-vec2(positionsX[${index}],positionsY[${index}]));
            int merge_${index} = mergeUnifrom[${index}];
            ${this.shape(blobObj,index)};
        `
        return codeString
    }
    init = (organisms,world) => {
        let codeString = this.starter()
        let ind = 0;
        
        //calculate fields,distance and colour of the current pixel for each organism
        for(let org in organismsObj) {
           let obj = this.normalizeValues(organismsObj[org],world);
           obj = this.assignValues(obj,world);
           if(obj.density) {
            //codeString += this.forLoop(ind,obj.density,0,1,obj.growthRate || 0,world.evolve)
            obj.ind = ind;
            codeString +=this.blob(obj,ind); 
            codeString +=this.colour(obj,ind); 
            codeString += `
                color += shape_${ind}*colour_${ind};
            `
            codeString += `
                for(int j=0;j<4;j++) {
                    if(j == merge_${ind}) {
                        fields[j] += (20.0*${obj.size})/((length(posn_${ind}))*(length(posn_${ind})));
                        distance[j] += length(posn_${ind});
                    }
                }
            `
           }
           ind++;
        }
        //modify here to add background
        codeString += 
                `
                    ${this.blendColour()}
                    
                    for(int i=0;i<4;i++) {
                        color += (step(1.,vec3(min ( 1.0, max ( fields[i]/255.0, 0.0 ) ))))*fieldColors[i];
                    }
                    //color *= vec3(sin(200.*3.14*st.y));
                    gl_FragColor = vec4(color,1.0);
                    }
                `
       started = 1;
       return codeString
    }
    //move to another file 
    blendColour = ()=> {
        let codeString = ``;
        for(let org in organismsObj) {
            let obj = organismsObj[org];
            let mergeGroup = obj.mergeGroup;
            codeString += `
            for(int j=0;j<4;j++) {
                if(j == merge_${org}) {
                    fieldColors[j] += (mix(colour_${org},colour_${org}*0.01,length(posn_${org}))) * (1.0-(length(posn_${org})/distance[j]));
                }
            }
            
            `
        }
        return codeString;
    }
    updateUniforms = (time) => {
        let size = [];
        let xPos = [];
        let yPos = [];
        let mergeUniform = [];
        for(let org in organismsObj) {
            if(started) {
                //handle growth types
                //oscialltes small and big
                if(organismsObj[org].grows) {
                    organismsObj[org].size += organismsObj[org].growthSpeed;
                    if(organismsObj[org].size > 1 || organismsObj[org].size <0 || organismsObj[org].size > organismsObj[org].maxGrowth) {
                        organismsObj[org].grows = 0;
                    }
                }
                if(organismsObj[org].moves) {
                    if(!organismsObj[org].moment || organismsObj[org].moment == 'LINEAR') {
                        organismsObj[org].center.x += organismsObj[org].speed.x;
                        organismsObj[org].center.y += organismsObj[org].speed.y;
                        if(organismsObj[org].center.y > 1 || organismsObj[org].center.x > 1 || organismsObj[org].center.x < 0 || organismsObj[org].center.y < 0) {
                            organismsObj[org].speed.x *= -1;
                            organismsObj[org].speed.y *= -1;
                        }
                    }
                    if(organismsObj[org].moment == 'CIRCULAR') {
                        //center.y+rsin
                        //center.x+rcos
                        //set center 
                        let r = organismsObj[org].speed.r+organismsObj[org].size;
                        let f = organismsObj[org].speed.delta;
                        if(!organismsObj[org].speed.center) {
                            organismsObj[org].speed.center = {}
                            organismsObj[org].speed.center.x =  organismsObj[org].center.x + r;
                            organismsObj[org].speed.center.y =  organismsObj[org].center.y;
                        }
                        organismsObj[org].center.x = organismsObj[org].speed.center.x + Math.cos(time*Math.PI*f)*r;
                        organismsObj[org].center.y = organismsObj[org].speed.center.y + Math.sin(time*Math.PI*f)*r;;
                    }
                    
                }
                
            }
            //check merge values
            xPos.push(organismsObj[org].center.x);
            yPos.push(organismsObj[org].center.y);
            size.push(organismsObj[org].size);
           
        }
        this.checkMergeValues();
        let emptyIndex = mergeArray.length+1;
        for(let org in organismsObj) {
            let obj = organismsObj[org];
            if(obj.mergeGroup) {
                mergeUniform.push(obj.mergeGroup-1);
                obj.mergeGroup = obj.mergeGroup-1;
            } else {
                mergeUniform.push(emptyIndex-1);
                obj.mergeGroup = emptyIndex-1;
                emptyIndex ++
            }
        }
        //console.log('MERGE UNIFORM',mergeUniform);
        console.log('SIZE',size);
        return {
            xPos:xPos,
            yPos:yPos,
            size:size,
            mergeUniform:mergeUniform
        };
    }
    checkMergeValues = () => {
        let dummyObj = organismsObj;
        mergeArray = [];
        for(let orgs in organismsObj) {
            dummyObj[orgs].visited = false;
            organismsObj[orgs].visited = false;
        }
        for(let orgs in organismsObj) {
            let mergeGroup = [parseInt(orgs)]
            mergeGroup = this.merge(orgs,dummyObj,mergeGroup);
            if(mergeGroup.length > 1) {
                organismsObj[parseInt(orgs)].mergeGroup = mergeArray.length+1;
                mergeArray.push(mergeGroup)
            }
        }
    }
    merge = (index,dummyObj,mergeGroup)=> {
        if(dummyObj[index] && !dummyObj[index].visited) {
            dummyObj[index].visited = true;
            dummyObj[index].mergeGroup = undefined;
            let mergeObj = dummyObj[index].canMergeWith;
            let currentObj = dummyObj[index];
            for(let ind in mergeObj) {
                //check distance b/w ceneter 
                let childObjIndex = parseInt(mergeObj[ind])
                let checkMerge = dummyObj[childObjIndex];
                let xDist = (currentObj.center.x-checkMerge.center.x);
                let yDist = (currentObj.center.y-checkMerge.center.y);
                let dist = Math.sqrt(xDist*xDist + yDist*yDist);
                //if dist b/w cent > (r1+r2)
                if(dist < checkMerge.size+currentObj.size) {
                    mergeGroup.push(childObjIndex);
                    let returnArray = this.merge(mergeObj[ind],dummyObj,[]);
                    organismsObj[childObjIndex].mergeGroup = mergeArray.length+1;
                    mergeGroup = [...mergeGroup,...returnArray]
                }
            }
            //console.log('index',index)
            //console.log('mergeGroup',mergeGroup)
            return mergeGroup;
        } else {
            return []
        }
    }
    //function to convert int to float
    normalizeValues = (org,world) => {
        /*if(org.center) {
            org.center = `vec2(${this.toFloat(org.center.x)},${this.toFloat(org.center.y)})`;
        }*/
        if(org.colour && org.colour.array) {
            org.colour.array.forEach((elm,index) => {
                org.colour.array[index] = `vec3(${this.toFloat(elm.r)},${elm.g},${this.toFloat(elm.b)})`;
            });
            
        }
        return org
    }
    assignValues = (org) => {
        let x = Math.random();
        let y = Math.random();
        if(!org.center) {
            org.center =  `vec2(${this.toFloat(x)},${this.toFloat(y)})`;
        }
        return org;
    }

    /**
     UTILS
     Move to a separate file
     */
    toFloat = (val) => {
        val = val.toString();
        let split = val.split('.');
        return split[1] ? val : split[0]+'.0'
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