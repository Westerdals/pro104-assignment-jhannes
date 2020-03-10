// Declares a function with the name renderProductList which can be used other place in the code
function renderProductList() {
    // Retrieves the value of the localStorage item "productList" AS A STRING (text)
    const productListJSON = window.localStorage.getItem("productList");

    // Parse (interpret) the textual product list as objects
    let productList = JSON.parse(productListJSON);
    if (productList === null) {
        productList = [];
    }

    // Retrieve the <div id='productList'></div>
    const productListEl = document.getElementById("productList");

    // remove all the contents of the <div id='productList'></div
    productListEl.innerHTML = "";

    // In turn assign each product in productList to "product"
    for (const product of productList) {
        // Creates a new <div> that can be placed in the document - currently it's living in the air
        const productEl = document.createElement("div");

        // Object destructoring - we're taking product apart
        const {productId, name, image, price, description} = product;
        // This is the same as the following.
        //const name = product.name;
        //const image = product.image;
        //const price = product.price;

        function handleDragStart(event) {
            event.dataTransfer.setData("text/plain", productId);
        }

        // Ternary operator "? :" gives a conditional value
        const imageTag = (image ? `<div><img src='${image}' /></div>` : "");
        // It means the same as
        //let imageTag;
        //if (image) {
        //    imageTag = `<div><img src='${image}' /></div>`;
        //} else {
        //    imageTag = "";
        //}

        productEl.draggable = true;
        productEl.ondragstart = handleDragStart;

        // Replace the contents of the productEl
        productEl.innerHTML = `<h4>${name}</h4>
            <button onclick='handleClickAddToCart(event, ${productId})'>Add to cart</button>
            ${imageTag}
            <div>${description}</div>
            <div><small>Price: ${price}</small></div>`;

        // Finally add the <div> to the <div id="productList">
        productListEl.appendChild(productEl);
    }
}

function handleDragOverShoppingCart(event) {
    event.preventDefault();
}

function handleDropOnShoppingCart(event) {
    const productId = event.dataTransfer.getData("text/plain");
    addToCart(productId);
}

// declares a function handleClickAddToCart which is a event handler on button-onClick
function handleClickAddToCart(event, productId) {
    addToCart(productId);
}

function addToCart(productId) {
    // Retrieve the existing shopping cart from local storage and parse it
    const shoppingCart = JSON.parse(window.localStorage.getItem("shoppingCart")) || {};
    // Add the clicked product to shopping cart
    if (!shoppingCart[productId]) {
        shoppingCart[productId] = 0;
    }
    shoppingCart[productId] = shoppingCart[productId] + 1;

    // Save the shopping cart back to localStorage

    window.localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    // Display what's now the current shoppingCart from localStorage
    renderShoppingList();
}

// Declares a function renderShoppingList which renders the shopping cart from local storage
function renderShoppingList() {
    // Retrieve the existing shopping cart from local storage and parse it
    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    const shoppingList = JSON.parse(window.localStorage.getItem("shoppingCart")) || [];
    // Find the location to write the shopping cart <div id='items' />
    const shoppingListEl = document.getElementById("items");
    // Clears the current contents of the shopping cart <div>
    shoppingListEl.innerHTML = "";
    let totalPrice = 0;

    // For each item in the shopping cart
    for (const productId in shoppingList) {
        // Create a new <div> element
        const itemEl = document.createElement("div");
        const quantity = shoppingList[productId];
        const product = productList.find(p=>p.productId == productId);
        const {name, price} = product;
        const orderLinePrice = quantity * price;
        totalPrice += orderLinePrice;

        // Sets the contents to the name of the product
        itemEl.innerHTML = `${quantity} x ${name} = ${orderLinePrice}`;
        // Adds the <div> to the shopping cart <div id='items'>
        shoppingListEl.appendChild(itemEl);
    }

    const totalEl = document.createElement("div");
    totalEl.innerHTML = "Total price: " + totalPrice;
    shoppingListEl.appendChild(totalEl);
}

// declares a function createNewProduct with an parameter event
//  Event is a object with methods like
//    preventDefault (don't actually submit the form)
//  And properties like
//    target - the <form> that was submitted
function createNewProduct(event) {
    // Prevents browser for submitting page
    event.preventDefault();

    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    const productId = productList.length;

    // Finds <input name='name'> [propertyName='propertyValue']
    //   and gets the contents of the input field (value)
    const name = document.querySelector("[name='name']").value;
    // Ditto for <input name='price' />
    const price = document.querySelector("[name='price']").value;
    const description = document.querySelector("[name='description']").value;
    // Find the <input name='image' /> and get the data-image="..." attribute
    //  This is the image as "base64 encoded data url"
    const image = document.querySelector("[name='image']").dataset.image;

    // Creates a new object with properties taken from the variables with the same name
    /*const product = {
        name: name, price: price, description: description, image: image
    }
        // This is the same
    const product = new Object();
    product.name = name;
    product.price = price;
    */
    const product = {
        productId,
        name,
        price,
        description,
        image
    };

    // Adds the new product to the end of the list
    productList.push(product);
    window.localStorage.setItem("productList", JSON.stringify(productList));

    // event.target refers to the <form>, <form>.reset clear alls values
    event.target.reset();
    // Find the <div id="imagePreview"> and remove the contents
    const previewEl = document.getElementById("imagePreview");
    previewEl.innerHTML = "";
    // Also reset <input name='image' data-image attribute
    delete document.querySelector("[name='image']").dataset.image;
}

// Declared a function handleFileLoad with a parameter event
function handleFileSelect(event) {
    // Declares inner function handleFileLoad can only be executed from handleFileSelect
    function handleFileLoad(event) {
        // We confusingly have two variables both named event
        const previewEl = document.getElementById("imagePreview");
        // Set the contents of the <div id='imagePreview' /> to the image|
        previewEl.innerHTML = "<img src='" + event.target.result + "' height='150px' />";
        // Sets the <input type='file' data-image attibute
        document.querySelector("[name='image']").dataset.image = event.target.result;
    }

    // FileReader lets me look at the contents of a <input type='file' />
    const reader = new FileReader()
    // When the reader is done with what I'm about to tell it, call the function handleFileLoad
    reader.onload = handleFileLoad;
    // Reads the contents of the file as a data-url and calls handleFileLoad with event.target.result
    reader.readAsDataURL(event.target.files[0])
}
