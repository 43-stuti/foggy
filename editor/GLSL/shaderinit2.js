
const canvas = document.querySelector("#glCanvas");
const gl = canvas.getContext("webgl");
if(gl === null) { alert("no webgl"); }

let CAPTURE = false;
let IMAGE_URL = null;
const fragBase = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform float timex;
  uniform int count;
  #define NUM_OCTAVES 5
  #define index 1
  float rand(float n){return fract(sin(n) * 43758.5453123);}
  float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
  float noise(float p){
	  float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
  }
  float noise2(vec2 p){
  	vec2 ip = floor(p);
  	vec2 u = fract(p);
  	u = u*u*(3.0-2.0*u);
  	float res = mix(
  		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
  		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  	return res*res;
  }
  float noise3(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  float fbm(float x) {
  	float v = 0.0;
  	float a = 0.5;
  	float shift = float(100);
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise(x);
  		x = x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  float fbm(vec2 x) {
  	float v = 0.0;
  	float a = 0.5;
  	vec2 shift = vec2(100);
  	// Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise2(x);
  		x = rot * x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  float fbm(vec3 x) {
  	float v = 0.0;
  	float a = 0.5;
  	vec3 shift = vec3(100);
  	for (int i = 0; i < NUM_OCTAVES; ++i) {
  		v += a * noise3(x);
  		x = x * 2.0 + shift;
  		a *= 0.5;
  	}
  	return v;
  }
  vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }
  float random (in float x) {
    return fract(sin(x)*1e4);
  }
  mat2 rotate2d(float theta)
  {
      return mat2(
          cos(theta),-sin(theta),
          sin(theta),cos(theta)
      );
  }
  float smin( float a, float b, float k )
{
    a = pow( a, k ); b = pow( b, k );
    return pow( (a*b)/(a+b), 1.0/k );
}
  `;

const shaders = {
  vert : `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
  `,
  frag: `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float timex;
  float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    vec3 color = vec3(0.0);
    st.y *= sin(timex*0.09);
    color += fbm(st*3.0);

    gl_FragColor = vec4(color,1.0);
}
  `
};
const fragLocations = {
  timeLoc: null,
  resLoc: null,
  colorPos: null,
  x:null,
  y:null,
  size:null,
  merge:null,
  count:null
}
let colorStat = 0.6;
export default class shaderinit {
  constructor(args) {
    this.toglsl = args
    this.program = this.createProgram();
}
  init = () => {
    const vertexArray = new Float32Array([
        -1., 1., 1., 1., 1., -1.,
        -1., 1., 1., -1., -1., -1.
    ]);
    const vertexNumComponents = 2;
    const vertexCount = vertexArray.length/vertexNumComponents;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    gl.useProgram(this.program);

    const aVertexPosition = gl.getAttribLocation(this.program, "aVertexPosition");
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0);

    this.bindLocations(gl, this.program, fragLocations);

    let animate = (t) => {
      console.log(canvas.clientWidth,canvas.width)
      if(canvas.clientWidth !== canvas.width) canvas.width = canvas.clientWidth;
      if(canvas.clientHeight !== canvas.height) canvas.height = canvas.clientHeight;
      gl.viewport(0,0,canvas.width, canvas.height);
      gl.uniform2fv(fragLocations.resLoc, [canvas.width, canvas.height]);
      gl.uniform1f(fragLocations.timeLoc, t/1000);
      gl.clearColor(1., 1., 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
      if (window.captureFrame) {
        window.captureFrame = false;
        var data = canvas.toDataURL();
        let link = document.getElementById("link");
        link.download = 'i_erred' + '.png';
      //get canvas as data URL
      	link.href = data;
      }
      window.requestAnimationFrame(animate);
    }
    animate(0);
  }

  createProgram = () => {
    const vs = this.createShader(gl.VERTEX_SHADER, shaders.vert);
    const fs = this.createShader(gl.FRAGMENT_SHADER, shaders.frag);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success) return program;
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  createShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) return shader;
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  bindLocations = () => {
    fragLocations.timeLoc = gl.getUniformLocation(this.program, "timex");
    fragLocations.resLoc = gl.getUniformLocation(this.program, "uResolution");
  }

  updateShader = (newShader) => {
    let f = fragBase + newShader;
    console.log(f);
    let vs = this.createShader(gl.VERTEX_SHADER, shaders.vert);
    let fs = this.createShader(gl.FRAGMENT_SHADER, f);
    let sh =  gl.getAttachedShaders(this.program);
    sh.map( s => gl.detachShader(this.program, s) );
    sh.map( s => gl.deleteShader(s) );
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    this.bindLocations();

  }

  captureImage = () => {
    CAPTURE = true;
    let p = new Promise( (resolveFn, rejectFn) => {
      setTimeout(()=>{
        resolveFn(IMAGE_URL);
      },100);
    })
    return p;
  }
}