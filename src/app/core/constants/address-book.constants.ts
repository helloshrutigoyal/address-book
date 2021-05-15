// Application Level Constants
export const APPLICATION_DATA_PATH = 'appData';
export const CONTACT_FILE_NAME = 'address-book-contacts.json';

// Error Messages.
// I usually prefer to make an error registry class which a master file of all errors in application
// Its usually a singleton but not in Angular context.
export const FILE_DOESNT_EXIST_ERROR_MSG = 'File does not exist.';
export const FILE_READ_ERROR_MSG = 'Some error occurred while reading file.';
export const FILE_WRITE_ERROR_MSG = 'Some error occurred while writing file.';
export const GET_CONTACTS_ERROR_MSG = 'Some error occurred while fetching contacts.';
export const ADD_CONTACT_ERROR_MSG = 'Some error occurred while adding contact.';
export const UPDATE_CONTACT_ERROR_MSG = 'Some error occurred while updating contact.';
export const DELETE_CONTACT_ERROR_MSG = 'Some error occurred while deleting contact.';

// Keys for serialization/deserialization
export const CONTACTS_KEY = 'contacts';
export const FNAME_KEY = 'fname';
export const LNAME_KEY = 'lname';
export const PHONE_KEY = 'phone';

// Enum/constants for sorting fields
export enum SortByField {
    FNAME = 'fname',
    LNAME = 'lname',
}
