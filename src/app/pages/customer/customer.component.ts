import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { addCustomerService } from '../../Service/CustomerService';
import { AddCustomerComponent } from "../add-customer/add-customer.component";
import { BestCustomersComponent } from "../best-customers/best-customers.component";

@Component({
  selector: 'app-manage-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, AddCustomerComponent, BestCustomersComponent],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  date: string = new Date().toDateString();
  customers: any[] = [];
  searchTerm: string = '';
  totalLoyaltyPoints: number = 0;
  averageLoyaltyPoints: number = 0;

  @ViewChild('customerName') customerName!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;
  @ViewChild('points') points!: ElementRef;

  constructor() {
    this.loadAllCustomers();    
  }

  /**
   * Updates the computed values for total and average loyalty points.
   */
  private updateComputedValues(): void {
    this.totalLoyaltyPoints = this.customers.reduce((sum, customer) => sum + customer.loyaltyPoints, 0);
    this.averageLoyaltyPoints = this.customers.length
      ? this.totalLoyaltyPoints / this.customers.length
      : 0;
  }


  loadAllCustomers(): void {
    fetch('http://localhost:8080/mos/customer/getAllCustomers')
    .then((response) => response.json())
    .then((data)=>{
      this.customers = data;
      this.updateComputedValues();
    }).catch((err) => console.log(err));

  }

  /**
   * Triggers a search for customers by name with debouncing.
   */
  searchCustomers(): void {
    
    if(this.searchTerm!=''){
   fetch(`http://localhost:8080/mos/customer/searchCustomer/${this.searchTerm}`)
   .then((response) => response.json())
   .then((data)=>{
     this.customers = data;
     this.updateComputedValues();
   })
  }

  }


  async addCustomer(name:string,contact:string,points:string){   
  await addCustomerService(name,contact,points)
  this.updateComputedValues();
  this.loadAllCustomers();
              this.customerName.nativeElement.value = '';
              this.contact.nativeElement.value = '';
              this.points.nativeElement.value = '';
  }

  /**
   * Fetches the latest customer data by ID before updating.
   * @param customerId The ID of the customer to fetch
   * @returns The customer data
   */
  fetchCustomerById(customerId: number): Promise<any> {
    return fetch(`http://localhost:8080/mos/customer/getCustomerById/${customerId}`)
      .then(response => response.json());
  }
  
  updateCustomer(customer: any): void {
    this.fetchCustomerById(customer.id)
      .then(latestCustomer => {
        Swal.fire({
          title: 'Update Customer',
          html: `
            <input id="name" class="swal2-input" value="${latestCustomer.name}">
            <input id="contact" class="swal2-input" value="${latestCustomer.contact}">
          `,
          showCancelButton: true,
          confirmButtonText: 'Update',
          preConfirm: () => {
            const name = (document.getElementById('name') as HTMLInputElement).value;
            const contact = (document.getElementById('contact') as HTMLInputElement).value;
            return { id: customer.id, name, contact, loyaltyPoints: latestCustomer.loyaltyPoints };
          }
        }).then(result => {
          if (result.isConfirmed) {
            fetch('http://localhost:8080/mos/customer/updateCustomer', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(result.value)
            })
            .then(response => response.json())
            .then(() => {
              this.customers = this.customers.map(c => 
                c.id === customer.id ? result.value : c
              );
              Swal.fire('Success!', 'Customer updated.', 'success');
            });
          }
        });
      });
  }

  /**
   * Deletes a customer after user confirmation.
   * @param customerId The ID of the customer to delete
   */
  deleteCustomer(customerId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/mos/customer/deleteCustomer/${customerId}`, {
          method: 'DELETE'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete customer #${customerId}`);
            }
            return response.json();
          })
          .then((success) => {
            if (success) {
              this.customers = this.customers.filter(customer => customer.id !== customerId);
              this.updateComputedValues(); // Update computed values after deleting a customer
              Swal.fire('Deleted!', `Customer #${customerId} has been deleted.`, 'success');
            } else {
              Swal.fire('Error!', `Customer #${customerId} not found.`, 'error');
            }
          })
          .catch((error) => {
            console.error('Error deleting customer:', error);
            Swal.fire('Error!', 'Failed to delete customer.', 'error');
          });
      }
    });
  }

  /**
   * Updates a customer’s loyalty points with rollback on failure.
   * @param customerId The ID of the customer
   * @param currentPoints The customer’s current loyalty points
   */
  updateLoyaltyPoints(customerId: number, currentPoints: number): void {
    Swal.fire({
      title: 'Update Loyalty Points',
      text: `Enter points to add for customer #${customerId}:`,
      input: 'number',
      inputValue: '0',
      inputAttributes: {
        min: '-1000',
        max: '1000',
        step: '1'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || isNaN(Number(value))) {
          return 'Please enter a valid number!';
        }
        return undefined;
      },
      customClass: {
        popup: 'swal2-dark'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const pointsToAdd = Number(result.value);
        const originalPoints = currentPoints; // Store original points for rollback

        // Optimistically update the UI
        this.customers = this.customers.map(customer =>
          customer.id === customerId
            ? { ...customer, loyaltyPoints: customer.loyaltyPoints + pointsToAdd }
            : customer
        );
        this.updateComputedValues(); // Update computed values after optimistic update

        fetch(`http://localhost:8080/mos/customer/updateCustomerPoints/${customerId}/${pointsToAdd}`, {
          method: 'PUT'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to update points for customer #${customerId}`);
            }
            return response.json();
          })
          .then((success) => {
            if (success) {
              Swal.fire('Updated!', `Loyalty points for customer #${customerId} updated.`, 'success');
            } else {
              // Rollback on failure
              this.customers = this.customers.map(customer =>
                customer.id === customerId
                  ? { ...customer, loyaltyPoints: originalPoints }
                  : customer
              );
              this.updateComputedValues(); // Update computed values after rollback
              Swal.fire('Error!', `Customer #${customerId} not found.`, 'error');
            }
          })
          .catch((error) => {
            // Rollback on error
            this.customers = this.customers.map(customer =>
              customer.id === customerId
                ? { ...customer, loyaltyPoints: originalPoints }
                : customer
            );
            this.updateComputedValues(); // Update computed values after rollback
            console.error('Error updating loyalty points:', error);
            Swal.fire('Error!', `Failed to update loyalty points: ${error.message}`, 'error');
          });
      }
    });
  }
}