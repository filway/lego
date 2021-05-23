export interface UploadResp {
  errno: number;
  message?: string;
  data: {
    urls: string[];
  };
}
