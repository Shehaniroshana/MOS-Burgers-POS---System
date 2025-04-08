import {  Component, ElementRef, ViewChild} from '@angular/core';
import { addCustomerService } from '../../Service/CustomerService';

@Component({
  selector: 'app-add-customer',
  imports: [],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  customers: any[] = [];

  @ViewChild('customerName') customerName!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;
  @ViewChild('points') points!: ElementRef;

  

  async addCustomer(name: string, contact: string, points: string) {
         
    await addCustomerService(name, contact, points);

    this.customerName.nativeElement.value = '';
    this.contact.nativeElement.value = '';
    this.points.nativeElement.value = '';
  }

 
}
