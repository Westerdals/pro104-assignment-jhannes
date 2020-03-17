function handleSubmitProduct(event) {
    event.preventDefault();

    const name = document.querySelector("[name='name']").value;
    const price = document.querySelector("[name='price']").value;
    const description = document.querySelector("[name='description']").value;

    const product = {name, price, description};

    const productList = readLocalStorageList("productList");
    product.id = productList.length;
    productList.push(product);
    window.localStorage.setItem("productList", JSON.stringify(productList));

    event.target.reset();
}

function handleClickProduct(event, id) {
    const shoppingCart = readLocalStorageObject("shoppingCart");
    if (!shoppingCart[id]) {
        shoppingCart[id] = 0;
    }
    shoppingCart[id] += 1;
    window.localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    renderShoppingCart();
}


function renderProductList() {
    const productListEl = document.getElementById("productList");

    for (const product of readLocalStorageList("productList")) {
        const {id, name, price, description} = product;

        const productEl = document.createElement("div");
        productEl.innerHTML = `<h4>${name}</h4>
            <div><button onclick="handleClickProduct(event, ${id})">Add to shopping cart</button></div>
            <div>${description}</div>`

        productListEl.appendChild(productEl);
    }
}

function renderShoppingCart() {
    const shoppingCartEl = document.getElementById("shoppingCart");
    shoppingCartEl.innerHTML = "";

    const productList = readLocalStorageList("productList");
    const shoppingCart = readLocalStorageObject("shoppingCart");
    for (const id in shoppingCart) {
        
        const product = productList.find(p => p.id == id);

        const {name, price} = product;
        const quantity = shoppingCart[id];

        const orderLine = document.createElement("div");
        orderLine.innerHTML = `<div>${quantity} x ${name} = ${price * quantity}</div>`

        shoppingCartEl.appendChild(orderLine);
    }
}


function readLocalStorageList(key) {
    return JSON.parse(window.localStorage.getItem(key)) || new Array();
}

function readLocalStorageObject(key) {
    return JSON.parse(window.localStorage.getItem(key)) || new Object();
}
