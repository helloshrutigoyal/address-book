import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ContactListComponent } from "./contact-list/contact-list.component";
import { ContactRendererComponent } from "./contact-renderer/contact-renderer.component";

/**
 * This is a child module wrapper to encompass all the address book related UI pieces.
 * 
 */
@NgModule({
    declarations: [
        ContactListComponent,
        ContactRendererComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        ContactListComponent
    ]
})
export class AddressBookModule {

}