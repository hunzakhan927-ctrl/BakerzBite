document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // HELPERS
    // =========================
    const money = n => "Rs. " + Number(n).toLocaleString("en-US");

    // =========================
    // FOOTER YEAR
    // =========================
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // =========================
    // BACK TO TOP + SCROLL PROGRESS
    // =========================
    const t = document.getElementById("top");
    const progress = document.getElementById("progress");

    window.addEventListener("scroll", () => {
        if (t) t.style.display = window.scrollY > 400 ? "block" : "none";

        if (progress) {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
        }
    });

    if (t) {
        t.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // =========================
    // ACTIVE NAVIGATION LINK
    // =========================
    const path = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link").forEach(a => {
        if (a.getAttribute("href") === path) a.classList.add("active");
    });

    // =========================
    // MENU PAGE ONLY (agar #grid na ho to yahin ruk jao)
    // =========================
    const grid = document.getElementById("grid");
    if (!grid) return;

    // Price number hai (string nahi) taake filter aur cart sahi chalein.
    // Category sirf yeh honi chahiye: cakes, pastries, cookies, pies, beverages
    const items = [
        {
            name: "Cocoa Luxe",
            category: "cakes",
            price: 2400,
            image: "./images/sig cake.png",
            description: "A rich and delicious chocolate cake made with soft chocolate sponge and creamy chocolate frosting.",
            ingredients: "Flour, cocoa powder, sugar, eggs, butter, milk and chocolate."
        },
        {
            name: "White Temptation",
            category: "cakes",
            price: 2200,
            image: "./images/Elegant White Cake with Chocolate Accents - Copy.png",
            description: "A soft vanilla cake perfect for birthdays, celebrations and special occasions.",
            ingredients: "Flour, vanilla, sugar, eggs, butter, milk and cream."
        },
        {
            name: "Pistachio Crunch",
            category: "pastries",
            price: 450,
            image: "./images/Pistachio Crunch Croissant Delight (1).png",
            description: "A golden, flaky French-style croissant baked fresh with rich buttery layers.",
            ingredients: "Flour, butter, milk, yeast, sugar, pistachio and salt."
        },
        {
            name: "Glossy Berry Cheesecake",
            category: "pies",
            price: 500,
            image: "./images/Glossy Berry Cheesecake Slice.png",
            description: "A creamy berry cheesecake topped with a glossy berry layer for a sweet and fruity finish.",
            ingredients: "Cream cheese, berries, sugar, biscuits, butter, eggs and cream."
        },
        {
            name: "Golden Elan Croissant",
            category: "pastries",
            price: 300,
            image: "./images/golden elan croissant.png",
            description: "A golden, crisp croissant with delicate buttery layers, freshly baked for a delightful treat.",
            ingredients: "Flour, butter, milk, yeast, sugar and salt."
        },
        {
            name: "Luxe Bomboloni",
            category: "cookies",
            price: 350,
            image: "./images/luxe bamboloni.png",
            description: "A soft and indulgent Italian-style bomboloni treat with a deliciously sweet finish.",
            ingredients: "Flour, sugar, eggs, butter, milk, yeast and filling."
        },
        {
            name: "Salted Caramel Espresso Delight",
            category: "beverages",
            price: 900,
            image: "./images/Salted Caramel Espresso Delight.png",
            description: "A smooth coffee creation combining rich espresso with sweet salted caramel notes.",
            ingredients: "Espresso, milk, caramel sauce and a touch of salt."
        },
        {
            name: "Blush Matcha",
            category: "beverages",
            price: 450,
            image: "./images/blush matcha.png",
            description: "A refreshing matcha drink with a smooth texture and a delicate, creamy flavour.",
            ingredients: "Matcha powder, milk and optional sweetener."
        },
        {
            name: "Forbidden Sip",
            category: "beverages",
            price: 650,
            image: "./images/the forbideen sip.png",
            description: "A refreshing iced coffee made with smooth espresso, chilled milk and ice.",
            ingredients: "Espresso, milk and ice."
        }
    ];

    // =========================
    // CART
    // =========================
    const CART_KEY = "bakerzBiteCart";
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        cart = [];
    }

    const saveCart = () => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (e) { /* storage band ho to bhi cart chalta rahe */ }
    };

    const cartCountEl = document.getElementById("cartCount");
    const cartListEl = document.getElementById("cartItemsList");
    const cartTotalEl = document.getElementById("cartTotalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const updateCartUI = () => {
        let count = 0;
        let total = 0;

        if (!cart.length) {
            if (cartListEl) {
                cartListEl.innerHTML =
                    '<p class="text-muted text-center mt-5">Your cart is currently empty.</p>';
            }
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            let html = "";
            cart.forEach((item, i) => {
                count += item.quantity;
                total += item.price * item.quantity;
                html += `
                    <div class="card mb-2 p-2 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0 font-playfair text-capitalize">${item.title}</h6>
                                <small class="text-muted">${money(item.price)} x ${item.quantity}</small>
                            </div>
                            <div class="btn-group btn-group-sm" role="group">
                                <button class="btn btn-outline-secondary" data-act="dec" data-i="${i}">-</button>
                                <button class="btn btn-outline-secondary" data-act="inc" data-i="${i}">+</button>
                                <button class="btn btn-outline-danger" data-act="del" data-i="${i}"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>`;
            });
            if (cartListEl) cartListEl.innerHTML = html;
            if (checkoutBtn) checkoutBtn.disabled = false;
        }

        if (cartCountEl) cartCountEl.textContent = count;
        if (cartTotalEl) cartTotalEl.textContent = money(total);
        saveCart();
    };

    const addToCart = (index) => {
        const p = items[index];
        if (!p) return;

        const found = cart.find(c => c.id === index);
        if (found) {
            found.quantity += 1;
        } else {
            cart.push({ id: index, title: p.name, price: p.price, image: p.image, quantity: 1 });
        }
        updateCartUI();

        const el = document.getElementById("cartOffcanvas");
        if (el && window.bootstrap?.Offcanvas) {
            window.bootstrap.Offcanvas.getOrCreateInstance(el).show();
        }
    };

    // + / - / delete buttons (event delegation)
    cartListEl?.addEventListener("click", e => {
        const btn = e.target.closest("button[data-act]");
        if (!btn) return;

        const i = Number(btn.dataset.i);
        const act = btn.dataset.act;

        if (act === "inc") {
            cart[i].quantity += 1;
        } else if (act === "dec") {
            if (cart[i].quantity > 1) cart[i].quantity -= 1;
            else cart.splice(i, 1);
        } else if (act === "del") {
            cart.splice(i, 1);
        }
        updateCartUI();
    });

    // Place order
    checkoutBtn?.addEventListener("click", () => {
        if (!cart.length) return;

        cart = [];
        updateCartUI();

        const off = document.getElementById("cartOffcanvas");
        if (off && window.bootstrap?.Offcanvas) {
            window.bootstrap.Offcanvas.getOrCreateInstance(off).hide();
        }

        const toastEl = document.getElementById("orderToast");
        if (toastEl && window.bootstrap?.Toast) {
            window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
        }
    });

    // =========================
    // PRODUCT POPUP
    // =========================
    let currentIndex = null;

    const openProduct = (index) => {
        const product = items[index];
        if (!product) return;

        const modalElement = document.getElementById("productModal");
        if (!modalElement || !window.bootstrap?.Modal) {
            console.error("Product modal or Bootstrap JavaScript is missing.");
            return;
        }

        currentIndex = index;

        const img = document.getElementById("modalImage");
        if (img) {
            img.src = encodeURI(product.image);
            img.alt = product.name;
        }

        document.getElementById("modalTitle").textContent = product.name;
        document.getElementById("modalCategory").textContent = product.category;
        document.getElementById("modalPrice").textContent = money(product.price);
        document.getElementById("modalDescription").textContent = product.description;
        document.getElementById("modalIngredients").textContent = product.ingredients;

        window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
    };

    // Modal ke andar se "Add to cart"
    document.getElementById("modalAddBtn")?.addEventListener("click", () => {
        if (currentIndex === null) return;

        const modalElement = document.getElementById("productModal");
        window.bootstrap.Modal.getOrCreateInstance(modalElement).hide();
        addToCart(currentIndex);
    });

    // =========================
    // DISPLAY PRODUCTS
    // =========================
    const render = () => {
        const cat = document.querySelector(".filter.active")?.dataset.cat || "all";
        const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
        const p = document.getElementById("price")?.value || "all";

        const inPrice = x =>
            p === "all" ||
            (p === "low" && x.price < 1000) ||
            (p === "mid" && x.price >= 1000 && x.price <= 2000) ||
            (p === "high" && x.price > 2000);

        const list = items
            .map((x, index) => ({ ...x, index }))
            .filter(x =>
                (cat === "all" || x.category === cat) &&
                (x.name.toLowerCase().includes(q) || x.category.includes(q)) &&
                inPrice(x)
            );

        document.getElementById("none")?.classList.toggle("d-none", list.length > 0);

        grid.innerHTML = list.map(x => `
            <div class="col-md-6 col-lg-4">
                <div class="bb-card" data-index="${x.index}" role="button" tabindex="0"
                     aria-label="View ${x.name} details">

                    <img src="${encodeURI(x.image)}" alt="${x.name}" class="product-image" loading="lazy">

                    <div class="bb-overlay">
                        <small class="kicker">${x.category}</small>
                        <h3>${x.name}</h3>
                        <p>${x.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <b class="bb-price">${money(x.price)}</b>
                            <button type="button" class="btn btn-sm btn-light add-btn" data-index="${x.index}">
                                <i class="bi bi-cart-plus"></i> Add to cart
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `).join("");

        // Image error handling
        grid.querySelectorAll(".product-image").forEach(img => {
            img.addEventListener("error", () => {
                console.error("Image not found:", img.getAttribute("src"));
                img.alt = "Image unavailable: " + img.alt;
                img.style.display = "none";
            });
        });
    };

    // Card click / keyboard + Add to cart button (event delegation, ek hi baar lagta hai)
    grid.addEventListener("click", e => {
        const addBtn = e.target.closest(".add-btn");
        if (addBtn) {
            e.stopPropagation();
            addToCart(Number(addBtn.dataset.index));
            return;
        }

        const card = e.target.closest(".bb-card");
        if (card) openProduct(Number(card.dataset.index));
    });

    grid.addEventListener("keydown", e => {
        if (e.key !== "Enter" && e.key !== " ") return;
        if (e.target.closest(".add-btn")) return;

        const card = e.target.closest(".bb-card");
        if (card) {
            e.preventDefault();
            openProduct(Number(card.dataset.index));
        }
    });

    // =========================
    // FILTERS
    // =========================
    document.querySelectorAll(".filter").forEach(b => {
        b.addEventListener("click", () => {
            document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
            b.classList.add("active");
            render();
        });
    });

    document.getElementById("search")?.addEventListener("input", render);
    document.getElementById("price")?.addEventListener("change", render);

    // =========================
    // LIVE TICKER
    // =========================
    const tickerEl = document.getElementById("ticker");
    if (tickerEl) {
        const msgs = [
            "Bakerz Bite — Freshly baked every day",
            "Try our Cocoa Luxe cake today",
            "Hot coffee and fresh croissants all day"
        ];
        let m = 0;
        setInterval(() => {
            m = (m + 1) % msgs.length;
            tickerEl.textContent = msgs[m];
        }, 4000);
    }

    // =========================
    // INITIAL DISPLAY
    // =========================
    render();
    updateCartUI();

});