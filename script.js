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

fetch("https://fakestoreapi.in/api/products/category?type=mobile")
    .then((response) => response.json())
    .then((resp) => {
        products= resp.products.filter((product) => product.brand === "apple").sort((a, b) => a.price - b.price);
        products.forEach((producto) => {
            const card = `
                <div class="card">
                    <img src="${producto.image}" alt="${producto.title}" />
                    <h3>${producto.title.slice(6)}</h3>                    
                    <p>Precio: $${producto.price}</p>
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
            description: card.querySelector("p").innerText,
        };

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));

        console.log("Producto añadido al carrito:", carrito);
    }
});
