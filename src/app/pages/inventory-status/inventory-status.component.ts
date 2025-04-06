import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-status',
  imports: [CommonModule],
  templateUrl: './inventory-status.component.html',
  styleUrl: './inventory-status.component.css'
})
export class InventoryStatusComponent {

  items:any[]=[];


  constructor(){
    this.loadAllItems();
  }

  loadAllItems(){
    fetch('http://localhost:8080/mos/items/getInventoryStatus')
      .then(res => res.json())
      .then((data: string[]) => {
        const rawItems = data.map(item => ({
          name: item.split(': ')[0],
          quantity: parseInt(item.split(': ')[1])
        }));
        const total = rawItems.reduce((sum, item) => sum + item.quantity, 0);
        this.items = rawItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          percentage: ((item.quantity / total) * 100).toFixed(1)
        }));
        console.log(this.items);
        
      })
      .catch(err => console.error('Error:', err));
  }

}
