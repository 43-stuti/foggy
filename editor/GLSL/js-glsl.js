
let mergeArray = [];
let started = 0;
export default class jsToGlsl {
    
    constructor(args) {
        this.orgs = args.organisms
        this.collection = args
    }
    starter = () => {
        let codeString = `
        
        void main() {
            float fields[11];
            vec3 fieldColors[11];
            float distance[11];
            float totalDist = 0.0;
            for(int i=0;i<11;i++) {
                fields[i] = 0.0;
                fieldColors[i] = vec3(0.0,0.0,0.0);
                distance[i] = 0.0;
            }
            vec2 st = gl_FragCoord.xy/uResolution.xy;
            st.x *= uResolution.x/uResolution.y;
            vec3 color = vec3(.0);
        `
        return codeString
    }
    colour = (blobObj,index) => {
        let {size,colour} = blobObj;
        let codeString = `vec3 colour_${index} = vec3(0.1,0.2,0.3);`
        let value = colour?.colortype;
        switch(value) {
            case 'SWIRL' :
                //TODO: Statrt with 3 colours. Add more when understood algo
                //remap uvs
                //TODO: random swirl
                codeString = `
                    vec2 uv_${index} = posn_${index} ;
                    for(int i = 0; i < ${colour.grains}; i++)
                    uv_${index} *= rotationMatrix(asin(length(uv_${index})));
                    vec3 colour_${index} = uv_${index}.y*vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0});
                    colour_${index} += uv_${index}.x*vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0})*0.5;
                    colour_${index} += (length(uv_${index}-st))*vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0})*1.5;
                `
            break;
            case 'GLOW' :
                codeString = `
                    float glow_${index} = 1.0/length(posn_${index});
                    glow_${index} = pow(glow_${index}/${colour.intensity},${colour.glow});
                    vec3 colour_${index} = glow_${index}*vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0});
                `
            break;
            case 'SHINE' :
                codeString = `
                    vec3 colour_${index} = smoothstep(${size.sizevalue}-0.05,${size.sizevalue},(length(posn_${index})))*vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0});
                `
            break;
            case 'BASIC' :
                codeString = `
                    vec3 colour_${index} = vec3(${colour?.r || 1.0},${colour?.g || 1.0},${colour?.b || 1.0});
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
            if(this.orgs[org].type == "multi") {
                continue;
            }
            let obj = this.normalizeValues(this.orgs[org],world);
            obj.ind = ind;
            codeString +=this.blob(obj,ind); 
            codeString +=this.colour(obj,ind); 
            codeString += `
                color += shape_${ind}*colour_${ind};
            `
            codeString += `
                for(int j=0;j<11;j++) {
                    if(j == merge_${ind}) {
                        fields[j] += (20.0*${obj.size.sizevalue})/((length(posn_${ind}))*(length(posn_${ind})));
                        distance[j] += length(posn_${ind});
                    }
                }
            `
            ind++;
        }
        //modify here to add background
        let err = this.collection.error
        if(err.type == 1) {
            codeString += `color = random2( st ).x*vec3(${err.r},${err.g},${err.b});`
        }
        if(err.type == 2) {
            codeString += `color = random( st.x*st.y )*vec3(${err.r},${err.g},${err.b});`
        }
        if(err.type == 3) {
            codeString += `color = noise( st )*vec3(${err.r},${err.g},${err.b});`
        }
        codeString += 
                `
                    ${this.blendColour()}
                    
                    for(int i=0;i<11;i++) {
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
            if(this.orgs[org].type == "multi") {
                continue;
            }
            codeString += `
            for(int j=0;j<11;j++) {
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
            if(this.orgs[org].type == "multi") {
                continue;
            }
            let {size,movement,center} = this.orgs[org];
            if(started) {
                //handle growth types
                //oscialltes small and 
                if(this.orgs[org].inDestruction) {
                    size.sizevalue -= 0.0004;
                    if(size.sizevalue <= 0) {
                        this.collection.destroy(org);
                    }
                } else {
                    if(size.grows) {
                        size.sizevalue += size.growthSpeed*Math.sin(time*Math.PI);
                        if(size.sizevalue >= 1 || size.sizevalue <=0 || size.sizevalue > size.maxGrowth) {
                            size.growthSpeed *= -1;
                        }
                    }
                    if(movement.moves) {
                        if(movement.movementtype == 'LINEAR') {
                            center.centerx += movement.speed.speedval*Math.cos(movement.speed.angle*Math.PI/180);
                            center.centery += movement.speed.speedval*Math.sin(movement.speed.angle*Math.PI/180);
                            //console.log('CC',center)
                            if(center.centery > 1 || center.centerx > 1.3 || center.centerx < 0 || center.centery < 0) {
                                movement.speed.speedval *= -1;
                            }
                        }
                        if(movement.movementtype == 'CIRCULAR') {
                            let r = movement.speed.rad+size.sizevalue;
                            let f = movement.speed.delta;
                            if(!movement.speed.center) {
                                movement.speed.center = {}
                                movement.speed.center.x =  center.centerx + r;
                                movement.speed.center.y =  center.centery;
                            }
                            //console.log('MOVE SP',movement.speed)
                            center.centerx = movement.speed.center.x + Math.cos(time*Math.PI*f)*r;
                            center.centery = movement.speed.center.y + Math.sin(time*Math.PI*f)*r;
                            //console.log('CIRC CENT',center,r,f)
                        }
                        
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
            if(this.orgs[org].type == "multi") {
                continue;
            }
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
            let mergeGroup = [orgs]
            mergeGroup = this.merge(orgs,dummyObj,mergeGroup);
            if(mergeGroup.length > 1) {
                this.orgs[orgs].mergeGroup = mergeArray.length+1;
                mergeArray.push(mergeGroup)
            }
        }
        //console.log('MERGE VAL',mergeArray)
    }
    merge = (index,dummyObj,mergeGroup)=> {
        if(dummyObj[index] && !dummyObj[index].visited) {
            dummyObj[index].visited = true;
            dummyObj[index].mergeGroup = undefined;
            let mergeObj = dummyObj[index]?.merge?.mergeorgs;
            let currentObj = dummyObj[index];
            for(let ind in mergeObj) {
                //check distance b/w ceneter 
                if(mergeObj[ind] != index) {
                    let childObjIndex = mergeObj[ind]
                    let checkMerge = dummyObj[childObjIndex];
                    if(checkMerge) {
                        let xDist = (currentObj.center.centerx-checkMerge.center.centerx);
                        let yDist = (currentObj.center.centery-checkMerge.center.centery);
                        let dist = Math.sqrt(xDist*xDist + yDist*yDist);
                        let r =  parseFloat(checkMerge.size.sizevalue)+parseFloat(currentObj.size.sizevalue)
                        //if dist b/w cent > (r1+r2)
                        if(dist < r || Math.abs(dist-r) < 0.04) {
                            mergeGroup.push(childObjIndex);
                            let returnArray = this.merge(mergeObj[ind],dummyObj,[]);
                            this.orgs[childObjIndex].mergeGroup = mergeArray.length+1;
                            mergeGroup = [...mergeGroup,...returnArray]
                        }
                    } else {
                        mergeObj.splice(ind)
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
        if(org.distortion) {
            org.distortion.amplitude = this.toFloat(org.distortion.amplitude);
            org.distortion.frequency = this.toFloat(org.distortion.frequency);
            
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