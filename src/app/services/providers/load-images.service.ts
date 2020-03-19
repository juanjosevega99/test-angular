import { Injectable } from '@angular/core';

import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { FileItem } from 'src/app/models/loadImages_Firebase/file-item';
// import { AngularFirestore } from '@angular/fire/storage';}
// import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoadImagesService {
  private FOLDER_IMAGES = 'assets' 
  private allies = 'allies'
  private establishmentPhotos = 'establishmentPhotos'


  constructor(private db : AngularFireStorage) { 
  }

  loadImagesFirebase(images: FileItem[]){
    const storageRef = firebase.storage().ref();

    for ( const item of images ){   
      console.log('ciclo',item)

      const uploadTask: firebase.storage.UploadTask = 
                          storageRef.child(`${this.FOLDER_IMAGES}/ ${this.allies}/ ${this.establishmentPhotos}`)
                        .put( item.file ) ;
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( error )=> console.log('Error al subir', error ),
        ()=>{
          console.log('Imagen cargada correctamente');
          item.url =   uploadTask.snapshot.downloadURL 
        }        
        ) 
    }
  }


}
