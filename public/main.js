import "./gl-matrix.js";
import {} from "./gl-matrix.js";
const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");
const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
try {
  console.log("working");
} catch (error) {
  console.error(error);
}

const FOV = 150;
//prettier-ignore THIS IS THE CUBE
// const vertexData = [
//   -1.0,
//   -1.0,
//   -1.0, // triangle 1 : begin
//   -1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   1.0,
//   1.0, // triangle 1 : end
//   1.0,
//   1.0,
//   -1.0, // triangle 2 : begin
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   -1.0, // triangle 2 : end
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   -1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
//   1.0,
//   1.0,
//   -1.0,
//   1.0,
// ];

function createSpherePointCloud(numberOfPoints) {
  let points = [];
  for (let i = 0; i < numberOfPoints; i++) {
    const r = () => Math.random() * 2 - 1;
    const inputPoint = [r(), r(), r()];
    const outputPoint = vec3.normalize(vec3.create(), inputPoint);

    points.push(...outputPoint);
  }
  return points;
}

const vertexData = createSpherePointCloud(1e5);
const colorData = createPointColorData(vertexData);

function createPointColorData(pointCloudArray) {
  const colorData = [];
  for (let point = 0; point < pointCloudArray.length; point++) {
    colorData.push(0.5);
    colorData.push(0.5);
    colorData.push(0.5);
    colorData.push(point / pointCloudArray.length);
  }
  return colorData;
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
  attribute vec4 color;
  varying vec4 vColor;

  uniform mat4 matrix;

  void main(void) {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
    gl_PointSize = 2.0;
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
  varying vec4 vColor;

  void main(void) {
    gl_FragColor = vec4(vColor);
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

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(
  projectionMatrix,
  (FOV * Math.PI) / 180,
  canvas.width / canvas.height,
  1e-4, //near cull plane
  1e4
);

mat4.translate(modelMatrix, modelMatrix, [0, 0, -2]);
mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);

mat4.translate(viewMatrix, viewMatrix, [-0.5, 0, 1]);
// any transformations done to the viewmatrix (camera) are inverted and turned into modelmatrix transformations
mat4.invert(viewMatrix, viewMatrix);

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();

const uniformLocations = {
  matrix: gl.getUniformLocation(program, `matrix`),
};

//strongly typed method

function animate() {
  requestAnimationFrame(animate);

  mat4.rotateZ(modelMatrix, modelMatrix, 1 / 800);
  mat4.rotateY(modelMatrix, modelMatrix, 1 / 250);
  mat4.rotateX(modelMatrix, modelMatrix, -1 / 150);
  mat4.scale(modelMatrix, modelMatrix, [1.01, 1.01, 1.01]);

  // apply camera transformations
  mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
  // apply projection transform
  mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
  // final to render frame
  gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
  console.log("draw");
  gl.drawArrays(gl.POINTS, 0, vertexData.length / 3); //mode, starting vertex 0index, how many vertices,
}

animate();

// draw
