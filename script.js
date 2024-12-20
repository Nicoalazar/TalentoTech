document.querySelector("form").addEventListener("submit", (e) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        alert("Por favor, completa todos los campos del formulario.");
        e.preventDefault();
    }
});
const productosContainer = document.querySelector(".productos-container");
let products = [];

fetch("https://fakestoreapi.in/api/products/category?type=mobile")
    .then((response) => response.json())
    .then((resp) => {
        products= resp.products.filter((product) => product.brand === "apple").sort((a, b) => a.price - b.price);

        products.forEach((producto) => {
            const card = `
                <div class="card">
                    <div class="card-image">
                       <img src="${producto.image}" alt="${producto.title}" />
                    </div>
                    <div class="card-title">
                        <h3>${producto.title.slice(6)}</h3>
                    </div>
                    <div class="card-description">
                        <button class="btn-description" data-id=${producto.id}>Ver descripción</button>
                    </div>
                    <div class="card-price">                    
                    <p>Precio: $${producto.price}</p>
                    </div>
                    <button class="btn-add-cart">Añadir al carrito</button>
                </div>
            `;
            productosContainer.innerHTML += card;
        });
    })
    .catch((error) => console.error("Error al obtener los productos:", error));

document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-cart")) {
        const card = e.target.closest(".card");
        const producto = {
            title: card.querySelector("h3").innerText,
            price: card.querySelector("p").innerText,
        };

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));

        console.log("Producto añadido al carrito:", carrito);
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

const btnUp = document.getElementById("btnUp");

window.addEventListener("scroll", () => {
  if (window.scrollY == 0) {
    // Scroll hacia arriba: muestra la barra
    btnUp.hidden = true;
  } else {
    // Scroll hacia abajo: oculta la barra
    btnUp.hidden = false; // Ajusta el valor según la altura de tu navbar
  }
  lastScrollY = window.scrollY;
});

btnUp.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

