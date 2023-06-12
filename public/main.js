import "./gl-matrix.js";
const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");
try {
  console.log("working");
} catch (error) {
  console.error(error);
}

// vertex data
// const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0]; // xyz coordinates (x,x,x)
//prettier-ignore
const vertexData = [
    -1.0,-1.0,-1.0, // triangle 1 : begin
    -1.0,-1.0, 1.0,
    -1.0, 1.0, 1.0, // triangle 1 : end
    1.0, 1.0,-1.0, // triangle 2 : begin
    -1.0,-1.0,-1.0,
    -1.0, 1.0,-1.0, // triangle 2 : end
    1.0,-1.0, 1.0,
    -1.0,-1.0,-1.0,
    1.0,-1.0,-1.0,
    1.0, 1.0,-1.0,
    1.0,-1.0,-1.0,
    -1.0,-1.0,-1.0,
    -1.0,-1.0,-1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0,-1.0,
    1.0,-1.0, 1.0,
    -1.0,-1.0, 1.0,
    -1.0,-1.0,-1.0,
    -1.0, 1.0, 1.0,
    -1.0,-1.0, 1.0,
    1.0,-1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0,-1.0,-1.0,
    1.0, 1.0,-1.0,
    1.0,-1.0,-1.0,
    1.0, 1.0, 1.0,
    1.0,-1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0,-1.0,
    -1.0, 1.0,-1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0,-1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0,-1.0, 1.0
]

// color data
// const colorData = [1, 0, 0, 0, 1, 0, 0, 0, 1]; //rgb values (x,x,x)

const colorData = [];

for (let vertex = 0; vertex < vertexData.length; vertex++) {
  colorData.push(Math.random());
}

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

  uniform mat4 matrix;

  void main(void) {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
  }
  `
  // order of matrix multiplication matters!
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

gl.enable(gl.DEPTH_TEST);

// Uniform addition location in code

const matrix = glMatrix.mat4.create();
const projectionMatrix = mat4.create();
glMatrix;

// glMatrix.mat4.translate(matrix, matrix, [0.2, 0.5, 0.25]);
glMatrix.mat4.scale(matrix, matrix, [0.2, 0.2, 0.2]);

const uniformLocations = {
  matrix: gl.getUniformLocation(program, `matrix`),
};

//strongly typed method

function animate() {
  requestAnimationFrame(animate);

  glMatrix.mat4.rotateZ(matrix, matrix, 1 / 800);
  glMatrix.mat4.rotateY(matrix, matrix, 1 / 250);
  glMatrix.mat4.rotateX(matrix, matrix, -1 / 150);
  gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
  console.log("drawTriangles");
  gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3); //mode, starting vertex 0index, how many vertices,
}

animate();

// draw
