
export class FileItem{

    public file: File;
    public nameFile: string;
    public url: string;
    public isGoingUp: boolean; //flag control upload of file
    
    constructor (file: File){
        this.file = file;
        this.nameFile = file.name;
        this.isGoingUp = false;
    }
}