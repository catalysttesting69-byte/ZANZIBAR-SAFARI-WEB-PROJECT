/**
 * =================================================================================
 * Main JavaScript file for the Zanzibar Safari Tours Website
 *
 * This file handles:
 * - Initialization of third-party services (EmailJS).
 * - Booking form submission, validation, and communication with EmailJS.
 * - Dynamic UI interactions like the responsive navbar and mobile menu.
 * - Interactive photo gallery with a lightbox.
 * - An auto-rotating testimonials section.
 * - Scroll-based visual effects.
 * =================================================================================
 */

// ---------------------------------------------------------------------------------
// EMAILJS INITIALIZATION
// ---------------------------------------------------------------------------------
// Self-invoking function to initialize the EmailJS service with a public key.
// This allows the site to send emails via the EmailJS client-side SDK.
(function() {
    emailjs.init({
        publicKey: "W6L8a7K1YPECas8Di"
    });
})();

// ---------------------------------------------------------------------------------
// BOOKING FORM LOGIC
// ---------------------------------------------------------------------------------

/**
 * Scrolls to the booking form and pre-selects a tour from the dropdown.
 * This function is typically called from "Book Now" buttons on specific tour cards.
 * @param {string} tourName - The value of the tour option to be selected.
 */
function bookTour(tourName) {
    // Scroll the booking section into the viewport smoothly.
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });

    const tourSelect = document.getElementById('tour-select');
    
    // Iterate through the dropdown options to find and select the matching tour.
    for (let i = 0; i < tourSelect.options.length; i++) {
        if (tourSelect.options[i].value === tourName) {
            tourSelect.selectedIndex = i;
            break;
        }
    }
}

// ---------------------------------------------------------------------------------
// EXPANDABLE TOUR DESCRIPTIONS WITH IMAGE ANIMATION
// ---------------------------------------------------------------------------------

/**
 * Initialize clickable tour descriptions.
 * Click description to expand/collapse.
 * Image shrinks up when description expands.
 */
function initializeTourDescriptions() {
    const descriptions = document.querySelectorAll('.description-wrapper');
    
    descriptions.forEach((desc) => {
        desc.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const tourCard = this.closest('.tour-card');
            const isExpanded = this.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                this.classList.remove('expanded');
                tourCard.classList.remove('expanded');
            } else {
                // Expand
                this.classList.add('expanded');
                tourCard.classList.add('expanded');
                
                // Smooth scroll to keep card visible
                setTimeout(() => {
                    tourCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTourDescriptions();
});

// --- Form Submission Handler ---

// Get references to the form and message boxes for later use.
const form = document.getElementById('booking-form');
const errorBox = document.getElementById('error-message');
const successBox = document.getElementById('success-message');

/**
 * Displays the error message box with a specific message.
 * @param {string} text - The error message to display.
 */
function showError(text) {
    document.getElementById('error-text').textContent = text;
    errorBox.classList.remove('hidden');
    // Scroll to the error message so the user sees it.
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Hides the error message box.
 */
function hideError() {
    errorBox.classList.add('hidden');
}

// Attach a 'submit' event listener to the booking form.
if (form) {
    form.addEventListener('submit', (event) => {
        // Prevent the default browser form submission behavior.
        event.preventDefault();
        
        let isValid = true;
        
        // --- Step 1: Validate the tour dropdown ---
        const tourSelect = document.getElementById('tour-select');
        if (tourSelect.value === "") {
            isValid = false;
            // Add a red border to indicate an error.
            tourSelect.classList.add('border-2', 'border-red-500', 'rounded-lg');
        } else {
            tourSelect.classList.remove('border-2', 'border-red-500', 'rounded-lg');
        }

        // --- Step 2: Validate all other inputs with the 'required' attribute ---
        const requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            // Check for empty values or non-positive numbers.
            if (!input.value || (input.type === 'number' && parseInt(input.value) <= 0)) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });

        // --- Step 3: If form is invalid, show an error and stop ---
        if (!isValid) {
            showError("Please fill out all required fields, including selecting at least one tour.");
            return;
        }

        // If validation passes, hide any previous error messages.
        hideError();

        // --- Step 4: Collect form data for EmailJS ---
        const formData = new FormData(form);
        const templateParams = {
            tour: formData.get('tour'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            guests: formData.get('guests'),
            date: formData.get('date'),
            requests: formData.get('requests') || 'N/A' // Use 'N/A' if requests are empty.
        };

        // --- Step 5: Send the email via EmailJS ---
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...'; // Provide user feedback.
        submitButton.disabled = true;

        // The core EmailJS send function.
        emailjs.send("service_efkpn27", "template_dp29oea", templateParams)
            .then((response) => {
                // --- On Success ---
                console.log('SUCCESS!', response.status, response.text);
                form.style.display = 'none'; // Hide the form.
                successBox.classList.remove('hidden'); // Show the success message.
                // Scroll to the top of the section to show the success message.
                document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, (error) => {
                // --- On Failure ---
                console.log('FAILED...', error);
                showError("Failed to send booking request. Please try again later.");
            })
            .finally(() => {
                // --- Always runs after success or failure ---
                // Restore the submit button to its original state.
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });
}


// ---------------------------------------------------------------------------------
// GENERAL UI/UX (Navbar and Mobile Menu)
// ---------------------------------------------------------------------------------

/**
 * Applies a glassmorphism effect to the navbar when the user scrolls down.
 */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        // --- Navbar Styling on Scroll ---
        if (window.scrollY > 50) {
            navbar.classList.add('bg-brand-dark/70', 'backdrop-blur-md', 'shadow-lg', 'py-2');
            navbar.classList.remove('bg-brand-dark', 'py-4');
        } else {
            navbar.classList.remove('bg-brand-dark/70', 'backdrop-blur-md', 'shadow-lg', 'py-2');
            navbar.classList.add('py-4');
        }
    });
}


/**
 * Toggles the visibility of the mobile navigation menu with animation.
 * Also handles closing the menu when clicking outside of it or on a menu link.
 */
const btn = document.getElementById('hamburger-btn');
const menu = document.getElementById('mobile-menu');

if (btn && menu) {
    // Open/close the menu when the hamburger button is clicked
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent this click from being caught by the document listener
        menu.classList.toggle('menu-open');
    });

    // Add a global click listener to close the menu when clicking away
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('menu-open')) {
            const isClickInsideMenu = menu.contains(e.target);
            const isClickOnButton = btn.contains(e.target);

            // If the click is not inside the menu and not on the button, close the menu
            if (!isClickInsideMenu && !isClickOnButton) {
                menu.classList.remove('menu-open');
            }
        }
    });

    // Close the menu when a link inside it is clicked
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('menu-open')) {
                menu.classList.remove('menu-open');
            }
        });
    });
}

// ---------------------------------------------------------------------------------
// PHOTO GALLERY & LIGHTBOX LOGIC
// ---------------------------------------------------------------------------------

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-content img') : null;
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let galleryImages = []; // This will store the URLs of all gallery images.
let currentIndex = 0;   // The index of the currently displayed image in the lightbox.

if (galleryItems.length > 0 && lightbox && lightboxImg) {
    /**
     * Populates the `galleryImages` array from the DOM and attaches click listeners
     * to each gallery item to open the lightbox.
     */
    galleryItems.forEach((item, index) => {
        const imgSrc = item.querySelector('img').src;
        galleryImages.push(imgSrc);

        item.addEventListener('click', () => {
            currentIndex = index; // Set the starting image.
            showImage(currentIndex);
            lightbox.classList.add('show'); // Display the lightbox.
        });
    });

    /**
     * Displays an image in the lightbox based on its index.
     * @param {number} index - The index of the image to show in the `galleryImages` array.
     */
    function showImage(index) {
        // Handle wrapping around the gallery (from last to first, and vice-versa).
        if (index < 0) {
            currentIndex = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        lightboxImg.src = galleryImages[currentIndex];
    }

    // --- Lightbox Navigation Handlers ---

    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from closing the lightbox.
            showImage(currentIndex - 1);
        });
    }


    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }


    // --- Lightbox Touch/Swipe Functionality for Mobile ---

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', () => {
        const swipeThreshold = 50; // Min distance for a valid swipe.

        if (touchEndX < touchStartX - swipeThreshold) {
            showImage(currentIndex + 1); // Swiped left.
        } else if (touchEndX > touchStartX + swipeThreshold) {
            showImage(currentIndex - 1); // Swiped right.
        }
    });

    // Close the lightbox if the user clicks on the dark background area.
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            lightbox.classList.remove('show');
        }
    });
}



// ---------------------------------------------------------------------------------
// TESTIMONIALS SECTION LOGIC
// ---------------------------------------------------------------------------------

// Hardcoded array of testimonial data. In a larger app, this would come from an API.
const allTestimonials = [
    { name: "The Johnson Family", text: "We had an amazing time on the Mikumi National Park day trip! Our guide was so knowledgeable and we saw so many animals. The kids are still talking about the giraffes and elephants. Zanzibar Safari Tours made everything so easy and a memorable for our family. Highly recommended!", img: "https://randomuser.me/api/portraits/men/32.jpg", rating: 5 },
    { name: "David & Emily", text: "The Sunset Cruise was the perfect romantic evening. The views were breathtaking, and the crew was so friendly and accommodating. We loved the traditional music and snacks. It was the highlight of our honeymoon in Zanzibar!", img: "https://randomuser.me/api/portraits/women/44.jpg", rating: 5 },
    { name: "Maria S.", text: "I booked the Dolphin Tour and it was absolutely magical! We saw so many dolphins up close. The snorkeling at Mnemba Atoll was also incredible. The team was very professional and I felt safe and well taken care of throughout the whole trip.", img: "https://randomuser.me/api/portraits/women/68.jpg", rating: 5 },
    { name: "Ben Carter", text: "As a solo traveler, I really appreciated the 24/7 support. They helped me plan my entire itinerary and were always available to answer my questions. The Stone Town tour was fascinating. I can't wait to come back and explore more of Zanzibar with this company.", img: "https://randomuser.me/api/portraits/men/41.jpg", rating: 5 },
    { name: "The Chen Family", text: "Our family had a fantastic time on the Spice Farm tour. It's so interesting to see and smell all the different spices. The kids loved the fresh fruit tasting. A must-do in Zanzibar!", img: "https://randomuser.me/api/portraits/men/43.jpg", rating: 5 },
    { name: "Chloe and friends", text: "We booked a private boat trip to Mnemba Atoll and it was worth every penny! The snorkeling was out of this world. The crew was amazing and they prepared a delicious seafood lunch for us on the boat. 10/10 would recommend!", img: "https://randomuser.me/api/portraits/women/55.jpg", rating: 5 },
    { name: "Liam R.", text: "The Jozani Forest tour was incredible. Seeing the Red Colobus monkeys in their natural habitat was a unique experience. My guide was very knowledgeable about the local flora and fauna. A great half-day trip.", img: "https://randomuser.me/api/portraits/men/75.jpg", rating: 5 },
    { name: "Isabella Rossi", text: "I had a wonderful time exploring Stone Town with my guide. The history is fascinating and the architecture is beautiful. I felt like I was transported back in time. Thank you for a great tour!", img: "https://randomuser.me/api/portraits/women/85.jpg", rating: 5 },
    { name: "Michael B.", text: "The private transfer from the airport was seamless. The driver was waiting for us and was very professional. It made our arrival in Zanzibar completely stress-free. Excellent service.", img: "https://randomuser.me/api/portraits/men/55.jpg", rating: 5 },
    { name: "Jessica L.", text: "I can't say enough good things about the Blue Lagoon snorkeling trip. The coral was vibrant and we saw so many colorful fish. It felt like swimming in an aquarium. A must-do!", img: "https://randomuser.me/api/portraits/women/58.jpg", rating: 5 }
];

// --- State variables for the testimonial functionality ---
let currentTestimonials = []; // The 3 testimonials currently on display.
let displayedCardElements = []; // The actual DOM elements for the displayed cards.
let availableTestimonialsPool = [...allTestimonials]; // Testimonials available to be shown.
const testimonialGrid = document.getElementById('testimonial-grid');
const testimonialPrevBtn = document.getElementById('testimonial-prev');
const testimonialNextBtn = 'testimonial-next';
let autoChangeInterval; // Holds the reference to the `setInterval` timer.

/**
 * Creates the HTML string for a single testimonial card.
 * @param {object} testimonial - The testimonial data object.
 * @returns {string} The HTML content for the card.
 */
function createTestimonialCardHTML(testimonial) {
    const starRating = '<div class="flex justify-center mb-3 text-lg">' +
                       Array(testimonial.rating).fill('<i class="fas fa-star text-yellow-400"></i>').join('') +
                       Array(5 - testimonial.rating).fill('<i class="far fa-star text-yellow-400"></i>').join('') +
                       '</div>';
    return `
        <img src="${testimonial.img}" alt="${testimonial.name}" class="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-brand-DEFAULT object-cover">
        ${starRating}
        <p class="text-gray-600 mb-4 italic text-center text-sm sm:text-base leading-relaxed">"${testimonial.text}"</p>
        <p class="font-semibold text-brand-DEFAULT text-center text-sm sm:text-base">- ${testimonial.name}</p>
    `;
}

/**
 * Updates the content of a specific card element with a new testimonial.
 * @param {HTMLElement} cardElement - The DOM element of the card to update.
 *
 * @param {object} newTestimonial - The new testimonial data to display.
 */
function updateCardContent(cardElement, newTestimonial) {
    cardElement.innerHTML = createTestimonialCardHTML(newTestimonial);
    cardElement.dataset.testimonialId = newTestimonial.name;
    cardElement.classList.remove('fade-out'); // Remove fade-out class to make it visible again.
}

/**
 * Sets up the initial 3 testimonial cards on page load.
 */
function initializeTestimonials() {
    if (!testimonialGrid) return;
    testimonialGrid.innerHTML = ''; // Clear any existing cards.
    displayedCardElements = [];

    // Shuffle the pool to get a random starting set.
    const shuffledPool = [...allTestimonials].sort(() => 0.5 - Math.random());
    
    currentTestimonials = shuffledPool.slice(0, 3);
    availableTestimonialsPool = shuffledPool.slice(3);

    // Create and append the initial cards.
    currentTestimonials.forEach(testimonial => {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('testimonial-card', 'p-6', 'bg-white', 'rounded-lg', 'shadow-md', 'hover:shadow-xl', 'transition', 'duration-300');
        updateCardContent(cardWrapper, testimonial);
        testimonialGrid.appendChild(cardWrapper);
        displayedCardElements.push(cardWrapper);
    });
}

/**
 * Starts the timer for auto-rotating testimonials.
 */
function startAutoChange() {
    if (autoChangeInterval) clearInterval(autoChangeInterval);
    autoChangeInterval = setInterval(() => updateSingleTestimonial(), 5000); // 5 seconds
}

/**
 * Stops the auto-rotation timer.
 */
function stopAutoChange() {
    if (autoChangeInterval) clearInterval(autoChangeInterval);
}

/**
 * Replaces one of the visible testimonials with a new one from the pool.
 * @param {number} manualDirection - 0 for auto, 1 for next, -1 for prev.
 */
function updateSingleTestimonial(manualDirection = 0) {
    stopAutoChange(); // Pause during the update.

    // Pick a random card to replace for auto-mode.
    let cardToReplaceIndex = Math.floor(Math.random() * displayedCardElements.length);
    
    const cardElementToReplace = displayedCardElements[cardToReplaceIndex];

    // Refill the pool if it's empty to ensure we always have new testimonials.
    if (availableTestimonialsPool.length === 0) {
        availableTestimonialsPool = allTestimonials.filter(t => 
            !currentTestimonials.some(ct => ct.name === t.name)
        );
    }
    
    // Pick a new random testimonial from the available pool.
    const newTestimonial = availableTestimonialsPool.shift(); // Get and remove from pool.

    // Fade out the old card.
    cardElementToReplace.classList.add('fade-out');

    // After the fade-out animation completes, update the content and fade it back in.
    setTimeout(() => {
        const oldTestimonial = currentTestimonials[cardToReplaceIndex];
        availableTestimonialsPool.push(oldTestimonial); // Add the old one back to the pool.
        currentTestimonials[cardToReplaceIndex] = newTestimonial;
        
        updateCardContent(cardElementToReplace, newTestimonial);
    }, 500); // This duration must match the CSS fade-out transition time.

    startAutoChange(); // Restart the timer.
}

if (testimonialPrevBtn) {
    testimonialPrevBtn.addEventListener('click', () => updateSingleTestimonial(-1));
}
if (testimonialNextBtn) {
    const nextBtn = document.getElementById(testimonialNextBtn);
    if(nextBtn) {
        nextBtn.addEventListener('click', () => updateSingleTestimonial(1));
    }
}


// ---------------------------------------------------------------------------------
// PAGE INITIALIZATION & SCROLL ANIMATIONS
// ---------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize components ---
    if (document.getElementById('testimonial-grid')) {
        initializeTestimonials();
        startAutoChange();
    }
    
    // Set the minimum selectable date in the booking form to today.
    const today = new Date().toISOString().split('T')[0];
    const bookingDateEl = document.getElementById('booking-date');
    if (bookingDateEl) {
        bookingDateEl.setAttribute('min', today);
    }

    // Attach a listener to the "Edit Booking" button on the success message.
    const editBtn = document.getElementById('edit-booking-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
            // Hide the success message and show the form again.
            document.getElementById('success-message').classList.add('hidden');
            const formElement = document.getElementById('booking-form');
            formElement.style.display = 'block';
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // --- Setup scroll animations ---
    const animatedElements = document.querySelectorAll('.animated-section, .animated-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
