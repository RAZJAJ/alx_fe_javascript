// Data and DOM
let quotes = [], currentQuotes = [];
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';
const elements = {
  quoteText: document.getElementById('quoteText'),
  quoteCategory: document.getElementById('quoteCategory'),
  categoryFilter: document.getElementById('categoryFilter'),
  notification: document.getElementById('notification'),
  conflictModal: document.getElementById('conflictModal'),
  conflictList: document.getElementById('conflictList')
};

// Core Functions
const showNotification = (msg, type) => {
  elements.notification.textContent = msg;
  elements.notification.className = `mt-4 p-4 rounded-xl shadow-lg bg-${type}-100 text-${type}-800`;
  elements.notification.style.display = 'block';
  setTimeout(() => elements.notification.style.display = 'none', 3000);
};

const saveQuotes = () => localStorage.setItem('quotes', JSON.stringify(quotes));

const loadQuotes = () => {
  quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "Do what you love.", category: "Inspiration" },
    { text: "Life happens.", category: "Life" }
  ];
  saveQuotes();
};

const showRandomQuote = () => {
  if (currentQuotes.length === 0) {
    elements.quoteText.textContent = "No quotes available";
    return;
  }
  const {text, category} = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
  elements.quoteText.textContent = `"${text}"`;
  elements.quoteCategory.textContent = `— ${category}`;
};

const filterQuotes = () => {
  const category = elements.categoryFilter.value;
  currentQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  showRandomQuote();
};

// Server Sync
const fetchQuotes = async () => {
  try {
    const res = await fetch(serverUrl);
    return (await res.json()).map(q => ({id: q.id, text: q.title, category: 'Server'}));
  } catch (e) {
    showNotification('Sync failed', 'error');
    return [];
  }
};

const syncQuotes = async () => {
  const serverQuotes = await fetchQuotes();
  const conflicts = serverQuotes.filter(sq => {
    const lq = quotes.find(q => q.id === sq.id);
    return lq && (lq.text !== sq.text || lq.category !== sq.category);
  });

  if (conflicts.length) {
    elements.conflictList.innerHTML = conflicts.map(c => `
      <li class="mb-4 p-4 border">
        <div>Server: "${c.server.text}" (${c.server.category})</div>
        <div>Local: "${c.local.text}" (${c.local.category})</div>
      </li>
    `).join('');
    elements.conflictModal.classList.remove('hidden');
  } else {
    quotes = [...quotes, ...serverQuotes.filter(sq => !quotes.some(q => q.id === sq.id))];
    saveQuotes();
    showNotification('Synced!', 'success');
  }
};

// Conflict Resolution
const resolveConflict = (action) => {
  const conflicts = Array.from(elements.conflictList.children).map(li => ({
    id: li.querySelector('div').textContent.split(' ')[1],
    server: { text: li.children[0].textContent.split('"')[1], category: li.children[0].textContent.split('(')[1].slice(0, -1) },
    local: { text: li.children[1].textContent.split('"')[1], category: li.children[1].textContent.split('(')[1].slice(0, -1) }
  }));

  conflicts.forEach(c => {
    const index = quotes.findIndex(q => q.id === c.id);
    if (action === 'server') quotes[index] = c.server;
    if (action === 'both') quotes.push(c.server);
  });
  
  elements.conflictModal.classList.add('hidden');
  saveQuotes();
  showNotification('Conflicts resolved', 'success');
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  filterQuotes();
  document.getElementById('syncBtn').addEventListener('click', syncQuotes);
  document.getElementById('newQuoteBtn').addEventListener('click', showRandomQuote);
  elements.categoryFilter.addEventListener('change', filterQuotes);
  document.querySelectorAll('.resolve-btn').forEach(btn => 
    btn.addEventListener('click', (e) => resolveConflict(e.target.dataset.action))
});
