import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AppComponent } from './app.component';
import { AddressBookService } from './core/services/address-book.service';
import { AdressBookState } from './core/state/address-book.state';

describe('AppComponent', () => {
  let mockAddressBookService = jasmine.createSpyObj('mockAddressBookService', [
    'getAllContacts',
    'updateContact',
    'addNewContact',
    'deleteContact'
  ]);

  let mockAddressbookState = {
    contacts: [],
    selectedContactId: '',
    loading: '',
    error: ''
  };

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AddressBookService,
          useValue: mockAddressBookService
        },
        {
          provide: AdressBookState,
          useValue: mockAddressbookState
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    mockAddressBookService.getAllContacts.and.returnValue(of());
  });

  it('should create the app', () => {    
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Address Book'`, () => {   
    expect(component.title).toEqual('Address Book');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('Address Book');
  });

  it('should set contacts', () => {
    mockAddressBookService.getAllContacts.and.returnValue(
      Observable.create((obs: any) => {
        obs.next([
          {'id': '1', 'fname':'Test', 'lname':'test1', 'phone': '1'},
          {'id': '2', 'fname':'Test2', 'lname':'test2', 'phone': ''}
        ]) 
      })
    );
    component.subscribeGetAllContacts();
    expect(component.contacts).toBeDefined();
    expect(component.contacts.length).toEqual(2);
  });

  it('should set call error handler in case of error from getAllContacts service', () => {
    const spy = spyOn(component, 'errorHandler');
    mockAddressBookService.getAllContacts.and.returnValue(
      Observable.create((obs: any) => {
        obs.error('testError') ;
      })
    );
    component.subscribeGetAllContacts();
    expect(spy).toHaveBeenCalledOnceWith('testError', 'Error occurred while loading contacts...');
  });
});
