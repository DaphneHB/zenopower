#define MPI 3.1415926538
#define MTAU 6.28318530718

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 a_posmod;
attribute float a_random;
attribute vec4 a_id;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float u_time;

varying vec3 v_normal;
varying vec2 v_uv;
varying float v_random;
// varying vec4 v_id;

#include '../glsl/simplex.glsl'

void main() {
  vec3 pos = position;
  float ns = simplex3d(vec3(pos.x + u_time, pos.y, pos.z));
  pos *= vec3(.1);

  float time_mult = u_time * (a_random * 2. + 1.) * .02;
  vec3 posmod = a_posmod;
  float multi = 1.;
  float multi_time = 2.;

  posmod.x += sin(time_mult * multi_time + v_random + posmod.x * .7) * multi;
  posmod.y += sin(time_mult * multi_time + v_random + posmod.y * .2) * multi;
  posmod.z += sin(time_mult * multi_time + v_random + posmod.z * .5) * multi;
  
  pos += posmod;
  pos *= 4.;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  v_normal = normalize(normalMatrix * normal);
  v_uv = uv;
  v_random = a_random;

}
