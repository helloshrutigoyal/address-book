import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContact } from 'src/app/core/models/contact';

@Component({
    selector: 'app-contact-renderer',
    templateUrl: './contact-renderer.component.html',
    styleUrls: ['./contact-renderer.component.scss']
})
export class ContactRendererComponent {
    public name = '';

    private _contact: IContact = undefined as any;

    @Output() editContact: EventEmitter<IContact> = new EventEmitter();
    @Output() deleteContact: EventEmitter<IContact> = new EventEmitter();

    @Input()
    public set contact(value: IContact) {
        console.log(`ContactRenderer: ${JSON.stringify(value)}`);
        if(value) {
            this._contact = value;
            this.name = `${value.fname} ${value.lname}`;
        }
    }

    public get contact() {
        return this._contact;
    }

    editContactHandler(): void {
        this.editContact.emit(this.contact);
    }

    deleteContactHandler(): void {
        this.deleteContact.emit(this.contact);
    }
}
