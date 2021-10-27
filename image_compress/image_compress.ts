// 画像圧縮用
const jpegIq: Array<number> = [70, 40, 10];
const fileSizeThreshold: number = 3.3 * 1024 * 1024;
const maxImgPxThreshold: number = 3840;

/**
 * 画像サイズのチェック
 */
async function checkedImageData(
  event: Event,
  base64?: string
): Promise<string> {
  const file = base64
    ? new window.File([this.dataURLtoBlob(base64)], "IMG_BPA02X32.jpg", {
        type: this.dataURLtoBlob(base64).type,
      })
    : (<HTMLInputElement>event.target).files[0];

  // 3.3MBチェック
  if (this.fileSizeThreshold < file.size) {
    const progressEvent = await this.loadReader(file);
    let imageData: any = progressEvent.target.result;
    const image = await this.loadImage(imageData);
    const compressedImage = this.compressedImage(image);
    // 圧縮チェック後の画像データ
    return compressedImage;
  } else {
    //　サイズが　3.3MBに収まる場合はそのまま返す
    return base64;
  }
}

/**
 * 圧縮比の取得
 */
function getCompressionRatio(
  width: number,
  height: number
): { width: number; height: number } {
  if (width > this.maxImgPxThreshold || height > this.maxImgPxThreshold) {
    let ratio;
    if (width > height) {
      ratio = width / this.maxImgPxThreshold;
    } else {
      ratio = height / this.maxImgPxThreshold;
    }
    width = Math.floor(width / ratio);
    height = Math.floor(height / ratio);
  }
  return { width: width, height: height };
}
/**
 * 画像圧縮する
 */
function compressedImage(image: HTMLImageElement): string {
  const compressionRatio = this.getCompressionRatio(
    image.naturalWidth,
    image.naturalHeight
  );
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = compressionRatio.width;
  canvas.height = compressionRatio.height;
  ctx.drawImage(image, 0, 0, compressionRatio.width, compressionRatio.height);

  let displaySrc;
  let fileSizeAfter: number = 0;
  for (let j = 0; j < this.jpegIq.length; j++) {
    displaySrc = ctx.canvas.toDataURL("image/jpeg", this.jpegIq[j] / 100);
    fileSizeAfter = this.dataURLtoBlob(displaySrc).size;
    if (fileSizeAfter <= this.fileSizeThreshold) {
      break;
    }
  }
  return displaySrc;
}

/**
 *　FileReaderを同期的に扱う
 */
async function loadReader(file: File): Promise<ProgressEvent<FileReader>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => resolve(event);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 *　Imageを同期的に扱う
 */
async function loadImage(imageData: any): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = imageData;
  });
}
