import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { ProductConsumer } from "../context";

export default class ProductList extends Component {
  render() {
    // console.log(this.state.products);
    return (
      <React.Fragment>
        <div className="py-5 mx-3">
          <div className="container">
            <Title name="our" title="products" />

            {/* <Product /> */}
            <div className="row">
              <ProductConsumer>
                {value => {
                  return value.products.map(item => {
                    return <Product key={item.id} product={item} />;
                  });
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
