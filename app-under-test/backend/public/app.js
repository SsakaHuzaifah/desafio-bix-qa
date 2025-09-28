const fmt = (n) => n.toFixed(2).replace(".", ",");

const state = {
  products: [],
  cart: {},
  user: null,
  token: localStorage.getItem("token"),
  appliedCoupon: null,
};

// Authentication functions
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      state.user = data.user;
      state.token = data.token;
      localStorage.setItem("token", data.token);
      updateAuthUI();
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert("Erro ao fazer login");
  }
}

async function logout() {
  try {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }

  state.user = null;
  state.token = null;
  localStorage.removeItem("token");
  updateAuthUI();
}

async function checkAuth() {
  if (!state.token) return;

  try {
    const res = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${state.token}` },
    });

    if (res.ok) {
      const data = await res.json();
      state.user = data.user;
    } else {
      state.token = null;
      localStorage.removeItem("token");
    }
  } catch (error) {
    state.token = null;
    localStorage.removeItem("token");
  }

  updateAuthUI();
}

function updateAuthUI() {
  const loginForm = document.getElementById("login-form");
  const userInfo = document.getElementById("user-info");
  const userName = document.getElementById("user-name");

  if (state.user) {
    loginForm.style.display = "none";
    userInfo.style.display = "block";
    userName.textContent = state.user.name;
  } else {
    loginForm.style.display = "block";
    userInfo.style.display = "none";
    userName.textContent = "";
  }
}

// Product functions
async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();
  state.products = data.items || [];
  renderProducts();
}

function renderProducts() {
  const ul = document.getElementById("product-list");
  ul.innerHTML = "";
  state.products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-info">
        <strong>${p.name}</strong> — R$ ${fmt(p.price)}
        <span class="stock">Estoque: ${p.stock}</span>
      </div>
      <div class="product-actions">
        <input type="number" min="1" max="${
          p.stock
        }" value="1" style="width:60px" id="qty-${p.id}" />
        <button data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
          ${p.stock === 0 ? "Sem estoque" : "Adicionar"}
        </button>
      </div>
    `;
    ul.appendChild(li);
  });

  // Remove existing listener and add new one
  ul.removeEventListener("click", handleProductClick);
  ul.addEventListener("click", handleProductClick);
}

function handleProductClick(e) {
  if (e.target.tagName === "BUTTON" && !e.target.disabled) {
    const id = Number(e.target.getAttribute("data-id"));
    const qty = Number(document.getElementById(`qty-${id}`).value || 1);
    addToCart(id, qty);
  }
}

function addToCart(id, qty) {
  const product = state.products.find((p) => p.id === id);
  if (!product || product.stock === 0) return;

  if (qty > product.stock) {
    alert(`Quantidade indisponível. Estoque: ${product.stock}`);
    return;
  }

  if (!state.cart[id]) state.cart[id] = 0;
  state.cart[id] += qty;

  // Don't allow more than available stock
  if (state.cart[id] > product.stock) {
    state.cart[id] = product.stock;
  }

  updateCartView();
  renderProducts(); // Re-render to update stock display
}

function updateCartView() {
  const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(state.cart).reduce((sum, [id, qty]) => {
    const p = state.products.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = fmt(subtotal);
  document.getElementById("subtotal").textContent = fmt(subtotal);

  updateFinalTotal();
}

// Coupon functions
async function applyCoupon() {
  const code = document.getElementById("coupon-code").value.trim();
  if (!code) {
    document.getElementById("coupon-message").textContent =
      "Digite um código de cupom";
    return;
  }

  try {
    const res = await fetch("/api/validate-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (data.valid) {
      state.appliedCoupon = data.coupon;
      document.getElementById(
        "coupon-message"
      ).textContent = `Cupom aplicado: ${data.coupon.code}`;
      document.getElementById("coupon-message").style.color = "green";
      updateFinalTotal();
    } else {
      state.appliedCoupon = null;
      document.getElementById("coupon-message").textContent = data.message;
      document.getElementById("coupon-message").style.color = "red";
      updateFinalTotal();
    }
  } catch (error) {
    document.getElementById("coupon-message").textContent =
      "Erro ao validar cupom";
    document.getElementById("coupon-message").style.color = "red";
  }
}

function updateFinalTotal() {
  const subtotal = parseFloat(
    document.getElementById("subtotal").textContent.replace(",", ".")
  );
  let discount = 0;

  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === "percentage") {
      discount = subtotal * (state.appliedCoupon.discount / 100);
    } else if (state.appliedCoupon.type === "fixed") {
      discount = Math.min(state.appliedCoupon.discount, subtotal);
    }
  }

  const total = subtotal - discount;

  document.getElementById("discount").textContent = fmt(discount);
  document.getElementById("final-total").textContent = fmt(total);

  if (discount > 0) {
    document.getElementById("discount-line").style.display = "block";
  } else {
    document.getElementById("discount-line").style.display = "none";
  }
}

// Checkout function
async function checkout() {
  if (!state.user) {
    alert("Faça login para finalizar a compra");
    return;
  }

  if (Object.keys(state.cart).length === 0) {
    alert("Adicione produtos ao carrinho");
    return;
  }

  const items = Object.entries(state.cart).map(([id, qty]) => ({
    id: Number(id),
    qty,
  }));

  const checkoutData = { items };
  if (state.appliedCoupon) {
    checkoutData.couponCode = state.appliedCoupon.code;
  }

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(checkoutData),
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("result").textContent = JSON.stringify(
        data,
        null,
        2
      );
      // Clear cart after successful checkout
      state.cart = {};
      state.appliedCoupon = null;
      document.getElementById("coupon-code").value = "";
      document.getElementById("coupon-message").textContent = "";
      updateCartView();
      renderProducts();
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert("Erro ao finalizar compra");
  }
}

// Event listeners
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document
  .getElementById("apply-coupon-btn")
  .addEventListener("click", applyCoupon);
document.getElementById("checkout-btn").addEventListener("click", checkout);

// Initialize
checkAuth();
loadProducts();
