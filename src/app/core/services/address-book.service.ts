import { Injectable } from "@angular/core";
import { IContact } from "../models/contact";
import { CONTACT_FILE_NAME, DELETE_CONTACT_ERROR_MSG, GET_CONTACTS_ERROR_MSG, UPDATE_CONTACT_ERROR_MSG,ADD_CONTACT_ERROR_MSG, APPLICATION_DATA_PATH } from "../constants/address-book.constants";
import { contactTranslator } from "./translators/contact.translator";
import { catchError, map } from "rxjs/operators";
import { EMPTY, Observable } from "rxjs";
import { FileHandlerService } from "./file-handler.service";
import { addContact, AdressBookState, deleteContact, updateContact } from "../state/address-book.state";
// import * as electron from 'electron';

/**
 * This class is responsible for communicating wuth the backend.
 * 
 * In this class I have purposefully used ContactTranslator as an angular dependency
 * and FileHandlerService as non angular dependency. This is to demostrante the use of 
 * different ways to use classes.
 * 
 */
@Injectable({
    providedIn: 'root'
})
export class AddressBookService {
    // TODO: Optimize code to make it work with web as well.
    // I wanted to make this class agnostic of desktop/web by removing dependency on filesystem.
    // This is the reason why I have encapsulated file system related behavior in FileHandlerService.
    // I want to make the type of instance of FileHandler class available at run-time.
    // But that is something I want to research on. Intial thoughts are looming around UseClass, UseFactory etc.
    constructor(private contactTranslator: contactTranslator,
                private addressBookState: AdressBookState) {
    }

    // Fetches all contacts.
    getAllContacts(): Observable<IContact[]> {
        // I was trying to fetch data from app data folder but using the below code gives me error
        // let appDataPath = (electron.app).getPath(APPLICATION_DATA_PATH)
        // Error was: __dirname is not defined
        // None of the solutions that I could find on internet worked.
        let appDataPath = '';
        appDataPath = (window as any).addressbook.path.join(appDataPath, CONTACT_FILE_NAME);

        return Observable.create((obs: any) => {
            FileHandlerService.readFile(appDataPath).pipe(
                map((data) => {
                    obs.next(this.contactTranslator.deserializeContacts(JSON.parse(data)));
                }),
                catchError((err) => {
                    obs.error(GET_CONTACTS_ERROR_MSG);
                    return EMPTY;
                })
            ).subscribe();
        });        
    }

    // updates an existing contact in file system
    updateContact(contact: IContact): Observable<boolean> {
        let appDataPath = '';
        appDataPath = (window as any).addressbook.path.join(appDataPath, CONTACT_FILE_NAME);

        return Observable.create((obs: any) => {
            let afterUpdateContacts = updateContact(this.addressBookState.contacts, contact);
            let data: string = this.contactTranslator.serializeContacts(afterUpdateContacts);
            FileHandlerService.writeFile(appDataPath, data).pipe(
                map((data) => {
                    obs.next(true);
                }),
                catchError((err) => {
                    obs.error(UPDATE_CONTACT_ERROR_MSG);
                    return EMPTY;
                })
            ).subscribe();
        });
    }

    // adds new contact to the file system
    addNewContact(contact: IContact): Observable<string> {
        let appDataPath = '';
        appDataPath = (window as any).addressbook.path.join(appDataPath, CONTACT_FILE_NAME);

        return Observable.create((obs: any) => {
            let afterUpdateContacts = addContact(this.addressBookState.contacts, contact);
            let data: string = this.contactTranslator.serializeContacts(afterUpdateContacts);
            FileHandlerService.writeFile(appDataPath, data).pipe(
                map((data) => {
                    obs.next(this.contactTranslator.generateContactId(contact));
                }),
                catchError((err) => {
                    obs.error(ADD_CONTACT_ERROR_MSG);
                    return EMPTY;
                })
            ).subscribe();
        });
    }

    // removes contact from file system
    deleteContact(contactId: string): Observable<boolean> {
        let appDataPath = '';
        appDataPath = (window as any).addressbook.path.join(appDataPath, CONTACT_FILE_NAME);

        return Observable.create((obs: any) => {
            let afterDeleteContacts = deleteContact(this.addressBookState.contacts, contactId);
            let data: string = this.contactTranslator.serializeContacts(afterDeleteContacts);
            FileHandlerService.writeFile(appDataPath, data).pipe(
                map((data) => {
                    obs.next(true);
                }),
                catchError((err) => {
                    obs.error(DELETE_CONTACT_ERROR_MSG);
                    return EMPTY;
                })
            ).subscribe();
        });
    }
    
}