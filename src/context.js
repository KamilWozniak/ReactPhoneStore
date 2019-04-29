import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();
//provider
//consumer

class ProductProvider extends Component {
  state = {
    products: [], //we cannot set "products: storeProducts" because then, each time we change eg. inCart property in the state, we will change also values in original storeProducts array (that's because, in that case we would pass object by reference, not by value. Need to make separate function that copies values of objects in storeProducts array, not the references >>>setProducts function <<<<<)
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0
  };

  componentDidMount() {
    this.setProducts();
  }
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  getItem = id => {
    const tempProduct = this.state.products.find(item => item.id === id);

    return tempProduct;
  };

  handleDetail = id => {
    const product = this.getItem(id);

    this.setState(() => {
      return {
        detailProduct: product
      };
    });
  };
  addToCart = id => {
    let tempProducts = [...this.state.products]; // all this mess with "index" supposed to be a solution for keeping the order of items in the "products" in the state, however i do not see any difference using simple getItem function...
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true; //in my opinion here we acces original "products" from the state because doing a destructurisation in the first line of the function we create a array of references to the original objects in the state. Because of that, changing an inCar attribute of "product" variable, is equal to setting the inCar property of the original object...
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(
      () => {
        return {
          products: tempProducts, //in my opinion this is unnecessary
          cart: [...this.state.cart, product]
        };
      },
      () => {
        this.addTotals();
      }
    );
    // const item = this.getItem(id);
    // item.inCart = true;
    // item.count = 1;
    // const price = item.price;
    // item.total = price;
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };

  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = id => {
    const product = this.getItem(id); //in the tutorial the guy still uses method with "const index" variable. Here I don't do that
    product.count += 1;
    product.total = product.count * product.price;
    this.addTotals();
  };

  decrement = id => {
    const product = this.getItem(id);
    product.count -= 1;
    product.total = product.count * product.price;
    if (product.count < 1) {
      this.removeItem(id);
    }
    this.addTotals();
  };

  removeItem = id => {
    // let tempProdcts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    // const index = tempProdcts.indexOf(this.getItem(id));
    // let removedProduct = tempProdcts[index];
    // removedProduct.inCart = false;
    // removedProduct.count = 0;
    // removedProduct.total = 0;

    const removedProduct = this.getItem(id);
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;
    console.log(tempCart);

    this.setState(() => {
      return {
        // cart: [...tempCart] // i think that this is unnecessary
        // products: [...tempProducts]
        cart: tempCart
      };
    }, this.addTotals());
  };

  clearCart = () => {
    this.setState(
      () => {
        return {
          cart: []
        };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => (subTotal += item.total));
    const tempTax = subTotal * 0.23;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer }; //product provider is going to the index.js
//productConsumer is going to be everywhere it needs to be
