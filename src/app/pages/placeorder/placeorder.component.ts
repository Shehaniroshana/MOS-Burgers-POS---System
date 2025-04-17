import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { InventoryStatusComponent } from "../inventory-status/inventory-status.component";

// item.ts
interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  qty: number;
  imagePath: string;
  category:
  | 'Burgers'
  | 'Submarines'
  | 'Fries'
  | 'Pasta'
  | 'Chicken'
  | 'Beverages';
  discount: number;
}

interface cart_item {
  cart_id: number;
  id: number;
  price: number;
  discount: number;
  qty: number;
  name: string;
  imagePath: string;
}

interface itemDetails {
  itemId: number,
  quantity: number,
  itemName: string,
  itemImage: string
}

@Component({
  selector: 'app-placeorder',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryStatusComponent],
  templateUrl: './placeorder.component.html',
  styleUrl: './placeorder.component.css',
})
export class PlaceorderComponent {
  items: Item[] = [];
  date = new Date().toDateString();
  allItems: Item[] = [];
  activeCategory: string = '';
  cartItems: cart_item[] = [];
  CustomerIds: number[] = [];
  selectedCustomer: string | number | null = null;
  CustomerName: string = '..............';
  CustomerLoyaltyPoints: number = 0;
  ItemDetails: itemDetails[] = [];

  constructor() {
    this.fetchByCategory('Burgers');
    this.loadCustomerIds();
  }

  search_Item(search_Item: string) {
    if (search_Item != '') {
      this.items = [];
      console.log(search_Item);
      this.fetchSearchItems(search_Item);
    } else {
      this.items = [];
    }
  }

  fetchSearchItems(item_name: string) {
    if (item_name != '') {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow' as RequestRedirect,
      };

      fetch(
        `http://localhost:8080/mos/items/searchItem/${item_name}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          this.items = [];
          this.items = result;
          console.log(this.items);
        });
    }
  }

  add_to_cart(
    id: number,
    price: number,
    discount: number,
    qty: number,
    name: string,
    imagePath: string
) {
    // Check if item with same id exists in cartItems
    const existingCartItemIndex = this.cartItems.findIndex(item => item.id === id);
    
    if (existingCartItemIndex !== -1) {
        // Update only the quantity of the existing item
        this.cartItems[existingCartItemIndex].qty += qty;
        
        // Update quantity in ItemDetails
        const existingItemDetailIndex = this.ItemDetails.findIndex(item => item.itemId === id);
        if (existingItemDetailIndex !== -1) {
            this.ItemDetails[existingItemDetailIndex].quantity += qty;
        }
    } else {
        // Add new item
        const cart_id: number = new Date().getTime();
        console.log(cart_id);
        const cartItem: cart_item = {
            cart_id,
            id,
            price,
            discount,
            qty,
            name,
            imagePath,
        };
        this.cartItems.push(cartItem);

        this.ItemDetails.push({
            itemId: id,
            quantity: qty,
            itemName: name,
            itemImage: imagePath
        });
    }
}

  remove_search_Item(item_id: number) {
    this.items = this.items.filter((item) => item.id !== item_id);
  }

  fetchByCategory(category: string): void {
    this.activeCategory = category;
    console.log(category);

    fetch(`http://localhost:8080/mos/items/searchItemByCategory/${category}`)
      .then((response) => response.json())
      .then((result) => (this.allItems = result));
  }

  removeItem(cart_id: number) {
    this.cartItems = this.cartItems.filter((item) => item.cart_id !== cart_id);
  }

  getTotalPrice() {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += item.price * item.qty * (1 - item.discount / 100);
    });
    return total;
  }

  loadCustomerIds() {
    fetch(`http://localhost:8080/mos/customer/getCustomerIds`)
      .then((response) => response.json())
      .then((result) => (this.CustomerIds = result))
      .catch((err) => console.log(err));
  }

  getCustomerDetails() {
    console.log(this.selectedCustomer);

    if (this.selectedCustomer != null) {
      fetch(
        `http://localhost:8080/mos/customer/getCustomerById/${this.selectedCustomer}`
      )
        .then((response) => response.json())
        .then((result) => {
          this.CustomerName = result.name;
          this.CustomerLoyaltyPoints = result.loyaltyPoints;
        })
        .catch((err) => console.log(err));
    }
  }

  placeOrder() {
    if (this.selectedCustomer && this.getTotalPrice() > 0 && this.ItemDetails.length > 0) {
      fetch("http://localhost:8080/order/saveOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: this.selectedCustomer,
          customerName: this.CustomerName,
          itemDetails: this.ItemDetails,
          status: "Pending",
          totalAmount: this.getTotalPrice(),
          orderDate: new Date().toISOString().split('T')[0]
        })
      })
        .then(response => response.text())
        .then(result => {
          if (result === "true") {
            this.ItemDetails.forEach(detail => {
              fetch(`http://localhost:8080/mos/items/getCurrentQty/${detail.itemId}`)
                .then(res => res.json())
                .then(item => {
                  console.log(item);
                  const newQty = item - detail.quantity;
                  console.log(newQty);

                  fetch(`http://localhost:8080/mos/items/updateItemQty/${detail.itemId}/${newQty}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                  });
                });
            });
            Swal.fire("Success", "Order placed!", "success").then(() => {
              const requestOptions = {
                method: "PUT",
                redirect: "follow" as RequestRedirect
              };
              
              fetch(`http://localhost:8080/mos/customer/updateCustomerPoints/${this.selectedCustomer}/${(this.ItemDetails.length*10)}`, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
              this.cartItems = [];
              this.ItemDetails = [];
              this.fetchByCategory(this.activeCategory);
              this.loadCustomerIds();
              this.getCustomerDetails();
            });
          } else {
            Swal.fire("Error", "Order failed!", "error");
          }
        })
        .catch(() => Swal.fire("Error", "Something went wrong!", "error"));
    } else {
      Swal.fire("Error", "Check your details!", "error");
    }
  }


}
