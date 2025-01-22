// @ts-check
import van from "./van-1.5.3.min.js";

/**
 * @import * as Van from  "./van-1.5.3.min.js"
 */


/**
 * @typedef {object} Product
 * @property {object} image
 * @property {string} image.thumbnail
 * @property {string} image.mobile
 * @property {string} image.tablet
 * @property {string} image.desktop
 * @property {string} name
 * @property {string} category
 * @property {number} price
 */

class ProductListData {
    constructor() {
        /** @type {Van.State<Map<string, Product>>} */
        this.products = van.state(new Map());
    }

    async load() {
        /** @type {Product[]} */
        const response = await fetch("/data.json").then(res => res.json());
        /** @type {Map<string, Product>} */
        const products = new Map();

        for (const product of response) {
            products.set(product.name, product);
        }
        this.products.val = products;
    }
}


class CartData {
    constructor() {
        /** @type {Van.State<Map<string, number>>} */
        this.items = van.state(new Map());
    }

    /**
     * @param {string} name 
     */
    addItem(name, modifier = 1) {
        const newItems = new Map(this.items.val);
        const oldItemCount = newItems.get(name);
        newItems.set(name, oldItemCount ? oldItemCount + modifier : 1);
        this.items.val = newItems;
    }

    /**
     * @param {string} name 
     */
    reduceItem(name) {
        this.addItem(name, -1);
    }
}
const productListData = new ProductListData();
productListData.load();
const cartData = new CartData();
const { div, picture, source, img, button, input } = van.tags;

// @ts-ignore
van.add(document.querySelector("#product-list"), ProductList())


function ProductList() {
    return () => {
        const productListContainer = div()

        for (const [_, product] of productListData.products.val) {
            van.add(productListContainer, ProductCard(product))
        }

        return productListContainer;
    };
}

/**
 * 
 * @param {Product} product 
 */
function ProductCard(product) {
    return div(
        picture(
            source({ media: "(min-width: 800px)", srcset: product.image.desktop }),
            source({ media: "(min-width: 480px)", srcset: product.image.tablet }),
            img({ src: product.image.mobile, alt: product.name }),
        ),
        ProductCardButton(product.name),
        div(product.category),
        div(product.name),
        div(`$${product.price}`),
    )
}

/**
 * 
 * @param {string} name 
 */
function ProductCardButton(name) {
    return () => {
        if (cartData.items.val.get(name)) {
            return div(
                button({
                    onclick: () => {
                        cartData.reduceItem(name);
                    }
                }, "-"),
                div(cartData.items.val.get(name)),
                button({
                    onclick: () => {
                        cartData.addItem(name);
                    }
                }, "+"),
            )
        } else {
            return button({
                onclick: () => {
                    cartData.addItem(name)
                }
            }, "Add to Cart")
        }
    }
}