// Productos
const products = [
    { id: 1, name: 'Camiseta Dry-Fit Pro', price: 12000, img: 'img/camiseta1.jpg', desc: 'Tejido transpirable.' },
    { id: 4, name: 'Camiseta Manga Larga', price: 15000, img: 'img/camiseta2.jpg', desc: 'Protección UV.' },
    { id: 5, name: 'Polera Running Light', price: 10000, img: 'img/camiseta3.jpg', desc: 'Ultra liviana.' },
    { id: 2, name: 'Pantalón Sport Flex', price: 17000, img: 'img/pantalon1.jpg', desc: 'Máxima movilidad.' },
    { id: 6, name: 'Pantalón Jogger', price: 17000, img: 'img/pantalon2.jpg', desc: 'Suavidad y abrigo.' },
    { id: 7, name: 'Short Deportivo', price: 13000, img: 'img/pantalon3.jpg', desc: 'Tela técnica.' },
    { id: 3, name: 'Mochila Entrenamiento', price: 28000, img: 'img/mochila1.jpg', desc: 'Impermeable.' },
    { id: 8, name: 'Mancuerna 2 Kilos', price: 8000, img: 'img/mancuerna.jpg', desc: 'Vinilo antideslizante.' },
    { id: 9, name: 'Mat de Yoga Premium', price: 16000, img: 'img/yogamat.jpg', desc: 'Alta densidad.' }
];


let auth0 = null;
let cart = JSON.parse(sessionStorage.getItem('sportyCart')) || [];

// Configuracion de auth0
const configureClient = async () => {
    console.log("Iniciando configuración de Auth0...");
    
    // Esperar si el script aún no carga (hasta 5 segundos)
    let retries = 10;
    while (typeof window.createAuth0Client === 'undefined' && retries > 0) {
        await new Promise(res => setTimeout(res, 500));
        retries--;
    }

    const createClient = window.createAuth0Client || (window.auth0 && window.auth0.createAuth0Client);

    if (createClient) {
        try {
            auth0 = await createClient({
                domain: "dev-bsh856wchokp1y3r.us.auth0.com",
                client_id: "A6WIpde3F2ceMjUuCkuneHvqpLTOYNjn",
                authorizationParams: {
                    // informacion desde el dashboard de auth0.
                    redirect_uri: "http://127.0.0.1:5500" 
                }
            });
            console.log("¡Auth0 configurado con éxito!");
        } catch (err) {
            console.error("Error al crear el cliente de Auth0:", err);
        }
    } else {
        console.error("Error crítico: No se encontró el SDK de Auth0. Revisar index.html.");
    }
};

window.onload = async () => {
    renderProducts();
    updateCartUI();

    await configureClient();

    if (!auth0) return;

    // Manejar el regreso desde el login de Auth0
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
        try {
            await auth0.handleRedirectCallback();
            // Limpia la URL de los parámetros de Auth0
            window.history.replaceState({}, document.title, "/");
        } catch (err) {
            console.error("Error manejando el callback:", err);
        }
    }

    // Actualizar interfaz según el estado de autenticación
    updateAuthUI();
};

// interfaz de usuario 
async function updateAuthUI() {
    if (!auth0) return;
    
    const isAuthenticated = await auth0.isAuthenticated();
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const welcomeEl = document.getElementById('user-welcome');

    if (isAuthenticated) {
        const user = await auth0.getUser();
        if (welcomeEl) welcomeEl.innerText = `Hola, ${user.name} | `;
        btnLogin?.classList.add('hidden');
        btnLogout?.classList.remove('hidden');
    } else {
        if (welcomeEl) welcomeEl.innerText = "";
        btnLogin?.classList.remove('hidden');
        btnLogout?.classList.add('hidden');
    }
}

// funciones de carrito como agregar, actualizar y eliminar productos, y guardar en sessionStorage.
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <p><strong>$${p.price.toLocaleString()}</strong></p>
                <button onclick="addToCart(${p.id})">Agregar</button>
            </div>`;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCartUI();
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const paymentForm = document.getElementById('payment-form');
    
    if (!list || !totalEl) return;

    list.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `<li>${item.name} - $${item.price.toLocaleString()} <button onclick="removeFromCart(${index})">x</button></li>`;
    });

    totalEl.innerText = total.toLocaleString();
    sessionStorage.setItem('sportyCart', JSON.stringify(cart));
    
    if (cart.length > 0) paymentForm?.classList.remove('hidden');
    else paymentForm?.classList.add('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

//  botones de pago 
document.getElementById('btn-login').onclick = async () => {
    if (auth0) {
        console.log("Redirigiendo a Auth0...");
        await auth0.loginWithRedirect();
    } else {
        alert("El sistema de autenticación no está listo. Reintenta en un momento.");
    }
};

document.getElementById('btn-logout').onclick = () => {
    auth0.logout({
        logoutParams: { returnTo: "http://127.0.0.1:5500" }
    });
};

document.getElementById('payment-form').onsubmit = (e) => {
    e.preventDefault();
    document.getElementById('app-content').classList.add('hidden');
    document.getElementById('confirmation-screen').classList.remove('hidden');
    
    const name = document.getElementById('full-name').value;
    document.getElementById('order-details').innerHTML = `
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Total:</strong> $${document.getElementById('cart-total').innerText}</p>
    `;
    cart = [];
    sessionStorage.removeItem('sportyCart');
};