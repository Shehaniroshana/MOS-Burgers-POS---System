import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlaceorderComponent } from './pages/placeorder/placeorder.component';
import { ManageOrderComponent } from './pages/manage-order/manage-order.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { FoodItemManageComponent } from './pages/food-item-manage/food-item-manage.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignInFormComponent } from './pages/sign-in-form/sign-in-form.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';

export const routes: Routes = [


  {
    path: "",
    component:SignInComponent,
    children:[
      {
        path:"",
        component:SignInFormComponent
      },
      {
        path:"register",
        component:RegisterFormComponent
      }
    ]
  },
  {
    path: 'navbar',
    component: NavbarComponent, 
    children: [
      {
        path: "",
        component: DashboardComponent 
      },
      {
        path: "placeorder",
        component: PlaceorderComponent
      },
      {
        path: "orders",
        component: ManageOrderComponent
      },
      {
        path: "customer",
        component: CustomerComponent
      },
      {
        path: "food-item-manage",
        component: FoodItemManageComponent
      }
    ]
  }
];
