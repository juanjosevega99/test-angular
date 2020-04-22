import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Guid } from "guid-typescript";
import * as firebase from 'firebase';
import { finalize } from 'rxjs/operators';
// import { AngularFirestore } from '@angular/fire/storage';}
// import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadImagesService {
  private folderImages = 'assets'

  constructor(private storage: AngularFireStorage) {

  }
  uploadImages(file: any, principalPath, secondpath: any) {
    return new Promise((resolve, reject) => {
      const idImage: Guid = Guid.create();
      const filePath = `assets/${principalPath}/${secondpath}/${idImage}`
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file)
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(urlImageLogo => {
              resolve(urlImageLogo)
            })
          })
        ).subscribe();
    })
  }


  // the filepath is as let urlImg = 'assets/allies/banners/' + this.editBanner.imageBanner.split("%")[3].split("?")[0].slice(2);
  DeleteImage(filePath) {

    return new Promise((resolve, reject) => {
      const ref = this.storage.ref(filePath).delete().subscribe(res => {
        resolve(res);
      })
    })
  }

}
