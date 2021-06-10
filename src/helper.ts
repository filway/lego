import { message } from 'ant-design-vue';
import axios from 'axios';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import { RespUploadData } from './store/respTypes';

interface CheckCondition {
  format?: string[];
  // 使用多少 M 为单位
  size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = 'format';
  }
  if (!isValidSize) {
    error = 'size';
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  };
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 });
  const { passed, error } = result;
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!');
  }
  if (error === 'size') {
    message.error('上传图片大小不能超过 1Mb');
  }
  return passed;
};

export const getImageDimensions = (url: string | File) => new Promise<{
  width: number;
  height: number;
}>((resolve, reject) => {
  const img = new Image();
  img.src = (typeof url === 'string') ? url : URL.createObjectURL(url);
  img.addEventListener('load', () => {
    const { naturalWidth: width, naturalHeight: height } = img;
    resolve({ width, height });
  });
  img.addEventListener('error', () => {
    reject(new Error('There was some problem with the image.'));
  });
});

export const getParentElement = (element: HTMLElement, className: string) => {
  let tmpEle = element;
  while (tmpEle) {
    if (tmpEle.classList && tmpEle.classList.contains(className)) {
      return tmpEle;
    }
    tmpEle = tmpEle.parentNode as HTMLElement;
  }
  return null;
};

export const insertAt = (arr: any[], index: number, newItem: any) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index),
];
export async function uploadFile<R = any>(file: Blob, url = '/utils/upload-img', fileName = 'screenshot.png') {
  const newFile = file instanceof File ? file : new File([file], fileName);
  const formData = new FormData();
  formData.append(newFile.name, newFile);
  const { data } = await axios.post<R>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}
function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}
export async function takeScreenshotAndUpload(ele: HTMLElement) {
  // get screenshot canvas
  const canvas = await html2canvas(ele, { width: 375, useCORS: true, scale: 1 });
  // transform canvas to blob
  const canvasBlob = await getCanvasBlob(canvas);
  if (canvasBlob) {
    // upload blob to server
    const data = await uploadFile<RespUploadData>(canvasBlob);
    return data;
  }
}

export function generateQRCode(id: string, url: string, width = 100) {
  const ele = document.getElementById(id) as HTMLCanvasElement;
  console.log(ele);
  return QRCode.toCanvas(ele, url, { width });
}

export function copyToClipboard(text: string) {
  // 创建文本元素，赋值
  const textarea = document.createElement('textarea');
  textarea.value = text;
  // 添加样式，隐藏
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  // 添加到body 选中文本
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand('copy');
  } catch (e) {
    console.warn('copy failed', e);
  } finally {
    document.body.removeChild(textarea);
  }
}

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const objToQueryString = (queryObj: { [key: string]: any }) => Object.keys(queryObj).map((key) => `${key}=${queryObj[key]}`).join('&');

export const downloadFile = (src: string, fileName = 'default.png') => {
  // 创建链接
  const link = document.createElement('a');
  link.download = fileName;
  link.rel = 'noopener';
  if (link.origin !== window.location.origin) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
    axios.get(src, { responseType: 'blob' }).then((data) => {
      link.href = URL.createObjectURL(data.data);
      setTimeout(() => { link.dispatchEvent(new MouseEvent('click')); });
      // https://developer.mozilla.org/zh-CN/docs/Web/API/URL/revokeObjectURL
      setTimeout(() => { URL.revokeObjectURL(link.href); }, 10000);
    }).catch((e) => {
      console.error(e);
      link.target = '_blank';
      link.href = src;
      link.dispatchEvent(new MouseEvent('click'));
    });
  } else {
  // 设置链接属性
    link.href = src;
    // 触发事件
    link.dispatchEvent(new MouseEvent('click'));
  }
};

export const downloadImage = (url: string) => {
  const fileName = url.substring(url.lastIndexOf('/') + 1);
  saveAs(url, fileName);
};
