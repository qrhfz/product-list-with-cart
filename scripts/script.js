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
const { div, picture, source, img, button, b } = van.tags;

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
    return div({class:"product-card"},
        picture(
            source({ media: "(min-width: 800px)", srcset: product.image.desktop }),
            source({ media: "(min-width: 480px)", srcset: product.image.tablet }),
            img({ src: product.image.mobile, alt: product.name }),
        ),
        div(
            {class:"add-to-cart-btn-wrapper"},
            ProductCardButton(product.name),
        ),
        div(product.category),
        div({class:"txt-3"}, product.name),
        div({class:"txt-3"},`$${product.price}`),
    )
}

/**
 * 
 * @param {string} name 
 */
function ProductCardButton(name) {
    return () => {
        if (cartData.items.val.get(name)) {
            return div({class:"active-add-to-cart-btn-group"},
                button({
                    class:"minus-btn",
                    onclick: () => {
                        cartData.reduceItem(name);
                    }
                }, "-"),
                div(b(cartData.items.val.get(name))),
                button({
                    class:"plus-btn",
                    onclick: () => {
                        cartData.addItem(name);
                    }
                }, "+"),
            )
        } else {
            return button({
                class : "add-to-cart-btn",
                onclick: () => {
                    cartData.addItem(name)
                }
            }, b("Add to Cart"))
        }
    }
}