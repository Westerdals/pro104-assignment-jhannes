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
        const { name, image, price, description } = product;
        // This is the same as the following.
        //const name = product.name;
        //const image = product.image;
        //const price = product.price;

        // Ternary operator "? :" gives a conditional value
        const imageTag = (image ? `<div><img src='${image}' /></div>` : "");
        // It means the same as
        //let imageTag;
        //if (image) {
        //    imageTag = `<div><img src='${image}' /></div>`;
        //} else {
        //    imageTag = "";
        //}

        // Replace the contents of the productEl
        productEl.innerHTML = `<h4>${product.name}</h4>
            ${imageTag}
            <div>${description}</div>
            <div><small>Price: ${price}</small></div>`;

        // Finally add the <div> to the <div id="productList">
        productListEl.appendChild(productEl);
    }   
}

function createNewProduct(event) {
    event.preventDefault();
 
    const name = document.querySelector("[name='name']").value;
    const price = document.querySelector("[name='price']").value;
    const description = document.querySelector("[name='description']").value;
    const image = document.querySelector("[name='image']").dataset.image;

    const product = {name, price, description, image};

    const productList = JSON.parse(window.localStorage.getItem("productList")) || [];
    productList.push(product);
    window.localStorage.setItem("productList", JSON.stringify(productList));
    renderProductList();

    event.target.reset();
    const previewEl = document.getElementById("imagePreview");
    previewEl.innerHTML = "";
}



function handleFileSelect(event) {
    function handleFileLoad(event) {
        const previewEl = document.getElementById("imagePreview");
        previewEl.innerHTML = "<img src='" + event.target.result + "' height='150px' />";
        document.querySelector("[name='image']").dataset.image = event.target.result;
    }

    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsDataURL(event.target.files[0])
}
