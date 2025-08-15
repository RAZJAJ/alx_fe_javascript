// A simple array of quote objects. This will be synchronized with local storage.
let quotes = [];
let currentQuotes = []; // Array to hold the currently filtered quotes

// Get all necessary DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

// Variables for form elements that will be created dynamically
let newQuoteText;
let newQuoteCategory;
let addQuoteBtn;

/**
 * Saves the current quotes array to local storage.
 */
const saveQuotes = () => {
  localStorage.setItem('quotes', JSON.stringify(quotes));
};

/**
 * Loads quotes from local storage when the application starts.
 * If local storage is empty, it uses a default set of quotes.
 */
const loadQuotes = () => {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if local storage is empty
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
    ];
    saveQuotes(); // Save the initial quotes to local storage
  }
};

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
const populateCategories = () => {
  // Use a Set to get unique categories, then convert to an array
  const uniqueCategories = new Set(quotes.map(quote => quote.category));

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add a new option for each unique category
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter from local storage
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
};

/**
 * Filters the quotes array based on the selected category and updates the display.
 */
const filterQuotes = () => {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastFilter', selectedCategory); // Save the current filter

  if (selectedCategory === 'all') {
    currentQuotes = quotes;
  } else {
    currentQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  showRandomQuote();
};

/**
 * Updates the DOM with a randomly selected quote from the currently filtered quotes array.
 */
const showRandomQuote = () => {
  if (currentQuotes.length === 0) {
    quoteText.innerHTML = "No quotes available for this category.";
    quoteCategory.innerHTML = "";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * currentQuotes.length);
  const randomQuote = currentQuotes[randomIndex];

  quoteText.innerHTML = `"${randomQuote.text}"`;
  quoteCategory.innerHTML = `— ${randomQuote.category}`;

  // Explicitly reference and use the quoteDisplay variable to change the background color
  highlightQuoteBox();
};

/**
 * Temporarily changes the background of the quote display box to provide a visual cue.
 */
const highlightQuoteBox = () => {
  const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  quoteDisplay.style.backgroundColor = randomColor;
  setTimeout(() => {
    quoteDisplay.style.backgroundColor = '#eef2ff'; // Return to original color
  }, 500);
};

/**
 * Creates and appends the "Add Quote" form to the DOM.
 */
const createAddQuoteForm = () => {
  const formHeading = document.createElement('h2');
  formHeading.className = "text-xl font-bold text-gray-700 mb-4";
  formHeading.innerHTML = "Add Your Own Quote";
  
  const inputContainer = document.createElement('div');
  inputContainer.className = "flex flex-col md:flex-row gap-4";

  newQuoteText = document.createElement('input');
  newQuoteText.id = "newQuoteText";
  newQuoteText.type = "text";
  newQuoteText.placeholder = "Enter a
