// A simple array of quote objects. This can be extended dynamically.
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "The best way to predict the future is to create it.", category: "Future" },
  { text: "Do not wait; the time will never be 'just right.'", category: "Action" },
  { text: "Challenges are what make life interesting and overcoming them is what makes life meaningful.", category: "Challenges" }
];

// Get all necessary DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');

/**
 * Updates the DOM with a randomly selected quote from the quotes array.
 * This version uses bracket notation to access object properties.
 * @param {Event} event - The click event object (optional).
 */
const showRandomQuote = (event) => {
  // Prevent default form submission behavior if this function is called by a form event
  if (event) {
    event.preventDefault();
  }

  // Handle the case where the quotes array might be empty
  if (quotes.length === 0) {
    quoteText.textContent = "No quotes available. Add one!";
    quoteCategory.textContent = "";
    return;
  }
  
  // Generate a random index to select a quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the text content of the quote and category elements using bracket notation
  // The property names are passed as strings inside the brackets.
  quoteText.textContent = `"${randomQuote['text']}"`;
  quoteCategory.textContent = `— ${randomQuote['category']}`;
};

/**
 * Adds a new quote to the quotes array from user input and updates the DOM.
 */
const addQuote = () => {
  // Get the text and category from the input fields
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  // Validate that both fields are not empty
  if (text === '' || category === '') {
    // A simple visual indicator for the user instead of an alert
    newQuoteText.placeholder = text === '' ? "Quote is required!" : newQuoteText.placeholder;
    newQuoteCategory.placeholder = category === '' ? "Category is required!" : newQuoteCategory.placeholder;
    return;
  }

  // Create a new quote object and add it to the quotes array
  const newQuote = { text: text, category: category };
  quotes.push(newQuote);

  // Clear the input fields for the next quote
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Reset placeholders to their original state
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteCategory.placeholder = "Enter category";

  // Optionally, display the newly added quote immediately
  showRandomQuote();
};

// Add event listeners to the buttons
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Display an initial random quote when the page loads
document.addEventListener('DOMContentLoaded', showRandomQuote);
