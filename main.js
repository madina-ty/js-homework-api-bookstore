const urlApi = 'https://www.googleapis.com/books/v1/volumes?q=Javascript';
const booksList = document.querySelector('.books-list');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const cartBtn = document.querySelector('.cart-btn');
const cartOverlay = document.querySelector('.cart-overlay');
const cartCloseBtn = document.querySelector('.cart-close');
let currentIndex = 0;
let books = [];

// Fetch data from the API
async function fetchData(urlApi) {
    try {
        const response = await fetch(urlApi);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            books = data.items;
            renderBooks();
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

// Render book items
function renderBooks() {
    const booksHTML = books.map(item => {
        const bookImage = item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x198';
        const bookTitle = item.volumeInfo.title;
        const bookGenre = item.volumeInfo.categories?.[0] || 'Жанр не указан';

        return `
            <div class="book-item">
                <img src="${bookImage}" alt="${bookTitle}">
                <h3>${bookTitle}</h3>
                <p>${bookGenre}</p>
                <button data-book-id="${item.id}" class="add-to-cart-btn">Add to cart</button>
            </div>
        `;
    }).join('');
    
    booksList.innerHTML = booksHTML;
    updateSlider();
    addCartEventListeners();
}

// Slider functionality
function updateSlider() {
    const totalBooks = books.length;
    const booksToShow = 4; // Number of books to show at once
    const totalSlides = Math.ceil(totalBooks / booksToShow);

    booksList.style.transform = `translateX(-${(currentIndex * 100) / totalSlides}%)`;

    prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = currentIndex === totalSlides - 1 ? 'none' : 'block';
}

// Navigation buttons
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < Math.ceil(books.length / 4) - 1) {
        currentIndex++;
        updateSlider();
    }
});

// Add to cart functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

class CartItem {
    constructor(id, title, price, image, quantity) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }
}

function addToCart(book) {
    const existingItem = cartItems.find(item => item.id === book.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const newItem = new CartItem(
            book.id,
            book.volumeInfo.title,
            book.saleInfo.listPrice?.amount || 0,
            book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x198',
            1
        );
        cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartQtyDisplay();
}

// Event listeners for "Add to cart" buttons
function addCartEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const bookId = event.target.dataset.bookId;
            const book = books.find(item => item.id === bookId);
            addToCart(book);
        });
    });
}

// Update cart display
function updateCartDisplay() {
    const cartDisplay = document.querySelector('.cart-display');
    cartDisplay.innerHTML = '';

    if (cartItems.length === 0) {
        cartDisplay.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let totalItems = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            cartDisplay.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <h4>${item.title}</h4>
                    <p>Price: $${item.price} x ${item.quantity}</p>
                    <button data-book-id="${item.id}" class="remove-from-cart-btn">Remove</button>
                </div>
            `;
        });

        cartDisplay.innerHTML += `
            <div class="cart-total">
                <h4>Total Items: ${totalItems}</h4>
                <h4>Total Price: $${totalPrice.toFixed(2)}</h4>
            </div>
        `;

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const bookId = event.target.dataset.bookId;
                removeFromCart(bookId);
            });
        });
    }
}

// Remove from cart
function removeFromCart(bookId) {
    const itemIndex = cartItems.findIndex(item => item.id === bookId);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity--;

        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartQtyDisplay();
        updateCartDisplay();
    }
}

// Update cart quantity display
function updateCartQtyDisplay() {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-qty').textContent = totalQuantity;
}

// Open cart modal
cartBtn.addEventListener('click', () => {
    updateCartDisplay();
    cartOverlay.style.display = 'flex'; 
});

// Close cart modal
cartCloseBtn.addEventListener('click', () => {
    cartOverlay.style.display = 'none'; 
});

// Clear cart functionality
const cartClearButton = document.querySelector('.cart-clear');
cartClearButton.addEventListener('click', () => {
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartQtyDisplay();
    updateCartDisplay();
});

// Initialize
fetchData(urlApi);
updateCartQtyDisplay();


let valueDisplays = document.querySelectorAll('.num'); // Use querySelectorAll to get all elements
let interval = 1000;

valueDisplays.forEach((valueDisplay) => {
    let startValue = 0;
    let endValue = parseInt(valueDisplay.getAttribute('data-value'));
    
    let duration = Math.floor(interval / endValue); // Calculate the duration for each increment
    let counter = setInterval(function () {
        startValue += 1;

        valueDisplay.textContent = startValue;
        if (startValue === endValue) {
            clearInterval(counter);
        }
    }, duration);
});


let accordion = document.querySelector('.accordion');
let accordionItems = accordion.querySelectorAll('.item');

for(let i = 0; i < accordionItems.length; i++) {
  let questionItem = accordionItems[i].querySelector('.question');
  questionItem.addEventListener('click', function () {
    if(accordionItems[i].classList.contains('active')) {
      accordionItems[i].classList.remove('active')
    } else {
      try {
        accordion.querySelector('.active').classList.remove('active');
      } catch(msg){
        accordionItems[i].classList.add('active')
      }
    }
  })
}

const originalReviews = [
    {
        img: "./reviews/емма.jpg",
        text: "I was really impressed with the quality of the books I ordered. They arrived in perfect condition, and I appreciate that they use protective packaging. Will definitely order again!",
        name: "- Emma Miller"
    },
    {
        img: "./reviews/Maria.jpg",
        text: "I ordered several hardcover books, and they came securely packaged to prevent any damage during transit. I’m very pleased with the quality and will be a repeat customer.",
        name: "- Maria Buzovskaya"
    },
    {
        img: "./reviews/sofia.jpg",
        text: "The staff here is incredibly knowledgeable and friendly. They helped me find exactly what I was looking for and even suggested a few other titles I ended up loving!",
        name: "- Sofia Andreevna"
    }
];

const newReviews = [
    {
        img: "./reviews/adina.jpg",
        text: "I had a fantastic experience at this bookstore! The staff was incredibly knowledgeable and friendly. They took the time to help me find exactly what I was looking for and even recommended a few titles that I ended up loving.",
        name: "- Adina Askapova"
    },
    {
        img: "./reviews/Kalima.jpg",
        text: "I found rare books here that I couldn't find anywhere else. Highly recommend!",
        name: "- Kalima Kim"
    },
    {
        img: "./reviews/Malika.jpg",
        text: "I am absolutely thrilled with the fast delivery from this bookstore! I placed my order expecting to wait a few days, but my books arrived within 24 hours, perfectly packaged and in excellent condition. It’s refreshing to see such efficiency and care in service.",
        name: "- Malika Alieva"
    }
];

let showingNewReviews = false; 

document.getElementById("change-reviews").addEventListener("click", function() {
    const cards = document.querySelectorAll(".reviews-right .card");
    const reviewsToShow = showingNewReviews ? originalReviews : newReviews; 

    cards.forEach((card, index) => {
        const img = card.querySelector("img");
        const text = card.querySelector(".card-details p");
        const name = card.querySelector(".card-details h4");
        
        img.src = reviewsToShow[index].img;
        text.textContent = reviewsToShow[index].text;
        name.textContent = reviewsToShow[index].name;
    });

    showingNewReviews = !showingNewReviews; 
});
