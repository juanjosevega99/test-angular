
export class FileItem{

    public file: File;
    public nameFile: string;
    public url: string;
    
    constructor (file: File){
        this.file = file;
        this.nameFile = file.name;
    }
}