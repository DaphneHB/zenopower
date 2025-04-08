#define MPI 3.1415926538
#define MTAU 6.28318530718

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
attribute vec4 color;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float u_time;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec2 v_uv2;

varying vec3 v_view;
// varying vec4 v_color;





void main() {
  vec3 pos = position;

  vec4 transformed = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * transformed;

  v_view = normalize(- transformed.xyz);

  // v_normal = normal;
  v_normal = normalize(normalMatrix * normal);
  v_uv = uv;
  v_uv2 = uv2;
}
