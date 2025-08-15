// A simple array of quote objects. This will be synchronized with local storage.
let quotes = [];
let currentQuotes = []; // Array to hold the currently filtered quotes

// Get all necessary DOM elements
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
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteText.className = "flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300";

  newQuoteCategory = document.createElement('input');
  newQuoteCategory.id = "newQuoteCategory";
  newQuoteCategory.type = "text";
  newQuoteCategory.placeholder = "Enter category";
  newQuoteCategory.className = "flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300";

  addQuoteBtn = document.createElement('button');
  addQuoteBtn.id = "addQuoteBtn";
  addQuoteBtn.innerHTML = "Add Quote";
  addQuoteBtn.className = "mt-4 w-full bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-gray-900 transition-colors duration-300 transform hover:scale-105";
  
  inputContainer.appendChild(newQuoteText);
  inputContainer.appendChild(newQuoteCategory);
  
  formContainer.appendChild(formHeading);
  formContainer.appendChild(inputContainer);
  formContainer.appendChild(addQuoteBtn);

  addQuoteBtn.addEventListener('click', addQuote);
};

/**
 * Adds a new quote to the quotes array from user input, updates the UI, and saves to local storage.
 */
const addQuote = () => {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === '' || category === '') {
    newQuoteText.placeholder = text === '' ? "Quote is required!" : newQuoteText.placeholder;
    newQuoteCategory.placeholder = category === '' ? "Category is required!" : newQuoteCategory.placeholder;
    return;
  }

  const newQuote = { text: text, category: category };
  quotes.push(newQuote);

  saveQuotes();
  populateCategories(); // Update the categories dropdown
  filterQuotes(); // Re-apply the filter to include the new quote

  newQuoteText.value = '';
  newQuoteCategory.value = '';
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteCategory.placeholder = "Enter category";
};

/**
 * Exports the quotes array to a JSON file.
 */
const exportQuotes = () => {
  const quotesJson = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Imports quotes from a selected JSON file.
 * @param {Event} event The change event from the file input.
 */
const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories(); // Update categories with imported data
      filterQuotes(); // Apply the filter
      
      const messageBox = document.createElement('div');
      messageBox.textContent = 'Quotes imported successfully!';
      messageBox.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white p-4 rounded-xl shadow-lg transition-opacity duration-300 opacity-100 z-50';
      document.body.appendChild(messageBox);
      setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => messageBox.remove(), 300);
      }, 3000);
      
    } catch (error) {
      const messageBox = document.createElement('div');
      messageBox.textContent = 'Error importing file: ' + error.message;
      messageBox.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white p-4 rounded-xl shadow-lg transition-opacity duration-300 opacity-100 z-50';
      document.body.appendChild(messageBox);
      setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => messageBox.remove(), 300);
      }, 3000);
    }
  };
  fileReader.readAsText(event.target.files[0]);
};

// Add event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  filterQuotes();
});
