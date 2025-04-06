import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-orders',
  imports: [RouterLink,CommonModule],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent {

  recentOrders:any[]=[];
  time:string=new Date().toLocaleTimeString()
  constructor(){
    this.loadRecentOrders();
  }
  
  loadRecentOrders() {

   fetch('http://localhost:8080/order/recentOrders')
   .then((response)=>response.json())
   .then((data)=>{
    this.recentOrders=data;
    console.log(this.recentOrders);
   })


  }
}
