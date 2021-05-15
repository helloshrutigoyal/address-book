import { Component, OnInit, ViewChild } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SortByField } from './core/constants/address-book.constants';
import { IContact } from './core/models/contact';
import { AddressBookService } from './core/services/address-book.service';
import { addContact, AdressBookState, deleteContact, searchContacts, sortContacts, updateContact } from './core/state/address-book.state';
import { ContactListComponent } from './ui/contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Address Book';

  // Contacts displayed in View
  contacts: IContact[] = [];

  // Captures search input entry
  searchInput = '';

  // Sorting related properties
  sortOrder = false;
  sortByField: SortByField = SortByField.FNAME;

  /**
   * Using ViewChild to show the contact editing form when we click add new contact form top level toolbar.
   * We can also use Input/Output bindings in place of ViewChild.
   */
  @ViewChild('contactList') contactListComp: ContactListComponent = {} as any;

  constructor(private addressBookService: AddressBookService,
              private addressBookState: AdressBookState) {

  }

  ngOnInit() {
    // Load All Contacts at application startup.
    this.subscribeGetAllContacts();
  }

  /**
   * This method will fetch all contacts by communicating with the backend.
   * Renders it in view as per the sorting order and field selected.
   * 
   */
  subscribeGetAllContacts() {
    console.log('Loading Contacts...');

    this.addressBookState.loading = true;

    this.addressBookService.getAllContacts().subscribe(
      (data: IContact[]) => {
        this.successHandler(data, 'Contacts Loaded...');
      },
      (err) => {
        this.errorHandler(err, 'Error occurred while loading contacts...');
        return EMPTY;
      }
    );
  }

  /**
   * This method will add the given contact by commnucating with the backend.
   * Renders it in view as per its order after sorting.
   * 
   */
  addContactHandler(contact: IContact) {
    console.log('Adding Contact...');
    
    this.addressBookState.loading = true;

    this.addressBookService.addNewContact(contact).subscribe(
      (data: string) => {
        contact.id = data;
        this.successHandler(addContact(this.addressBookState.contacts, contact), 'Successfully Added Contact...');
      },
      (err: any) => {
        this.errorHandler(err, 'Could not add Contact...');
        return EMPTY;
      }
    );
  }

  /**
   * This method will update the given contact by commnucating with the backend.
   * Renders it in view as per its updated order after sorting.
   * 
   */
  editContactHandler(contact: IContact) {
    console.log('Updating Contact...');
    
    this.addressBookState.selectedContactId = contact.id;
    this.addressBookState.loading = true;

    this.addressBookService.updateContact(contact).subscribe(
      (data: boolean) => {
        this.successHandler(updateContact(this.addressBookState.contacts, contact), 'Successfully Updated Contact...');
      },
      (err: any) => {
        this.errorHandler(err, 'Could not update Contact...');
        return EMPTY;
      }
    );
  }

  /**
   * This method will delete the contact for given contactId by commnucating with the backend.
   * Renders the updated list of contacts with proper sorting.
   * 
   */
  deleteContactHandler(contact: IContact) {
    console.log('Deleting Contact...');

    this.addressBookState.selectedContactId = contact.id;
    this.addressBookState.loading = true;
    
    this.addressBookService.deleteContact(contact.id).subscribe(
      (data: boolean) => {
        this.successHandler(deleteContact(this.addressBookState.contacts, this.addressBookState.selectedContactId), 'Successfully Deleted Contact...');
      },
      (err: any) => {
        this.errorHandler(err, 'Could not delete Contact...');
        return EMPTY;
      }
    );
  }

  /**
   * This method is called when Add New Contact(+) button in toolbar is clicked in template.
   * This method sets the flag in the contact list child component to show the contact editing form.
   * 
   */
  addNewContact() {
    this.contactListComp.showContactForm = true;
  }

  /**
   * This method is responsible for filtering the contacts on the input criteria and can be called from 2 points:
   * 1) On click of magnifying lens in search input box.
   * 2) On keyboard input in search input box.
   * 
   * This method works with the component's local copy of contacts array.
   */
  searchContacts = () => {
    let contacts = this.addressBookState.contacts;

    if(this.searchInput) {
      contacts = searchContacts(this.searchInput, this.addressBookState.contacts);
    }
    this.setContacts(contacts, false);
    return EMPTY;
  }

  /**
   * This method is triggered on keyboard input in search input box.
   * It in turn calls the relavant search method and thus sets the filtered results.
   */
  searchInputChangeHandler() {
    of(this.searchInput).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(this.searchContacts)
    ).subscribe();
  }

  /**
   * This method updates the sortByField so that we can facilitate sorting on fname and lname.
   * It is triggered on the change of the toggle/switch.
   */
  sortByFieldChangeHandler(value: boolean) {
    this.sortByField = value ? SortByField.LNAME : SortByField.FNAME;
    this.setContacts(this.addressBookState.contacts);
  }
  
  /**
   * This method updates the sorting order - Ascending/Descending.
   * It is triggered on the change of the toggle/switch.
   */
  sortOrderChangeHandler(value: boolean) {
    this.sortOrder = value;
    this.setContacts(this.addressBookState.contacts);
  }

  /**
   * This method is responsible for triggering the sorting mechanism in a resuable way.
   * It gets triggered in following scenarios:
   * 1) Fetching contacts
   * 2) Adding Contact
   * 3) Updating Contact
   * 4) Deleting Contct
   * 5) Change in SortBy field
   * 6) Change in Sort Order
   * 7) Change in Filter/Search Input
   */
  sortContacts(unsortedContacts: IContact[]) {
    return sortContacts(this.sortByField, this.sortOrder, unsortedContacts);
  }

  /**
   * This method is a resuable success handler that encapsulates commonn tasks like
   * - update the golden data source
   * - rendering data
   * - logging
   * 
   * This is triggered when the service returns successful response.
   */
  successHandler(contacts: IContact[], logMsg: string) {
    console.log(logMsg);
    this.addressBookState.loading = false;
    this.addressBookState.error = '';
    this.setContacts(contacts);
    this.setSelectedContactId('');
    console.log(`AppComponent Contacts: ${JSON.stringify(this.contacts)}`);
  }

  /**
   * This method is a resuable error handler that encapsulates commonn tasks like
   * - update the golden data source
   * - logging
   * 
   * This is triggered if an error is thrown from the service.
   */
  errorHandler(err: string, logMsg: string) {
    console.log(logMsg);
    this.addressBookState.loading = false;
    this.addressBookState.error = err;
    this.setSelectedContactId('');
    console.log(`Error Occurred: ${err}`);
  }

  /**
   * This methos is responsible for updating the contacts in golden data source/store and component's local data source.
   */
  setContacts(contacts: IContact[], updateStore: boolean = true) {
    // This flag is used to indicate whether we want to update the data in golden data source.
    // We might not want to update golden source in case of filtering.
    // This flag will be helpful in those cases.
    if(updateStore) {
      this.addressBookState.contacts = contacts;
    }

    // sort the contacts and render them in view
    let sortedContacts = this.sortContacts(contacts);
    this.contacts = sortedContacts;
  }

  /**
   * This method simply updates the selectedContactID in the golden data source.
   */
  setSelectedContactId(value: string) {
    this.addressBookState.selectedContactId = value;
  }
  
}
