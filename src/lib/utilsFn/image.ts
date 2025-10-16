export const changeImageExtension = (fileName: string, newExtension: string): string => {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) {
    return `${fileName}.${newExtension}`;
  }
  return `${fileName.substring(0, lastDot)}.${newExtension}`;
};

export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const res = await fetch(dataUrl);
    return await res.blob();
};