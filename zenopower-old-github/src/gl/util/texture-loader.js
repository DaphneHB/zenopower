import { Texture } from "ogl";

export async function loadTexture(gl, path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const texture = new Texture(gl, { image: img });
      texture.flipY = false;
      resolve(texture);
    };
  });
}
