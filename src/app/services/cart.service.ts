import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItem.length > 0){

      // find the item in the cart based on item id

      /*
      for(let tempCartItem of this.cartItem){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }
      */

     // or

     existingCartItem = this.cartItem.find( tempCartItem => tempCartItem.id === theCartItem.id );

      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined );

    }

    if(alreadyExistsInCart){

      // increment the quantity
      existingCartItem.quantity++;
    }
    else{
      // just add the item to the array
      this.cartItem.push(theCartItem);
    }

    // compute cart totla price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {

      let totalPriceValue: number =0;
      let totalQuantityValue: number = 0;

      for(let currentCartItem of this.cartItem){
        totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
        totalQuantityValue += currentCartItem.quantity;
      }

      // publish the new values ... all subscribers will receive the new data
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

      // log cart data just for debugging purposes
      this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`);
    for(let tempCartItems of this.cartItem){
      const subTotalPrice = tempCartItems.quantity * tempCartItems.unitPrice;
      console.log(`name: ${tempCartItems.name}, quantity= ${tempCartItems.quantity}, 
              unitPrice= ${tempCartItems.unitPrice}, subTotalPrice= ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('------------');
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    
    // get index of item in the array
    const itemIndex = this.cartItem.findIndex( tempCartItem => tempCartItem == theCartItem );

    // if found, remove the item from the array at the given index 
    if(itemIndex > -1){
      this.cartItem.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
