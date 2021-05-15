# AddressBook
This is my first application with electron.

## Design
#### Folder Struture
There are 2 different folders within app - core and ui. 
Core:- Contains the non-visual elements of the application like services, utils, constants, pipes etc.
UI:- Contains the visual elements of the application like components.

#### Tech Stack
This application uses Angular along with Electron. Tried to stick to the basic libraries that are already part of angular scaffold.
For Toggling switches, I have used ngx-ui-switch library.

***Note:*** For most files, I have added comments in the file itself.

## Running Electron Application
Run `npm install` to install node_modules
Run `npm run build:electron` for the Address Book electron application.

## Packaging Electron Application
Run `npm run package:electron` for the Address Book electron application package.


## Features
* Loading Contacts
    * Zero Contact - Show a message No contacts available along with an Add Button.
    * Many Contacts - Proper view with scroll bar is shown.
* Add New Contact - Click on Add New Contact button to add contacts at any point in time.
* Update Existing Contact - Click on Edit button beside each contact's name to edit the contact.
* Delete Contact - Click on Delete button beside each contact's name to delete the contact.
* Sort Contacts: 
    * By First Name/Last Name - Toggle the Sort By switch to sort on first name/last name of the contacts.
    * Ascending/Descendeing Order - Toggle the Sort Order switch to sort in ascending or descending order.
* Filtering Contacts - Type in the search input box to view the filtered results.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
