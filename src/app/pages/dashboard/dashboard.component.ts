import { Component} from '@angular/core';
import { RevenueChartComponent } from '../revenue-chart/revenue-chart.component';
import { RecentOrdersComponent } from '../recent-orders/recent-orders.component';
import { BestCustomersComponent } from "../best-customers/best-customers.component";
import { InventoryStatusComponent } from "../inventory-status/inventory-status.component";
import { AddCustomerComponent } from "../add-customer/add-customer.component";
import { BestItemsComponent } from "../best-items/best-items.component";
import { getAllCustomerCount, getAllCustomerLoyaltyPoints, getAllOrderCount, getAllOrderCountByStatus, getItemAllItemCount, getItemAllItemCountByCategory, getRevenuePercentageByTodayVsYesterday, getTotalRevenue, getTotalRevenueInCurrentMonth, getTotalRevenueToday, getTotalRevenueYesterday } from '../../Service/DashboardService';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  imports: [RevenueChartComponent, RecentOrdersComponent, BestCustomersComponent, InventoryStatusComponent, AddCustomerComponent, BestItemsComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  date = new Date().toDateString();
  time= new Date().toLocaleTimeString();
   
  totalRevenue = 0;
  totalRevenueInCurrentMonth = 0;
  totalRevenueYesterday = 0;
  totalRevenueToday = 0;
  revenuePercentageByTodayVsYesterday = 0;
  allOrderCount = 0;
  allOrderCountByStatus: any = {};
  orderPercentageByTodayVsYesterday = 0;
  itemAllItemCount = 0;
  itemAllItemCountByCategory: any = {};
  allCustomerCount = 0;
  allCustomerLoyaltyPoints: any = {};
  

  constructor(){
   this.loadAllData();
  }

  async loadAllData(){
    this.totalRevenue=await getTotalRevenue()
    this.totalRevenueInCurrentMonth=await getTotalRevenueInCurrentMonth()
    this.totalRevenueYesterday=await getTotalRevenueYesterday()
    this.totalRevenueToday=await getTotalRevenueToday()
    this.revenuePercentageByTodayVsYesterday=await getRevenuePercentageByTodayVsYesterday()
    this.allOrderCount=await getAllOrderCount()
    this.allOrderCountByStatus=await getAllOrderCountByStatus()
    this.orderPercentageByTodayVsYesterday=await getRevenuePercentageByTodayVsYesterday()
    this.itemAllItemCount=await getItemAllItemCount()
    this.itemAllItemCountByCategory=await getItemAllItemCountByCategory()
    this.allCustomerCount=await getAllCustomerCount()
    this.allCustomerLoyaltyPoints=await getAllCustomerLoyaltyPoints()

    console.log('====================================');
    console.log(this.totalRevenueToday);
    console.log('====================================');
  }

  
}