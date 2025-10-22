document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS Loaded!");

  /* index page*/
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    showSlide(currentSlide);
    setInterval(nextSlide, 4000);
  }

  // Discount modal
  const modal = document.getElementById("discountModal");

  if (modal) {
    const closeBtn = modal.querySelector(".close");
    const claimBtn = document.getElementById("claimDiscountBtn");
    const emailInput = document.getElementById("emailInput");
    const formContainer = document.getElementById("discountFormContainer");
    const messageContainer = document.getElementById("discountMessage");

    // ✅ Check if popup has been shown 
    const hasSeenPopup = sessionStorage.getItem("hasSeenDiscountPopup");

    if (!hasSeenPopup) {
      modal.style.display = "flex"; 
      sessionStorage.setItem("hasSeenDiscountPopup", "true");
    }
    if (localStorage.getItem("discountClaimed")) {
      if (formContainer) formContainer.style.display = "none";
      if (messageContainer) messageContainer.style.display = "block";
    } else {
      if (formContainer) formContainer.style.display = "block";
      if (messageContainer) messageContainer.style.display = "none";
    }

    // close modal normally
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    window.addEventListener("click", (event) => {
      if (event.target === modal) modal.style.display = "none";
    });

    if (claimBtn) {
      claimBtn.addEventListener("click", () => {
        if (emailInput?.value) {
          alert("Thanks for signing up! Your 10% discount code is: WELCOME10");
          localStorage.setItem("discountClaimed", "true");
          modal.style.display = "none";
        } else {
          alert("Please enter a valid email.");
        }
      });
    }
  }

  // search
  const searchBox = document.getElementById("searchBox");

  if (searchBox) {
    searchBox.addEventListener("keyup", () => {
      const query = searchBox.value.toLowerCase().trim();
      const items = document.querySelectorAll(".fourcols, .fivecols");

      let anyVisible = false; 

      items.forEach(item => {
        const title = item.querySelector("h4")?.textContent.toLowerCase() || "";
        const description = item.querySelector("p")?.textContent.toLowerCase() || "";

        if (title.includes(query) || description.includes(query)) {
          item.style.display = "block";
          anyVisible = true;
        } else {
          item.style.display = "none";
        }
      });

      // Handle row visibility
      const rows = document.querySelectorAll(".row");
      rows.forEach(row => {
        const visibleItems = Array.from(row.children).filter(
          child => child.style.display !== "none"
        );
        row.style.display = visibleItems.length > 0 ? "flex" : "none";
      });

      const sections = document.querySelectorAll("section");
      sections.forEach(section => {
        const visibleItems = section.querySelectorAll(".fourcols, .fivecols");
        const anyVisibleInSection = Array.from(visibleItems).some(
          item => item.style.display !== "none"
        );
        section.style.display = anyVisibleInSection ? "block" : "none";
      });
      let noResultMsg = document.getElementById("noResults");
      if (!noResultMsg) {
        noResultMsg = document.createElement("p");
        noResultMsg.id = "noResults";
        noResultMsg.style.textAlign = "center";
        noResultMsg.style.marginTop = "20px";
        noResultMsg.style.fontWeight = "bold";
        noResultMsg.textContent = "No matching products found.";
        document.body.appendChild(noResultMsg);
      }
      noResultMsg.style.display = anyVisible ? "none" : "block";
    });
  }
  // search

  // event page
  const forms = document.querySelectorAll(".registrationForm");
  if (forms.length > 0) {
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const messageBox = form.closest(".registration").querySelector(".messageBox");
        if (!messageBox) return;

        messageBox.classList.remove("success", "error", "visible");

        if (form.checkValidity()) {
          messageBox.textContent = "✅ Registration successful!";
          messageBox.classList.add("success", "visible");
          form.reset();
        } else {
          messageBox.textContent = "❌ Failed to register. Please check your inputs.";
          messageBox.classList.add("error", "visible");
        }

        setTimeout(() => {
          messageBox.classList.remove("visible", "success", "error");
        }, 3000);
      });
    });
  }

  // top nav
  const topnavToggle = document.getElementById("myTopnav");
  if (topnavToggle) {
    window.myFunction = function () {
      if (topnavToggle.className === "topnav") {
        topnavToggle.className += " responsive";
      } else {
        topnavToggle.className = "topnav";
      }
    };
  }

  // cart
  let cart = JSON.parse(sessionStorage.getItem("cart")) || {};
  const cartBody = document.getElementById("cart-body");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  function renderCart() {
    if (!cartBody) return;
    cartBody.innerHTML = "";
    let totalAmount = 0;

    for (let name in cart) {
      const details = cart[name];
      const itemTotal = details.price * details.quantity;
      totalAmount += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${name}</td>
        <td><input type="number" value="${details.quantity}" min="1" data-name="${name}" class="qty-input"></td>
        <td>${details.price} mmk</td>
        <td>${itemTotal} mmk</td>
        <td><button class="remove-btn" data-name="${name}">Remove</button></td>
      `;
      cartBody.appendChild(row);
    }

    if (totalEl) totalEl.innerText = totalAmount;
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }

  // Cart buttons
  const addButtons = document.querySelectorAll(".fivecols button, .fourcols button");
  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentElement;
      const name = parent.querySelector("h4").innerText;
      const priceText = parent.querySelector("p:last-of-type").innerText;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

      if (cart[name]) {
        cart[name].quantity += 1;
      } else {
        cart[name] = { price: price, quantity: 1 };
      }

      sessionStorage.setItem("cart", JSON.stringify(cart));
      alert(`${name} added to cart!`);
      renderCart();
    });
  });

  if (cartBody) {
    cartBody.addEventListener("input", (e) => {
      if (e.target.classList.contains("qty-input")) {
        const name = e.target.dataset.name;
        cart[name].quantity = parseInt(e.target.value, 10);
        renderCart();
      }
    });

    cartBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const name = e.target.dataset.name;
        delete cart[name];
        renderCart();
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (Object.keys(cart).length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
      } else {
        alert("✅ Checkout complete! Thank you for shopping with us.");
      }
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart = {};
        sessionStorage.removeItem("cart");
        renderCart();
      }
    });
  }

  renderCart();

// offer
  const cardButtons = document.querySelectorAll(".card button");
  cardButtons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const name = card.querySelector("h3").innerText;
      const priceText = card.querySelector("p:nth-of-type(2)")?.innerText || "0";
      let price = 0;

      if (button.innerText.toLowerCase().includes("subscribe")) {
        const match = priceText.match(/([\d,]+)/);
        if (match) price = parseInt(match[1].replace(/,/g, ""), 10);
      } else if (button.innerText.toLowerCase().includes("grab offer")) {
        price = 10000;
      }

      let cart = JSON.parse(sessionStorage.getItem("cart")) || {};
      if (cart[name]) {
        cart[name].quantity += 1;
      } else {
        cart[name] = { price: price, quantity: 1 };
      }
      sessionStorage.setItem("cart", JSON.stringify(cart));
      alert(`${name} added to cart!`);
    });
  });

});
