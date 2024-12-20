//Declaración de variables globales
const productsContainer = document.querySelector(".productos-container");
const cartContainer = document.querySelector(".cart-container");
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const btnCart = document.getElementById("btnCart");
const btnUp = document.getElementById("btnUp");

//Verificar si hay productos en el carrito
if (cart.length > 0) {
    btnCart.hidden = false;
}  

//Función para obtener los productos
fetch("https://fakestoreapi.in/api/products/category?type=mobile")
    .then((response) => response.json())
    .then((resp) => {
        products= resp.products.filter((product) => product.brand === "apple").sort((a, b) => a.price - b.price);

        products.forEach((product) => {
            const card = `
                <div class="card">
                    <div class="card-image">
                       <img src="${product.image}" alt="${product.title}" />
                    </div>
                    <div class="card-title">
                        <h3>${product.title.slice(6)}</h3>
                    </div>
                    <div class="card-description">
                        <button class="btn-description" onclick="showDescription(this)" data-id=${product.id}>Ver descripción</button>
                    </div>
                    <div class="card-price">                    
                    <p>Precio: $${product.price}</p>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart(this.parentElement)" data-id="${product.id}">Añadir al carrito</button>
                </div>
            `;
            productsContainer.innerHTML += card;
        });
    })
    .catch((error) => console.error("Error al obtener los productos:", error));

   
/**
 * Agrega un producto al carrito de compras.
 * Si el producto ya existe en el carrito, incrementa su cantidad en 1.
 * De lo contrario, agrega el producto al carrito con una cantidad de 1.
 * Actualiza el contador de productos en el carrito y muestra un mensaje de éxito.
 * @param {Element} card - Contenedor del producto a agregar.
 */
function addToCart(card) {       
        const product = {
            id: card.querySelector("button").dataset.id,
            title: card.querySelector("h3").innerText,
            price: parseFloat(card.querySelector("p").innerText.replace('Precio: $', '')),
            quantity: 1
        };

        const existingProductIndex = cart.findIndex((item) => item.id == product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        btnCart.hidden = false;
        updateCartCount();

        Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1500,
        });
};

/**
 * Actualiza el contador de productos en el carrito en el botón "Ir al carrito" y
 * en el encabezado de la página.
 */
function updateCartCount() {
    let totalQuantity = 0;

    cart.forEach((item) => {
        totalQuantity += item.quantity;
    });
    document.getElementById("cart-count").innerText = totalQuantity;
    document.getElementById("cart-count-header").innerText = totalQuantity;
}

document.addEventListener("DOMContentLoaded", updateCartCount);

/**
 * Muestra la descripción de un producto en un modal.
 * @param {Element} btn - Botón que contiene el ID del producto.
 */
function showDescription(btn) {
        const id = btn.dataset.id;
        const encontrado = products.find((product) => product.id == id); 

        if (encontrado) {
            document.getElementById("productModalLabel").innerText = `Descripción de ${encontrado.model}`;
            document.getElementById("productDescription").innerText = encontrado.description;

            const productModal = new bootstrap.Modal(document.getElementById("productModal"));
            productModal.show();
        } else {
           Swal.fire({
                icon: "error",
                title: "Error al cargar la descripción",
                showConfirmButton: false,
                timer: 1500,
            });
        }
};

/**
 * Abre el modal del carrito de compras y muestra el contenido
 * del carrito con los productos agregados.
 */
function openCart() {
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    document.getElementById("cartModalLabel").innerText = "Carrito de compras";
    cartContainer.innerHTML = "";

    let total = 0; 
    cart.forEach((item, index) => {
        let cartDetail = `
            <div class="cart-item">
                <p>${item.title}</p>
                <p>$${item.price}</p>
                <input type="number" class="item-quantity" data-index="${index}" value="${item.quantity}" min="1">
                <button class="btn-update-quantity" data-index="${index}">Actualizar</button>
            </div>
        `;
        cartContainer.innerHTML += cartDetail;
        total += item.price * item.quantity;
    });
    const totalPrice = `<p>Total: $${total.toFixed(2)}</p>`;
    cartContainer.innerHTML += totalPrice;
    cartModal.show();
}

document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-update-quantity")) {
        const index = e.target.getAttribute("data-index");
        const newQuantity = parseInt(document.querySelector(`.item-quantity[data-index="${index}"]`).value);

        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            openCart();
        }
    }
});

// Cerrar el carrito y actualizar el conteo
document.getElementById("update-cart").addEventListener("click", () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    const cartModal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
    cartModal.hide();
});

/**
 * Limpia el carrito de compras eliminando todos los productos del carrito.
 * Establece el botón "Ir al carrito" y el enlace "Carrito" en el menú superior en hidden.
 * Actualiza el conteo de productos en el carrito en el botón "Ir al carrito" y en el encabezado de la página.
 */
function clearCart(){
    localStorage.removeItem("cart");
    cart = [];
    btnCart.hidden = true;
    navcart.hidden = true;
    updateCartCount();
    Swal.fire({
        icon: "success",
        title: "Carrito vaciado",
        showConfirmButton: false,
        timer: 1500,
    })
}

// Configurar la visibilidad de los botones
window.addEventListener("scroll", () => {
    const isAtTop = window.scrollY === 0;
    const isAtDown = window.scrollY > 0;
    const isCartEmpty = cart.length === 0;

    btnUp.hidden = isAtTop;
    btnCart.hidden = isAtTop || isCartEmpty;
    navcart.hidden = isAtDown || isCartEmpty;
});


btnUp.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

/**
 * Valida los campos del formulario de contacto.
 * Muestra un mensaje de error con sweetalert2 si hay campos vacíos.
 * @returns {boolean} false si hay campos vacíos, true en caso contrario.
 */
function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        Swal.fire({
            icon: "error",
            title: "Todos los campos son obligatorios",
            showConfirmButton: false,
            timer: 1500,
        })
        return false;     
    }
    return true;
}
