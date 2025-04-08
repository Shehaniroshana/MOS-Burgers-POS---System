import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { loadBestCustomers } from '../../Service/DashboardService';
import { BestCustomersComponent } from "../best-customers/best-customers.component";


@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule, FormsModule, BestCustomersComponent],
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css']
})
export class ManageOrderComponent {
  
  searchOrderList: any[] = [];
  
  date= new Date().toDateString();
  
  Orders: any[] = [];

  activeStatus: string = '';

  
  constructor() {
     this.loadOrderDetails('All');
     this.loadBestCustomers();
  }

  loadOrderDetails(status: string): void {
    
    let categoryUrl = status === 'All' ? 'http://localhost:8080/order/getAllOrders' : `http://localhost:8080/order/searchOrderStatus/${status}`;
    fetch(categoryUrl)
      .then((response) => response.json())
      .then((data) => {
        this.activeStatus = status;
        this.Orders = data;
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
        Swal.fire('Error!', 'Failed to load order details. Please try again.', 'error');
      });
    
  }


  search_Order(customerName: string){

    this.searchOrderList = [];
    if(customerName!==''){
      
    fetch(`http://localhost:8080/order/searchOrder/${customerName}`)
      .then((response) => response.json())
      .then((data) => {
        this.searchOrderList = data;
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
        Swal.fire('Error!', 'Failed to load order details. Please try again.', 'error');
      });
    }else{
      this.searchOrderList = [];
    }

  }


  delete_order(orderId: number){
   console.log(orderId);
   
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result)=>{
      
      if(result.isConfirmed){
        fetch(`http://localhost:8080/order/deleteOrder/${orderId}`,{method:'DELETE'})
        .then((response)=>response.json())
        .then((data)=>{
          if(data){
            Swal.fire('Deleted!', `Order #${orderId} has been deleted.`, 'success');
            this.loadOrderDetails(this.activeStatus);
          }else{
            Swal.fire('Error!', `Order #${orderId} not found.`, 'error');
          }
        })
      }

    });


  }


  update_status(orderId: number, status: string){
    Swal.fire({
      title: 'Update Status',
      html: `
      <select id="status" class="swal2-input bg-slate-800 w-full">
        <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        <option value="Cancelled" ${status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {
        const selectedStatus = (document.getElementById('status') as HTMLSelectElement).value;
        fetch(`http://localhost:8080/order/updateOrderStatus/${orderId}/${selectedStatus}`, { method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            Swal.fire('Updated!', `Order #${orderId} status has been updated to ${selectedStatus}.`, 'success');
            this.loadOrderDetails(this.activeStatus);
          } else {
            Swal.fire('Error!', `Order #${orderId} not found.`, 'error');
          }
        });
      }

    });


  }

 
  bestCustomerList: any[] = [];
  async loadBestCustomers() {
   this.bestCustomerList=await loadBestCustomers()
 }

 
}