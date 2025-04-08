precision highp float;

uniform sampler2D u_mtc;
uniform sampler2D u_mtc2;

uniform sampler2D u_light;
uniform sampler2D u_light2;
uniform sampler2D dirty_mask;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec2 v_uv2;
// varying vec4 v_color;

varying vec3 v_view;

uniform float u_a_illuminate;

const vec3 col_blue = vec3(0.16470588235294117, 0.19607843137254902, 0.25098039215686274);


void main() {

    // * matcap uvs
    vec3 x = normalize( vec3(v_view.z, 0., -v_view.x));
    vec3 y = cross(v_view, x);
    vec2 fakeUv = vec2( dot(x, v_normal), dot(y, v_normal)) * .495 + .5;

    vec3 base_color = mix(col_blue * .2, vec3(0.), step(.5, v_uv2.x));
    // vec3 dirty = texture2D(dirty_mask, v_uv).rgb;
    
    // * matcap
    vec3 mtc1 = texture2D(u_mtc, fakeUv).rgb + base_color;
    vec3 mtc2 = texture2D(u_mtc2, fakeUv).rgb + base_color;
    vec3 mtc = mix(mtc1, mtc2, (u_a_illuminate * .5 + .5));




    // * light
    vec3 light = mix(
        texture2D(u_light, v_uv).rgb,
        texture2D(u_light2, v_uv).rgb,
        u_a_illuminate * .4
    );

    vec3 color = (mtc * light) * 1.5;

    gl_FragColor.rgb = color;
    // gl_FragColor.rgb = dirty;
    // gl_FragColor.rgb = vec3(step(.5, v_uv2.x), 0., 0.);
    gl_FragColor.a = 1.0;
}
