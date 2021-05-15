import { Injectable } from "@angular/core";
import {
    CONTACTS_KEY,
    FNAME_KEY,
    LNAME_KEY,
    PHONE_KEY
} from "../../constants/address-book.constants";
import { IContact } from "../../models/contact";

/**
 * This class is responsible for serializing and deserializing the data to/from backend.
 * 
 * This class can be pulled out of Angular DI and all the methods can be static. 
 * I have kept it in Angular DI just for demo.
 * 
 * Pros:
 * 1) Encapsulatation of marshaling/unmarshaling logic making it easy to update in future.
 * 2) Reusability. If same class can be used at multiple places that's a win-win situation.
 * 
 * Cons:
 * Many classes come into play even for a small workflow which I personally feel can be ignored.
 */

@Injectable({
    providedIn: 'root'
})
export class contactTranslator {
    /**
     * This method is responsible for deserializing the data from the backend i.e. content read from the file.
     * It returns the array of properly formatted Contacts needed for our Angular app.
     */
    public deserializeContacts(rawData: any): IContact[] {
        const rawContacts = rawData[CONTACTS_KEY];
        return rawContacts.map((rawC: any) => {
            let contact = {
                fname: this.deserializeString(rawC[FNAME_KEY]),
                lname: this.deserializeString(rawC[LNAME_KEY]),
                phone: this.deserializeString(rawC[PHONE_KEY])
            } as IContact;

            contact.id = this.generateContactId(contact);
            return contact;
        });
    }

    /**
     * This method is responsible for serializing the data that needs to be sent to the backend.
     * It takes the array from our angular app and returns the string to be written in the file.
     */
    public serializeContacts(contacts: IContact[]): string {
        let contactsObj: any = {
            [CONTACTS_KEY]: contacts.map((contact) => {
                return {
                    [FNAME_KEY]: this.serializeString(contact.fname),
                    [LNAME_KEY]: this.serializeString(contact.lname),
                    [PHONE_KEY]: this.serializeString(contact.phone),
                }
            })
        }
        return JSON.stringify(contactsObj);
    }

    /**
     * This method generates a unique id for the given contact.
     * 
     * @param contact The contact for which key is needed.
     * @returns string - key/unique id for the contact.
     */
    public  generateContactId(contact: IContact): string {
        let key = '';

        if(contact.fname) {
            key = contact.fname[0];
        } else if(!contact.fname) {
            key = contact.lname[0];
        } else {
            key = '#';
        }

        key = `${key}_${contact.fname}_${contact.lname}_${Math.random()*10}`;
        return key;
    }
    
    /**
     * This method deserializes any string given as input.
     */
    private deserializeString(value: string) {
        return value ? value : "";
    }

    /**
     * This method serializes any string given as input.
     */
    private serializeString(value: string) {
        return value ? value : "";
    }
}