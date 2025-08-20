// Product Data
      const products = [
        {
          id: 1,
          name: "Premium Car Shampoo",
          price: 549,
         
          
          category: "Cleaning",
        },
        {
          id: 2,
          name: "Car Shiner & Polish",
          price: 999,
         
          category: "Polish",
        },
        {
          id: 3,
          name: "Tyre Degreaser & Cleaner",
          price: 799,
          
          category: "Tyre Care",
        },
        {
          id: 4,
          name: "Windshield Cleaning Solution",
          price: 299,
         
          category: "Glass Care",
        },
        {
          id: 5,
          name: "Streak-Free Glass Cleaner",
          price: 359,
          
          
          category: "Glass Care",
        },
        {
          id: 6,
          name: "Car Phone Mount Holder",
          price: 250,
          
          category: "Accessories",
        },
        {
          id: 7,
          name: "Bike Phone Mount Holder",
          price: 600,
         
          category: "Accessories",
        },
        {
          id: 8,
          name: "Bike Polish & Shiner",
          price: 500,
         
          category: "Polish",
        },
      ];

      // Cart functionality
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Mobile Menu Toggle
      const mobileMenuBtn = document.getElementById("mobileMenuBtn");
      const mainNav = document.getElementById("mainNav");

      mobileMenuBtn.addEventListener("click", () => {
        mainNav.classList.toggle("active");
      });

      // Smooth Scrolling for Anchor Links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();

          if (this.getAttribute("href") === "#") return;

          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 70,
              behavior: "smooth",
            });

            // Close mobile menu if open
            mainNav.classList.remove("active");
          }
        });
      });

      // Booking Form Submission
      const bookingForm = document.getElementById("bookingForm");
      const bookingModal = document.getElementById("bookingModal");
      const closeModal = document.getElementById("closeModal");
      const modalCloseBtn = document.getElementById("modalCloseBtn");

      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Here you would typically send the form data to a server
        // For this demo, we'll just show the confirmation modal

        // Reset form
        bookingForm.reset();

        // Show modal
        bookingModal.style.display = "flex";
      });

      // Close Modal
      closeModal.addEventListener("click", () => {
        bookingModal.style.display = "none";
      });

      modalCloseBtn.addEventListener("click", () => {
        bookingModal.style.display = "none";
      });

      // Close modal when clicking outside
      window.addEventListener("click", (e) => {
        if (e.target === bookingModal) {
          bookingModal.style.display = "none"; 
        }
      });

      // Set minimum date for booking to today
      const today = new Date().toISOString().split("T")[0];
      document.getElementById("date").min = today;

      // Cart functionality
      const cartIcon = document.getElementById("cartIcon");
      const cartModal = document.getElementById("cartModal");
      const closeCartModal = document.getElementById("closeCartModal");
      const cartItemsContainer = document.getElementById("cartItems");
      const cartTotalElement = document.getElementById("cartTotal");
      const cartCount = document.getElementById("cartCount");
      const checkoutBtn = document.getElementById("checkoutBtn");

      // Open cart modal
      cartIcon.addEventListener("click", () => {
        cartModal.style.display = "flex";
        updateCartDisplay();
      });

      // Close cart modal
      closeCartModal.addEventListener("click", () => {
        cartModal.style.display = "none";
      });

      // Add to cart buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = parseInt(
            e.target.closest(".product-card").dataset.id
          );
          addToCart(productId);
        });
      });

      // Add item to cart
      function addToCart(productId) {
        const product = products.find((p) => p.id === productId);
        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          });
        }

        updateCart();
        showAddToCartNotification(product.name);
      }

      // Update cart in localStorage and UI
      function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
      }

      // Update cart count in header
      function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
      }

      // Update cart display in modal
      function updateCartDisplay() {
        if (cart.length === 0) {
          cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart" style="font-size: 40px; margin-bottom: 15px;"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
          cartTotalElement.textContent = "₹0.00";
          return;
        }

        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item) => {
          total += item.price * item.quantity;

          const cartItemElement = document.createElement("div");
          cartItemElement.className = "cart-item";
          cartItemElement.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toFixed(
                          2
                        )}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${
                              item.id
                            }">-</button>
                            <input type="text" class="quantity-input" value="${
                              item.quantity
                            }" readonly>
                            <button class="quantity-btn plus" data-id="${
                              item.id
                            }">+</button>
                        </div>
                        <div class="remove-item" data-id="${
                          item.id
                        }">Remove</div>
                    </div>
                `;

          cartItemsContainer.appendChild(cartItemElement);
        });

        // Add event listeners to quantity buttons
        document.querySelectorAll(".quantity-btn.minus").forEach((button) => {
          button.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            updateQuantity(id, -1);
          });
        });

        document.querySelectorAll(".quantity-btn.plus").forEach((button) => {
          button.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            updateQuantity(id, 1);
          });
        });

        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
          button.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
          });
        });

        cartTotalElement.textContent = `₹${total.toFixed(2)}`;

      }

      // Update item quantity
      function updateQuantity(productId, change) {
        const item = cart.find((item) => item.id === productId);

        if (item) {
          item.quantity += change;

          if (item.quantity <= 0) {
            cart = cart.filter((item) => item.id !== productId);
          }

          updateCart();
        }
      }

      // Remove item from cart
      function removeFromCart(productId) {
        cart = cart.filter((item) => item.id !== productId);
        updateCart();
      }

      // Show add to cart notification
      function showAddToCartNotification(productName) {
        const notification = document.createElement("div");
        notification.className = "add-to-cart-notification";
        notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart</span>
            `;

        document.body.appendChild(notification);

        setTimeout(() => {
          notification.classList.add("show");
        }, 10);

        setTimeout(() => {
          notification.classList.remove("show");
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }

      // Checkout button
      checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) return;

        alert("Thank you for your purchase! Your order has been placed.");
        cart = [];
        updateCart();
        cartModal.style.display = "none";
      });

      // Initialize cart count on page load
      updateCartCount();

      // Add styles for notification
      const style = document.createElement("style");
      style.textContent = `
            .add-to-cart-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #27ae60;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                display: flex;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 3000;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            }
            
            .add-to-cart-notification.show {
                opacity: 1;
            }
            
            .add-to-cart-notification i {
                margin-right: 10px;
                font-size: 18px;
            }
        `;
      document.head.appendChild(style);