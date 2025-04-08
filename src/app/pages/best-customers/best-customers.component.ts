import { Component } from '@angular/core';
import { loadBestCustomers } from '../../Service/DashboardService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-customers',
  imports: [CommonModule],
  templateUrl: './best-customers.component.html',
  styleUrl: './best-customers.component.css'
})
export class BestCustomersComponent {


  bestCustomerList: any[] = [];
  constructor() {
    this.loadBestCustomers();
  }

  async loadBestCustomers() {
    this.bestCustomerList= await loadBestCustomers()
    console.log(this.bestCustomerList);
  }


}
