import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UiSwitchModule } from 'ngx-ui-switch';

import { AppComponent } from './app.component';
import { AddressBookModule } from './ui/address-book.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AddressBookModule,
    FormsModule,
    UiSwitchModule.forRoot({
      color: 'red',
      switchColor: '#248cc4',
      defaultBgColor: 'white',
      defaultBoColor: '#248cc4',
      checkedTextColor: 'white',
      uncheckedTextColor: '#248cc4'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
