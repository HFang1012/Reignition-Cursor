function pixelateCallback() {
  const pixelCountX = uniformFloat(() => slider.value());
  getColor((inputs, canvasContent) => {
    const aspectRatio = inputs.canvasSize.x / inputs.canvasSize.y;
    const blocks = [pixelCountX, pixelCountX / aspectRatio];
    const base = floor(inputs.texCoord * blocks) / blocks + 0.5 / blocks;
    const col = getTexture(canvasContent, base);
    col[3] = 1.0;
    return col;
  });
}
