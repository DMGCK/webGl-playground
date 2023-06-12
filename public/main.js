const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

try {
  console.log("working");
} catch (error) {
  console.error(error);
}

// vertex data
const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0]; // xyz coordinates (x,x,x)

// color data
const colorData = [1, 0, 0, 0, 1, 0, 0, 0, 1]; //rgb values (x,x,x)

// create buffer
console.log("positionBuffer");
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// load data into buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

console.log("colorBuffer");
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// load data into buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

console.log("loadBuffer");

// create vertex shader
console.log("createVShader");
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader, //define attributes per vertex, must be on vertShader
  `
  precision mediump float;

  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;

  void main(void) {
    vColor = color;
    gl_Position = vec4(position, 1);
  }
  `
);
gl.compileShader(vertexShader);
console.log(gl.getShaderInfoLog(vertexShader));

// create fragment shader
console.log("createFragShader");

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float;
  varying vec3 vColor;

  void main(void) {
    gl_FragColor = vec4(vColor, 1);
}
`
);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

// create program
console.log("createProgram");
const program = gl.createProgram();

// attach shaders to program

console.log("attachShaders");
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// enable vertex attributes
console.log("enableVertAttributes");

const positionLocation = gl.getAttribLocation(program, `position`);
// matches name of attribute defined in shaders exactly
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0); //attribute, number of elements, type.

const colorLocation = gl.getAttribLocation(program, `color`);
// matches name of attribute defined in shaders exactly
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0); //attribute, number of elements, type.

console.log("useProgram");
gl.useProgram(program);

console.log("drawTriangles");
gl.drawArrays(gl.TRIANGLES, 0, 3); //mode, starting vertex 0index, how many vertices,

// draw
