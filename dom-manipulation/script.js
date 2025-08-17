let quotes = [];
let currentQuotes = [];
let serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const formContainer = document.getElementById('formContainer');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const syncBtn = document.getElementById('syncBtn');
const notification = document.getElementById('notification');
const conflictModal = document.getElementById('conflictModal');
const conflictList = document.getElementById('conflictList');
const resolveServerBtn = document.getElementById('resolveServerBtn');
const resolveLocalBtn = document.getElementById('resolveLocalBtn');
const keepBothBtn = document.getElementById('keepBothBtn');

// Form elements
let newQuoteText;
let newQuoteCategory;
let addQuoteBtn;

// Notification system
const showNotification = (message, type) => {
  notification.textContent = message;
  notification.style.display = 'block';
  notification.className = 'mt-4 p-4 rounded-xl shadow-lg';
  if (type === 'success') {
    notification.classList.add('bg-green-100', 'text-green-800');
  } else if (type === 'error') {
    notification.classList.add('bg-red-100', 'text-red-800');
  } else {
    notification.classList.add('bg-blue-100', 'text-blue-800');
  }
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};

// Conflict resolution UI
const showConflictModal = (conflicts) => {
  conflictList.innerHTML = '';
  conflicts.forEach(conflict => {
    const li = document.createElement('li');
    li.className = 'mb-4 p-4 border border-gray-200 rounded-lg';
    li.innerHTML = `
      <div class="font-bold mb-2">Conflict for quote ID: ${conflict.id || 'new'}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-50 p-3 rounded-lg">
          <h4 class="font-semibold text-blue-800">Server Version</h4>
          <p>"${conflict.server.text}"</p>
          <p class="text-sm text-blue-600">Category: ${conflict.server.category}</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg">
          <h4 class="font-semibold text-green-800">Local Version</h4>
          <p>"${conflict.local.text}"</p>
          <p class="text-sm text-green-600">Category: ${conflict.local.category}</p>
        </div>
      </div>
    `;
    conflictList.appendChild(li);
  });
  conflictModal.classList.remove('hidden');
};

const hideConflictModal = () => {
  conflictModal.classList.add('hidden');
};

// Data persistence
const saveQuotes = () => {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('lastSync', new Date().toISOString());
};

const loadQuotes = () => {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
    ];
    saveQuotes();
  }
};

// UI updates
const populateCategories = () => {
  const uniqueCategories = new Set(quotes.map(quote => quote.category));
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
};

const filterQuotes = () => {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastFilter', selectedCategory);

  if (selectedCategory === 'all') {
    currentQuotes = quotes;
  } else {
    currentQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  showRandomQuote();
};

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

  highlightQuoteBox();
};

const highlightQuoteBox = () => {
  const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  quoteDisplay.style.backgroundColor = randomColor;
  setTimeout(() => {
    quoteDisplay.style.backgroundColor = '#eef2ff';
  }, 500);
};

// Quote management
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

const addQuote = async () => {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (text === '' || category === '') {
    newQuoteText.placeholder = text === '' ? "Quote is required!" : newQuoteText.placeholder;
    newQuoteCategory.placeholder = category === '' ? "Category is required!" : newQuoteCategory.placeholder;
    return;
  }

  const newQuote = { 
    text, 
    category, 
    timestamp: new Date().toISOString(),
    localId: `local-${Date.now()}`
  };
  quotes.push(newQuote);
  saveQuotes();

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote),
    });
    if (response.ok) {
      const serverQuote = await response.json();
      const localQuoteIndex = quotes.findIndex(q => q.localId === newQuote.localId);
      if (localQuoteIndex !== -1) {
        quotes[localQuoteIndex] = {
          ...quotes[localQuoteIndex],
          id: serverQuote.id,
          localId: undefined
        };
        saveQuotes();
      }
      showNotification('New quote posted to server successfully!', 'success');
    }
  } catch (error) {
    showNotification('Failed to post quote to server. Will sync later.', 'error');
  }

  populateCategories();
  filterQuotes();
  newQuoteText.value = '';
  newQuoteCategory.value = '';
};

// Server synchronization
const fetchQuotesFromServer = async () => {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();
    return serverQuotes.map(q => ({
      id: q.id,
      text: q.title,
      category: 'Server Sync',
      body: q.body,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    showNotification('Failed to fetch quotes from server.', 'error');
    return [];
  }
};

const identifyConflicts = (localQuotes, serverQuotes) => {
  const conflicts = [];
  
  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotes.find(q => q.id === serverQuote.id);
    if (localQuote) {
      if (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category) {
        conflicts.push({
          id: serverQuote.id,
          server: serverQuote,
          local: localQuote
        });
      }
    }
  });
  
  return conflicts;
};

const resolveConflicts = (conflicts, resolution) => {
  conflicts.forEach(conflict => {
    const localIndex = quotes.findIndex(q => q.id === conflict.id);
    
    if (localIndex !== -1) {
      if (resolution === 'server') {
        quotes[localIndex] = conflict.server;
      } else if (resolution === 'local') {
        // Keep local version
      } else if (resolution === 'both') {
        quotes[localIndex].text = `[Modified] ${quotes[localIndex].text}`;
        quotes.push(conflict.server);
      }
    }
  });
  
  saveQuotes();
  populateCategories();
  filterQuotes();
  hideConflictModal();
  showNotification('Conflicts resolved successfully!', 'success');
};

const mergeQuotes = (serverQuotes) => {
  const conflicts = identifyConflicts(quotes, serverQuotes);
  
  if (conflicts.length > 0) {
    showConflictModal(conflicts);
    return false;
  }
  
  serverQuotes.forEach(serverQuote => {
    const existsLocally = quotes.some(q => q.id === serverQuote.id);
    if (!existsLocally) {
      quotes.push(serverQuote);
    }
  });
  
  return true;
};

const syncQuotes = async () => {
  showNotification('Syncing with server...', 'info');
  const serverQuotes = await fetchQuotesFromServer();
  
  if (serverQuotes.length > 0) {
    const mergeSuccess = mergeQuotes(serverQuotes);
    
    if (mergeSuccess) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification('Quotes synced with server!', 'success');
    }
  } else {
    showNotification('Could not retrieve quotes from server.', 'error');
  }
};

// Import/export
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

const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification('Quotes imported successfully!', 'success');
      setTimeout(syncQuotes, 2000);
    } catch (error) {
      showNotification('Error importing file: ' + error.message, 'error');
    }
  };
  fileReader.readAsText(event.target.files[0]);
};

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);
syncBtn.addEventListener('click', syncQuotes);
resolveServerBtn.addEventListener('click', () => {
  const conflicts = Array.from(conflictList.children).map((_, index) => {
    return {
      id: conflictList.children[index].querySelector('.font-bold').textContent.replace('Conflict for quote ID: ', ''),
      server: { 
        text: conflictList.children[index].querySelector('.bg-blue-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-blue-600').textContent.replace('Category: ', '')
      },
      local: { 
        text: conflictList.children[index].querySelector('.bg-green-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-green-600').textContent.replace('Category: ', '')
      }
    };
  });
  resolveConflicts(conflicts, 'server');
});
resolveLocalBtn.addEventListener('click', () => {
  const conflicts = Array.from(conflictList.children).map((_, index) => {
    return {
      id: conflictList.children[index].querySelector('.font-bold').textContent.replace('Conflict for quote ID: ', ''),
      server: { 
        text: conflictList.children[index].querySelector('.bg-blue-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-blue-600').textContent.replace('Category: ', '')
      },
      local: { 
        text: conflictList.children[index].querySelector('.bg-green-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-green-600').textContent.replace('Category: ', '')
      }
    };
  });
  resolveConflicts(conflicts, 'local');
});
keepBothBtn.addEventListener('click', () => {
  const conflicts = Array.from(conflictList.children).map((_, index) => {
    return {
      id: conflictList.children[index].querySelector('.font-bold').textContent.replace('Conflict for quote ID: ', ''),
      server: { 
        text: conflictList.children[index].querySelector('.bg-blue-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-blue-600').textContent.replace('Category: ', '')
      },
      local: { 
        text: conflictList.children[index].querySelector('.bg-green-50 p').textContent.replace(/"/g, ''),
        category: conflictList.children[index].querySelector('.text-green-600').textContent.replace('Category: ', '')
      }
    };
  });
  resolveConflicts(conflicts, 'both');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  filterQuotes();
  
  // Check if we need to sync with the server
  const lastSync = localStorage.getItem('lastSync');
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
  
  if (!lastSync || lastSync < oneHourAgo) {
    setTimeout(syncQuotes, 2000);
  }
});
