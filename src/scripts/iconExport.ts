// utils/iconExport.ts
export function svgToPng(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = width;
    canvas.height = height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(svgBlob);
  });
}
