import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IContact } from "src/app/core/models/contact";

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
    @Output() editContact: EventEmitter<IContact> = new EventEmitter();
    @Output() addContact: EventEmitter<IContact> = new EventEmitter();
    @Output() deleteContact: EventEmitter<IContact> = new EventEmitter();

    @Input()
    public contacts: IContact[] = [];

    showContactForm: boolean = false; 

    contactForm: FormGroup = new FormGroup({
        fname: new FormControl('', Validators.required),
        lname: new FormControl('', Validators.required),
        phone: new FormControl('')
    });
    emptyContact: IContact = {
        fname: '',
        lname: '',
        phone: '',
    } as any;
    selectedContact: IContact = {...this.emptyContact};

    addNewContact() {
        this.showContactForm = true;
    }

    cancelContactForm() {
        this.clearContactForm();
        this.showContactForm = false;
    }
    
    editContactHandler(contact: IContact) {
        // creating clone of actual contact. So that we update our data source on successful submission of edits.
        this.selectedContact = {...contact};
        this.updateContactForm();
        this.showContactForm = true;
    }
    
    deleteContactHandler(contact: IContact) {
        this.deleteContact.emit(contact);
    }
    
    saveContactForm() {
        if(this.selectedContact.id) {
            // Save an existing contact
            this.editContact.emit({
                id: this.selectedContact.id,
                ...this.contactForm.value
            });
        } else {
            // Save a new contact
            this.addContact.emit({
                ...this.contactForm.value
            });
        }
        this.clearContactForm();
        this.showContactForm = false;
    }

    private updateContactForm() {
        this.contactForm.setValue({fname: this.selectedContact.fname, lname: this.selectedContact.lname, phone: this.selectedContact.phone});
    }

    private clearContactForm() {
        this.selectedContact = {...this.emptyContact};
        this.updateContactForm();
    }
}