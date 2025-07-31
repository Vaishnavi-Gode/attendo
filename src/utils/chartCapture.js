export const captureChartAsImage = (chartRef) => {
  return new Promise((resolve) => {
    if (!chartRef.current) {
      resolve(null);
      return;
    }

    const svg = chartRef.current.querySelector('svg');
    if (!svg) {
      resolve(null);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width || 400;
      canvas.height = img.height || 300;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      URL.revokeObjectURL(url);
      resolve(dataURL);
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
};