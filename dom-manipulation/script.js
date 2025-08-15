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
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const formContainer = document.getElementById('formContainer');

// Variables for form elements that will be created dynamically
let newQuoteText;
let newQuoteCategory;
let addQuoteBtn;

/**
 * Updates the DOM with a randomly selected quote from the quotes array.
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

  // Clear the input fields for the next quote
  newQuoteText.value = '';
  newQuoteCategory.value = '';

  // Reset placeholders to their original state
  newQuoteText.placeholder = "Enter a new quote";
  newQuoteCategory.placeholder = "Enter category";

  // Optionally, display the newly added quote immediately
  showRandomQuote();
};

// Add event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);

// Call functions to initialize the page
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
});
