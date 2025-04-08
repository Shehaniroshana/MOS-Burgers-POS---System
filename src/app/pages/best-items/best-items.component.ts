import { Component } from '@angular/core';
import { getBestSellingItems, loadOrderDetails } from '../../Service/ItemService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-items',
  imports: [CommonModule],
  templateUrl: './best-items.component.html',
  styleUrl: './best-items.component.css'
})
export class BestItemsComponent {

  bestItems: any[] = [];
  constructor(){
    this.loadBestItems();
  }

  async loadBestItems() {
    let data:any[]=await loadOrderDetails('All');
    this.bestItems= await getBestSellingItems(data);
    console.log('====================================');
    console.log(this.bestItems);
    console.log('====================================');
  }

}
