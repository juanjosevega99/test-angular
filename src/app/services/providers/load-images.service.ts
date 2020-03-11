import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
// import { AngularFirestore } from '@angular/fire/storage';}
// import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoadImagesService {
  private FOLDER_IMAGES = 'assets' 
  private allies = 'allies'

  constructor(private db : AngularFireStorage) { 
  }

  loadImagesFirebase(images: any[]){
    const storageRef = firebase.storage().ref()
    console.log('images by UPLOAD',images[0].name)
    for ( const item of images ){
      
      console.log('ciclo',item)
      // const uploadTask: firebase.storage.UploadTask = 
      //                   storageRef.child(`${this.FOLDER_IMAGES}/ ${this.allies}`)
      //                   .put( item.images[0] )
                
    }
  }


}
