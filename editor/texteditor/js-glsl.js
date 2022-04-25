
let mergeArray = [];
let started = 0;
export default class jsToGlsl {
    
    constructor(args) {
        console.log('ARGS',args)
        this.orgs = args.organisms
    }
    starter = () => {
        let codeString = `
        
        void main() {
            float fields[100];
            vec3 fieldColors[100];
            float distance[100];
            float totalDist = 0.0;
            for(int i=0;i<100;i++) {
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
    colour = (blobObj,index) => {
        let {size,colour} = blobObj;
        let codeString = `vec3 colour_${index} = vec3(0.1,0.2,0.3);`
        let value = colour?.colortype;
        let array = colour?.colorarray;
        switch(value) {
            case 'SWIRL' :
                //TODO: Statrt with 3 colours. Add more when understood algo
                //remap uvs
                //TODO: random swirl
                codeString = `
                    vec2 uv = posn_${index} ;
                    for(int i = 0; i < ${colour.grains}; i++)
                        uv *= rotationMatrix(asin(length(uv)));
                    vec3 colour_${index} = uv.y*vec3(${array[0]?.r || 1.0},${array[0]?.g || 1.0},${array[0]?.b || 1.0});
                    colour_${index} += uv.x*vec3(${array[1]?.r || 1.0},${array[1]?.g || 1.0},${array[1]?.b || 1.0});
                    colour_${index} += (length(uv-st))*0.2*vec3(${array[2]?.r || 1.0},${array[2]?.g || 1.0},${array[2]?.b || 1.0});
                `
            break;
            case 'GLOW' :
                codeString = `
                    float glow_${index} = 1.0/length(posn_${index});
                    glow_${index} = pow(glow_${index}/${colour.intensity},${colour.glow});
                    vec3 colour_${index} = glow_${index}*vec3(${array[0]?.r || 1.0},${array[0]?.g || 1.0},${array[0]?.b || 1.0});
                `
            break;
            case 'SHINE' :
                codeString = `
                    vec3 colour_${index} = smoothstep(${size.sizevalue}-0.05,${size.sizevalue},(length(posn_${index})))*vec3(${array[0]?.r || 1.0},${array[0]?.g || 1.0},${array[0]?.b || 1.0});
                `
            break;
            case 'BASIC' :
                codeString = `
                    vec3 colour_${index} = vec3(${array[0]?.r || 1.0},${array[0]?.g || 1.0},${array[0]?.b || 1.0});
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
        let {size,distortion} = blobObj;
        let codeString = `float shape_${index} = (1.-step(${size.sizevalue},length(posn_${index})));`;
        let waveDistortion;
        let value = distortion?.distortiontype;
        switch(value) {
            case 'SINE':
                waveDistortion = `
                    sin(posn_${index}.x*3.14*${distortion.frequency})*${distortion.amplitude}`
                
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
        for(let org in this.orgs) {
            if(this.orgs[org].type == "UNI") {
                let obj = this.normalizeValues(this.orgs[org],world);
                obj.ind = ind;
                codeString +=this.blob(obj,ind); 
                codeString +=this.colour(obj,ind); 
                codeString += `
                    color += shape_${ind}*colour_${ind};
                `
                codeString += `
                    for(int j=0;j<100;j++) {
                        if(j == merge_${ind}) {
                            fields[j] += (20.0*${obj.size.sizevalue})/((length(posn_${ind}))*(length(posn_${ind})));
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
                    
                    for(int i=0;i<100;i++) {
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
        let ind = 0
        for(let org in this.orgs) {
            codeString += `
            for(int j=0;j<100;j++) {
                if(j == merge_${ind}) {
                `
                if(mergeArray[this.orgs[org].mergeGroup]?.length > 1) {
                    codeString += `fieldColors[j] += (mix(colour_${ind},colour_${ind}*0.01,length(posn_${ind}))) * (1.0-(length(posn_${ind})/distance[j]));`
                } else {
                    codeString += `fieldColors[j] += colour_${ind};`
                }
                    
                codeString +=  `
                            }
                        }`;
            
            
            ind++;
        }
        return codeString;
    }
    updateUniforms = (time) => {
        let sizeArr = [];
        let xPos = [];
        let yPos = [];
        let mergeUniform = [];
        for(let org in this.orgs) {
            let {size,movement,center} = this.orgs[org];
            if(started) {
                //handle growth types
                //oscialltes small and 
                if(size.grains) {
                    size.sizevalue += size.growthSpeed;
                    if(size.sizevalue > 1 || size.sizevalue <0 || size.sizevalue > size.maxGrowth) {
                        size.grows = false;
                    }
                }
                if(movement.moves) {
                    if(movement.movementtype == 'LINEAR') {
                        center.centerx += movement.speed.xspeed;
                        center.centery += movement.speed.yspeed;
                        if(center.centery > 1 || center.centerx > 1 || center.centerx < 0 || center.centery < 0) {
                            movement.speed.xspeed *= -1;
                            movement.speed.yspeed *= -1;
                        }
                    }
                    if(movement.movementtype == 'CIRCULAR') {
                        let r = movement.speed.r+size.sizevalue;
                        let f = movement.speed.delta;
                        if(!movement.speed.center) {
                            movement.speed.center = {}
                            movement.speed.center.x =  movement.center.x + r;
                            movement.speed.center.y =  movement.center.y;
                        }
                        center.centerx = movement.speed.center.x + Math.cos(time*Math.PI*f)*r;
                        center.centery = movement.speed.center.y + Math.sin(time*Math.PI*f)*r;;
                    }
                    
                }
                
            }
            //check merge values
            xPos.push(center.centerx);
            yPos.push(center.centery);
            sizeArr.push(size.sizevalue);
           
        }
        this.checkMergeValues();
        let emptyIndex = mergeArray.length+1;
        for(let org in this.orgs) {
            let obj = this.orgs[org];
            
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
        //console.log('SIZE',size);
        return {
            xPos:xPos,
            yPos:yPos,
            size:sizeArr,
            mergeUniform:mergeUniform,
            count:Object.keys(this.orgs).length
        };
    }
    checkMergeValues = () => {
        let dummyObj = this.orgs;
        mergeArray = [];
        for(let orgs in this.orgs) {
            dummyObj[orgs].visited = false;
            this.orgs[orgs].visited = false;
        }
        for(let orgs in this.orgs) {
            let mergeGroup = [parseInt(orgs)]
            mergeGroup = this.merge(orgs,dummyObj,mergeGroup);
            if(mergeGroup.length > 1) {
                this.orgs[orgs].mergeGroup = mergeArray.length+1;
                mergeArray.push(mergeGroup)
            }
        }
    }
    merge = (index,dummyObj,mergeGroup)=> {
        if(dummyObj[index] && !dummyObj[index].visited) {
            dummyObj[index].visited = true;
            dummyObj[index].mergeGroup = undefined;
            let mergeObj = dummyObj[index]?.merge?.mergeorgs;
            let currentObj = dummyObj[index];
            for(let ind in mergeObj) {
                //check distance b/w ceneter 
                if(ind != index) {
                    let childObjIndex = mergeObj[ind]
                    let checkMerge = dummyObj[childObjIndex];
                    let xDist = (currentObj.center.centerx-checkMerge.center.centerx);
                    let yDist = (currentObj.center.centery-checkMerge.center.centery);
                    let dist = Math.sqrt(xDist*xDist + yDist*yDist);
                    //if dist b/w cent > (r1+r2)
                    if(dist < checkMerge.size.sizevalue+currentObj.size.sizevalue) {
                        mergeGroup.push(childObjIndex);
                        let returnArray = this.merge(mergeObj[ind],dummyObj,[]);
                        this.orgs[childObjIndex].mergeGroup = mergeArray.length+1;
                        mergeGroup = [...mergeGroup,...returnArray]
                    }
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
        if(org.colour && org.colour.colorarray) {
            let arr = org.colour.colorarray
            arr.forEach((elm,index) => {
               arr[index].r = this.toFloat(elm.r);
               arr[index].g = this.toFloat(elm.g);
               arr[index].b = this.toFloat(elm.b);
            });
            
        }
        return org
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