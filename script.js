document.querySelector("form").addEventListener("submit", (e) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Por favor, completa todos los campos del formulario.");
        e.preventDefault();
    }
});
const productsContainer = document.querySelector(".productos-container");
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const btnCart = document.getElementById("btnCart");

if (cart.length > 0) {
    btnCart.hidden = false;
}  

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
                        <button class="btn-description" data-id=${product.id}>Ver descripción</button>
                    </div>
                    <div class="card-price">                    
                    <p>Precio: $${product.price}</p>
                    </div>
                    <button class="btn-add-cart">Añadir al carrito</button>
                </div>
            `;
            productsContainer.innerHTML += card;
        });
    })
    .catch((error) => console.error("Error al obtener los productos:", error));

    
document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-cart")) {
        const card = e.target.closest(".card");
        const product = {
            title: card.querySelector("h3").innerText,
            price: card.querySelector("p").innerText,
        };

        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        btnCart.hidden = false;

        Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1500,
        });
    }
});

document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-description")) {
        const id = e.target.getAttribute("data-id"); // Captura el ID del botón

        const encontrado = products.find((product) => product.id == id); 

        if (encontrado) {
            // Actualiza el contenido del modal
            document.getElementById("productModalLabel").innerText = `Descripción de ${encontrado.model}`;
            document.getElementById("productDescription").innerText = encontrado.description;

            // Muestra el modal
            const productModal = new bootstrap.Modal(document.getElementById("productModal"));
            productModal.show();
        } else {
            alert("Producto no encontrado.");
        }
    }
});
const cartContainer = document.querySelector(".cart-container");
function openCart() {
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    document.getElementById("cartModalLabel").innerText = "Carrito de compras";
    cartContainer.innerHTML = "";
    cart.forEach((cart) => {
        let cartDetail = `
            <ul>
                <li>${cart.title}</li>
                <li>${cart.price}</li>
            <ul>
        `;
        cartContainer.innerHTML += cartDetail;
    });
    cartModal.show();
}

const btnUp = document.getElementById("btnUp");

window.addEventListener("scroll", () => {
  if (window.scrollY == 0) {
    btnUp.hidden = true;
  } else {
    btnUp.hidden = false;
  }
});

btnUp.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

