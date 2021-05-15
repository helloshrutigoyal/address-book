import { bindCallback, bindNodeCallback, Observable, of, throwError } from "rxjs";
import { FILE_DOESNT_EXIST_ERROR_MSG, FILE_READ_ERROR_MSG, FILE_WRITE_ERROR_MSG } from "../constants/address-book.constants";

/**
 * This class is responsible for working with File System.
 * This class has completely encapsulated the nitty gritties of file system.
 * 
 * Pros:
 * 1) The consumer of this class doesn't need to worry about file system issues.
 * 2) Reusability. This is a generic utility that can be used anywhere in any project.
 * 
 */

export class FileHandlerService {
    static doesFileExist(path: string): Observable<boolean> {
        let fileExists = (window as any).addressbook.fs.existsSync(path);
        if(!fileExists) {
            return throwError(FILE_DOESNT_EXIST_ERROR_MSG);
        }

        return of(true);
    }

    static readFile(path: string): Observable<any> {
        return Observable.create((obs: any) => {
            FileHandlerService.doesFileExist(path).subscribe((doesExist) => {
                (window as any).addressbook.fs.promises.readFile(path, 'utf8').then((data: any, err: any) => {
                    if(err) {
                            obs.error(FILE_READ_ERROR_MSG);
                    }

                    obs.next(data);
                });
            },
            (err) => {
                obs.error(err);
            })
        });
    }
    
    static writeFile(path: string, data: string): Observable<boolean> {
        return Observable.create((obs: any) => {
            (window as any).addressbook.fs.promises.writeFile(path, data,'utf8').then((data: any,) => {
                obs.next(true);
            }).catch((err: any) => {
                obs.error(FILE_WRITE_ERROR_MSG);
            });
        });
    }
}