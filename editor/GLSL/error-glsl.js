export default class errorToGlsl {
    
    constructor(error) {
        this.error = error;
    }
    starter = () => {
        let codeString = `
        
        void main() {
            vec2 st = gl_FragCoord.xy/uResolution.xy;
            st.x *= uResolution.x/uResolution.y;
            float x = st.x;
            float y = st.y;
            float t = timex;
        `
        return codeString
    }
    init = () => {
        let codeString = this.starter();
        if(this.error.currentString != '') {
            codeString += `${this.error.currentString}
                            vec3 color = vec3(x,y,0.25);
            `
        } else {
            codeString += `vec3 color = vec3(1.0,1.0,1.0);`
        }
        

        codeString += `
                        gl_FragColor = vec4(color,1.0);
                    }
        `
        return codeString;
    }
}