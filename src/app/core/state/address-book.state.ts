import { Injectable } from "@angular/core";
import { IContact } from "../models/contact";

/**
 * I wanted to use the idea of Redux States/Stores but wasn't sure if allowed to use the library - NgRx
 * so chose to make this Singleton which acts as a golden source of data.
 * 
 */

@Injectable({
    providedIn: 'root'
})
export class AdressBookState {
    // contacts: Map<string, IContact[]> = new Map();
    contacts: IContact[] = [];

    // I wanted to approach this with redux mindset
    selectedContactId: string = '';
    loading: boolean = false;
    error: string = '';
}

/**
 * The idea of creating these functions is similar to creating reducers/selectors in Redux.
 * That's why keeping them in same place as the state.
 * 
 * Alternatively I could have done follwoing:
 * 1) Created utility class with all these methods as static methods
 * 2) Export all these functions from a separate util file.
 * 
 */
export function getContact(contacts: IContact[], contactId: string): number {
    return contacts.findIndex((contact) => contact.id == contactId);
}

export function deleteContact(contacts: IContact[], contactId: string): IContact[] {
    return contacts.filter((contact) => contact.id != contactId);
}

export function updateContact(contacts: IContact[], contact: IContact): IContact[] {
    const idx: number = getContact(contacts, contact.id);
    if(idx > -1) {
        const newArr = [...contacts];
        newArr.splice(idx, 1, contact);
        return newArr;
    }
    return [...contacts];
}

export function addContact(contacts: IContact[], contact: IContact): IContact[] {
    return [...contacts].concat(contact);
}

export function searchContacts(searchStr: string, contacts: IContact[]): IContact[] {
    let searchPattern = new RegExp(searchStr, 'i');
    return contacts.filter((value) => {
        return searchPattern.test(value.fname) || searchPattern.test(value.lname);
    });
}

export function sortContacts(sortByField: string, sortOrder: boolean, contacts: IContact[]): IContact[] {
    let resultArr = [...contacts];
    resultArr.sort((a: any, b: any) => {
        let fieldA = a[sortByField];
        let fieldB = b[sortByField];
        let result = 0;

        if(sortOrder) {
            //Desc
           result = fieldA >  fieldB ?  -1 : fieldA < fieldB ? 1 : 0;
        } else {
            // Asc
            result = fieldA <  fieldB ?  -1 : fieldA > fieldB ? 1 : 0;
        }

        return result;
    });

    return resultArr;
}
