precision mediump float;
uniform sampler2D tex0;
uniform vec2 resolution;
uniform float pixelSize;
varying vec2 vTexCoord;

void main(){
  vec2 grid=vec2(pixelSize)/resolution;
  vec2 base=floor(vTexCoord/grid)*grid + grid*0.5;
  vec2 uv=vec2(base.x,1.0-base.y);
  vec4 c=texture2D(tex0,uv);
  c.a=1.0;
  gl_FragColor=c;
}
