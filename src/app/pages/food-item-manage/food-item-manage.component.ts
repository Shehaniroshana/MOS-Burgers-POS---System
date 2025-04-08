import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';
import { InventoryStatusComponent } from "../inventory-status/inventory-status.component";
import { BestItemsComponent } from "../best-items/best-items.component";

@Component({
  selector: 'app-food-item-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, InventoryStatusComponent, BestItemsComponent],
  templateUrl: './food-item-manage.component.html',
  styleUrl: './food-item-manage.component.css'
})
export class FoodItemManageComponent {
  date: string = new Date().toDateString();

  items: any[] = [];

  searchTerm: string = '';

  selectedCategory: string = '';

  categories: string[] = ['Burgers', 'Submarines', 'Fries', 'Pasta', 'Chicken', 'Beverages'];

  totalItems: number = 0;
  totalStockQuantity: number = 0;
  averagePrice: number = 0;
  image = '';

  private searchSubject: Subject<string> = new Subject();

  constructor() {
    this.loadAllItems();
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.performSearch();
    });

  }

  private updateComputedValues(): void {
    this.totalItems = this.items.length;
    this.totalStockQuantity = this.items.reduce((sum: number, item: any) => sum + item.qty, 0);
    this.averagePrice = this.items.length
      ? this.items.reduce((sum: number, item: any) => sum + item.price, 0) / this.items.length
      : 0;
  }

  loadAllItems(): void {
    const apiUrl = 'http://localhost:8080/mos/items/getAllItems';
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch items. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.items = data;
        this.updateComputedValues();
        console.log('Loaded items:', this.items);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        Swal.fire('Error!', 'Failed to load items. Please try again.', 'error');
      });
  }

  searchItems(): void {
    this.searchSubject.next(this.searchTerm);
  }


  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filterByCategory();
      return;
    }

    const apiUrl = `http://localhost:8080/mos/items/searchItem/${this.searchTerm}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to search items. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.items = data;
        this.updateComputedValues(); // Update computed values after searching
        console.log(`Searched items for "${this.searchTerm}":`, this.items);
      })
      .catch((error) => {
        console.error('Error searching items:', error);
        Swal.fire('Error!', 'Failed to search items. Please try again.', 'error');
      });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.loadAllItems();
      return;
    }

    const apiUrl = `http://localhost:8080/mos/items/searchItemByCategory/${this.selectedCategory}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to filter items by category. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.items = data;
        this.updateComputedValues();
        console.log(`Filtered items for category "${this.selectedCategory}":`, this.items);
      })
      .catch((error) => {
        console.error('Error filtering items by category:', error);
        Swal.fire('Error!', 'Failed to filter items by category. Please try again.', 'error');
      });
  }



  addItem() {
    Swal.fire({
      title: 'Add Item',
      html: `
      <div class="bg-slate-800">
        <input type="text" id="name" placeholder="Item Name"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <select id="category"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 text-gray-300 shadow-black shadow-2xl focus:outline-none">
          <option value="" disabled selected>Select Category</option>
          <option value="Burgers">Burgers</option>
          <option value="Submarines">Submarines</option>
          <option value="Fries">Fries</option>
          <option value="Pasta">Pasta</option>
          <option value="Chicken">Chicken</option>
          <option value="Beverages">Beverages</option>
        </select>

        <input type="text" id="description" placeholder="Description"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="price" placeholder="Price"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="discount" placeholder="Discount"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="qty" placeholder="Quantity"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <div class="relative w-full mt-2 mb-4">
          <input type="file" id="fileInput" class="hidden rounded-xl">
          <label for="fileInput" class="cursor-pointer bg-slate-950 text-white px-5 py-3 rounded-2xl ">
            Select Image
          </label>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const category = (document.getElementById('category') as HTMLSelectElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const price = (document.getElementById('price') as HTMLInputElement).value;
        const discount = (document.getElementById('discount') as HTMLInputElement).value;
        const qty = (document.getElementById('qty') as HTMLInputElement).value;
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        const file = fileInput.files?.[0];
        return { name, category, description, price, discount, qty, file };
      }
    }).then((result) => {
      if (result.isConfirmed) {

        if (result.value.name == '' || result.value.category == '' || result.value.description == '' || result.value.price == '' || result.value.discount == '' || result.value.qty == '' || result.value.file == null) {
          Swal.fire('Error!', 'Please fill in all fields.', 'error');
          return;
        } else {

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            "name": result.value.name,
            "price": Number(result.value.price),
            "description": result.value.description,
            "qty": Number(result.value.qty),
            "imagePath": "img/" + result.value.file.name,
            "category": result.value.category,
            "discount": Number(result.value.discount)
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
          };

          fetch("http://localhost:8080/mos/items/saveItem", requestOptions)
            .then((response) => response.json())
            .then((result) => {

              if (result) {
                Swal.fire('Added!', 'Item added successfully.', 'success');
                this.loadAllItems();
              } else {
                Swal.fire('Error!', 'Failed to add item.', 'error');
              }
            })
            .catch((error) => console.error(error));
        }

      }
    });
  }


  updateItem(item: any): void {
    Swal.fire({
      title: 'Update Item',
      html: `
      <div class="bg-slate-800">
        <h2 class="p-2">Item ID #${item.id} </h2>
        <input type="text" id="name" placeholder="Item Name" value="${item.name}"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <select id="category"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 text-gray-300 shadow-black shadow-2xl focus:outline-none">
          <option value="" disabled selected>Select Category</option>
          <option value="Burgers" ${item.category == 'Burgers' ? "selected" : ''}>Burgers</option>
          <option value="Submarines"${item.category == 'Submarines' ? "selected" : ''}>Submarines</option>
          <option value="Fries" ${item.category == 'Fries' ? "selected" : ''}>Fries</option>
          <option value="Pasta" ${item.category == 'Pasta' ? "selected" : ''}>Pasta</option>
          <option value="Chicken" ${item.category == 'Chicken' ? "selected" : ''}>Chicken</option>
          <option value="Beverages" ${item.category == 'Beverages' ? "selected" : ''}>Beverages</option>
        </select>

        <input type="text" id="description" placeholder="Description" value="${item.description}"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="price" placeholder="Price" value="${item.price}"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="discount" placeholder="Discount" value="${item.discount}"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
        <input type="number" id="qty" placeholder="Quantity" value="${item.qty}"
          class="w-full p-3 rounded-lg mb-6 bg-slate-950 shadow-black shadow-2xl focus:outline-none">
        
       <div class="relative w-full mt-2 mb-4">
                    <input type="file" id="fileInput" class="hidden rounded-xl" >
                    <label for="fileInput" 
                        class="cursor-pointer bg-slate-950 text-white px-5 py-3 rounded-2xl hover:bg-slate-900 transition-colors">
                        ${item.imagePath ? 'Change Image' : 'Select Image'}
                    </label>
                </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Update Item',
      preConfirm: () => {
        return {
          name: (document.getElementById('name') as HTMLInputElement).value,
          category: (document.getElementById('category') as HTMLSelectElement).value,
          description: (document.getElementById('description') as HTMLInputElement).value,
          price: (document.getElementById('price') as HTMLInputElement).value,
          discount: (document.getElementById('discount') as HTMLInputElement).value,
          qty: (document.getElementById('qty') as HTMLInputElement).value,
          file: (document.getElementById('fileInput') as HTMLInputElement).files?.[0]
        };
      }
    }).then(result => {
      if (result.isConfirmed) {
        let image=result.value.file==undefined ? item.imagePath : `img/${result.value.file.name}`;
        if(result.value.name!='' && result.value.category!='' && result.value.description!='' && result.value.price!='' && result.value.discount!='' && result.value.qty >=0){
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          
          const raw = JSON.stringify({
            "id": item.id,
            "name": result.value.name,
            "price": result.value.price,
            "description": result.value.description,
            "qty": result.value.qty,
            "imagePath": image,
            "category": result.value.category,
            "discount":result.value.discount
          });
          
          const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow" as RequestRedirect
          };
          
          fetch("http://localhost:8080/mos/items/updateItem", requestOptions)
            .then((response) => response.text())
            .then((result) =>{
              if (result) {
                Swal.fire('Updated!', 'Item updated successfully.', 'success');
                this.loadAllItems();
              } else {
                Swal.fire('Error!', 'Failed to update item.', 'error');
              }
            })
            .catch((error) => console.error(error));
          
        }else{
          Swal.fire('Error!', 'Please fill in all fields.', 'error');
          return
        }
        
          

      }
    });
  }


  deleteItem(itemId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/mos/items/deleteItem/${itemId}`, {
          method: 'DELETE'
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete item #${itemId}`);
            }
            return response.json();
          })
          .then((success) => {
            if (success) {
              this.items = this.items.filter(item => item.id !== itemId);
              this.updateComputedValues();
              Swal.fire('Deleted!', `Item #${itemId} has been deleted.`, 'success');
            } else {
              Swal.fire('Error!', `Item #${itemId} not found.`, 'error');
            }
          })
          .catch((error) => {
            console.error('Error deleting item:', error);
            Swal.fire('Error!', 'Failed to delete item.', 'error');
          });
      }
    });
  }


  updateItemQuantity(itemId: number, currentQty: number): void {
    fetch(`http://localhost:8080/mos/items/getCurrentQty/${itemId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch quantity for item #${itemId}`);
        }
        return response.json();
      })
      .then((latestQty) => {
        Swal.fire({
          title: 'Update Item Quantity',
          text: `Enter quantity to add for item #${itemId} (Current: ${latestQty}):`,
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
            const newQty = latestQty + Number(value);
            if (newQty < 0) {
              return 'Quantity cannot be negative!';
            }
            return undefined;
          },
          customClass: {
            popup: 'swal2-dark'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const qtyToAdd = Number(result.value);
            const originalQty = latestQty;

            this.items = this.items.map(item =>
              item.id === itemId
                ? { ...item, qty: item.qty + qtyToAdd }
                : item
            );
            this.updateComputedValues();

            fetch(`http://localhost:8080/mos/items/updateItemQty/${itemId}/${qtyToAdd}`, {
              method: 'PUT'
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to update quantity for item #${itemId}`);
                }
                return response.json();
              })
              .then((success) => {
                if (success) {
                  Swal.fire('Updated!', `Quantity for item #${itemId} updated.`, 'success');
                } else {
                  // Rollback on failure
                  this.items = this.items.map(item =>
                    item.id === itemId
                      ? { ...item, qty: originalQty }
                      : item
                  );
                  this.updateComputedValues();
                  Swal.fire('Error!', `Item #${itemId} not found.`, 'error');
                }
              })
              .catch((error) => {
                this.items = this.items.map(item =>
                  item.id === itemId
                    ? { ...item, qty: originalQty }
                    : item
                );
                this.updateComputedValues();
                console.error('Error updating item quantity:', error);
                Swal.fire('Error!', `Failed to update quantity: ${error.message}`, 'error');
              });
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching current quantity:', error);
        Swal.fire('Error!', `Failed to fetch current quantity: ${error.message}`, 'error');
      });
  }
}