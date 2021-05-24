export interface UploadResp {
  errno: number;
  message?: string;
  data: {
    urls: string[];
  };
}

export interface RespUploadData {
  errno: number;
  message?: string;
  data: {
    urls: string[];
  };
}
