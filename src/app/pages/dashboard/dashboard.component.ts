import { Component} from '@angular/core';
import { RevenueChartComponent } from '../revenue-chart/revenue-chart.component';
import { RecentOrdersComponent } from '../recent-orders/recent-orders.component';
import { BestCustomersComponent } from "../best-customers/best-customers.component";
import { InventoryStatusComponent } from "../inventory-status/inventory-status.component";
import { AddCustomerComponent } from "../add-customer/add-customer.component";
import { BestItemsComponent } from "../best-items/best-items.component";


@Component({
  selector: 'app-dashboard',
  imports: [RevenueChartComponent, RecentOrdersComponent, BestCustomersComponent, InventoryStatusComponent, AddCustomerComponent, BestItemsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  date = new Date().toDateString();
  time= new Date().toLocaleTimeString();
  
}