// js/scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const addBtns = document.querySelectorAll('.add-btn');
  const cartCountSpan = document.getElementById('cart-count');
  const btnCarrito = document.getElementById('btn-carrito');
  const modal = document.getElementById('carrito-modal');
  const closeModal = document.getElementById('close-modal');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalP = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout');

  // inicializar contador
  updateCartCount();

  // agregar eventos a botones "Agregar"
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.menu-card');
      if (!card) return;
      const id = card.dataset.id;
      const nombre = card.dataset.nombre;
      const precio = parseFloat(card.dataset.precio);
      addToCart({id, nombre, precio});
    });
  });

  // mostrar modal carrito
  if (btnCarrito) btnCarrito.addEventListener('click', () => {
    renderCart();
    modal.style.display = 'flex';
  });

  if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');

  // checkout: simplemente abre mailto con resumen
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) { alert('Tu carrito está vacío.'); return; }
    let body = 'Hola,%0A%0AMe gustaría hacer el siguiente pedido:%0A%0A';
    let total = 0;
    cart.forEach(item => {
      body += `${item.nombre} x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}%0A`;
      total += item.precio * item.cantidad;
    });
    body += `%0ATotal: S/ ${total.toFixed(2)}%0A%0AGracias.`;
    window.location.href = `mailto:tu@correo.com?subject=Pedido%20Verde%20Vida&body=${body}`;
  });

  /* ===== funciones del carrito (localStorage) ===== */
  function getCart() {
    return JSON.parse(localStorage.getItem('veg_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('veg_cart', JSON.stringify(cart));
  }

  function addToCart(item) {
    const cart = getCart();
    const found = cart.find(i => i.id === item.id);
    if (found) found.cantidad += 1;
    else cart.push({...item, cantidad:1});
    saveCart(cart);
    updateCartCount();
    alert(`${item.nombre} agregado al carrito.`);
  }

  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.cantidad, 0);
    if (cartCountSpan) cartCountSpan.textContent = count;
  }

  function renderCart() {
    const cart = getCart();
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
      cartTotalP.textContent = 'Total: S/ 0.00';
      return;
    }
    let total = 0;
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-line';
      div.innerHTML = `<strong>${item.nombre}</strong> x${item.cantidad} - S/ ${(item.precio * item.cantidad).toFixed(2)}
        <button class="remove" data-id="${item.id}">Eliminar</button>`;
      cartItemsDiv.appendChild(div);
      total += item.precio * item.cantidad;
    });
    cartTotalP.textContent = `Total: S/ ${total.toFixed(2)}`;

    // remover items
    cartItemsDiv.querySelectorAll('.remove').forEach(b => {
      b.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        removeFromCart(id);
        renderCart();
        updateCartCount();
      });
    });
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
  }

  // cerrar modal al clickear fuera
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

});

/* Función para enviar mail desde contact form */
function enviarMail(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Consulta desde Verde Vida');
  const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
  window.location.href = `mailto:tu@correo.com?subject=${subject}&body=${body}`;
}
