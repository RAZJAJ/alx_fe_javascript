// A simple array of quote objects. This will be synchronized with local storage.
let quotes = [];

// Get all necessary DOM elements
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

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
 * Updates the DOM with a randomly selected quote from the quotes array.
 * This version uses the innerHTML property.
 */
const showRandomQuote = () => {
  // Handle the case where the quotes array might be empty
  if (quotes.length === 0) {
    quoteText.innerHTML = "No quotes available. Add one!";
    quoteCategory.innerHTML = "";
    return;
  }
  
  // Generate a random index to select a quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update the text content of the quote and category elements using innerHTML
  quoteText.innerHTML = `"${randomQuote.text}"`;
  quoteCategory.innerHTML = `— ${randomQuote.category}`;
};

/**
 * Creates and appends the "Add Quote" form to the DOM.
 */
const createAddQuoteForm = () => {
  // Create a new h2 element for the heading
  const formHeading = document.createElement('h2');
  formHeading.className = "text-xl font-bold text-gray-700 mb-4";
  formHeading.innerHTML = "Add Your Own Quote";
  
  // Create a container for the input fields
  const inputContainer = document.createElement('div');
  inputContainer.className = "flex flex-col md:flex-row gap-4";

  // Create the quote text input
  newQuoteText = document.createElement('input');
  newQuoteText.id = "newQuoteText";
  newQuoteText.type = "text";
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteText.className = "flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300";

  // Create the quote category input
  newQuoteCategory = document.createElement('input');
  newQuoteCategory.id = "newQuoteCategory";
  newQuoteCategory.type = "text";
  newQuoteCategory.placeholder = "Enter category";
  newQuoteCategory.className = "flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300";

  // Create the "Add Quote" button
  addQuoteBtn = document.createElement('button');
  addQuoteBtn.id = "addQuoteBtn";
  addQuoteBtn.innerHTML = "Add Quote";
  addQuoteBtn.className = "mt-4 w-full bg-gray-800 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-gray-900 transition-colors duration-300 transform hover:scale-105";
  
  // Append all created elements to the form container
  inputContainer.appendChild(newQuoteText);
  inputContainer.appendChild(newQuoteCategory);
  
  formContainer.appendChild(formHeading);
  formContainer.appendChild(inputContainer);
  formContainer.appendChild(addQuoteBtn);

  // Attach event listener to the dynamically created button
  addQuoteBtn.addEventListener('click', addQuote);
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
    newQuoteText.placeholder = text === '' ? "Quote is required!" : newQuoteText.placeholder;
    newQuoteCategory.placeholder = category === '' ? "Category is required!" : newQuoteCategory.placeholder;
    return;
  }

  // Create a new quote object and add it to the quotes array
  const newQuote = { text: text, category: category };
  quotes.push(newQuote);

  // Save the updated quotes array to local storage
  saveQuotes();

  // Clear the input fields for the next quote
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Reset placeholders to their original state
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteCategory.placeholder = "Enter category";

  // Optionally, display the newly added quote immediately
  showRandomQuote();
};

/**
 * Exports the quotes array to a JSON file and prompts the user to download it.
 */
const exportQuotes = () => {
  // Convert the quotes array to a JSON string
  const quotesJson = JSON.stringify(quotes, null, 2);
  // Create a Blob object from the JSON string with the specified MIME type
  const blob = new Blob([quotesJson], { type: 'application/json' });
  // Create a temporary URL for the Blob object
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // The default filename for the download
  document.body.appendChild(a); // Append to the body temporarily
  a.click(); // Programmatically click the link to start the download
  
  // Clean up the temporary URL and element
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
      // Parse the JSON data from the file
      const importedQuotes = JSON.parse(event.target.result);
      // Append the imported quotes to the existing array
      quotes.push(...importedQuotes);
      // Save the combined quotes to local storage
      saveQuotes();
      
      // Update the UI
      showRandomQuote();
      // Use a temporary message box instead of alert()
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
  
  // Read the content of the selected file as text
  fileReader.readAsText(event.target.files[0]);
};

/**
 * A simple demonstration of session storage.
 * Stores the text of the last viewed quote in session storage.
 */
const updateSessionStorage = () => {
  // Get the current quote text
  const currentQuote = quoteText.innerHTML.replace(/"/g, '');
  // Save it to session storage
  sessionStorage.setItem('lastViewedQuote', currentQuote);
};

// Add event listeners
newQuoteBtn.addEventListener('click', () => {
  showRandomQuote();
  updateSessionStorage();
});
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Call functions to initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  createAddQuoteForm();
  showRandomQuote();
  updateSessionStorage();
});
