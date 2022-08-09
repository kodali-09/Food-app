import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClient: HttpClient) { }
  getImageUrlForFile(files: File[]) {
    let myHeaders = new HttpHeaders();
    myHeaders.append("Content-Type", "multipart/form-data; boundary=--------------------------797419449793881012221386");
    const formdata = new FormData();
    if (this.isListHasValue(files)) {
      files.forEach(file => {
        formdata.append("image", file, file.name);
      });
      const parent = this;
      return new Promise(function (fulfilled, rejected) {
        parent.httpClient.post('/uploadfile/upload-images', formdata, { headers: myHeaders }).subscribe(data => {
          fulfilled(data);
        },
          error => {
            rejected(error);
          });
      });
    }
  }

  private isListHasValue(list) {
    return list !== null && list !== undefined && list.length > 0;
  }
}
