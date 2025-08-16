document.addEventListener('DOMContentLoaded', () => {

    // Element References
    const quoteDisplay = document.getElementById('quoteDisplay');
    const showNewQuoteButton = document.getElementById('show-new-quote-btn');
    const addQuoteFormPlaceholder = document.getElementById('add-quote-form-placeholder');

    const exportQuotesButton = document.getElementById('export-quotes-btn');
    const importFileInput = document.getElementById('import-file-input');
    const lastViewedQuoteDisplay = document.getElementById('last-viewed-quote-display');

    const categoryFilter = document.getElementById('categoryFilter');
    const syncStatusMessage = document.getElementById('sync-status-message');

    // Variables for dynamically created form elements
    let newQuoteTextInput;
    let newQuoteCategoryInput;
    let addQuoteButton;

    // Section 2: Application State & Data - Your Project Materials
    let quotes = [];
    const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
    const SYNC_INTERVAL_MS = 10000; // Sync every 10 seconds

    //  Helper Functions

    function saveQuotes() {
        try {
            localStorage.setItem('quotes', JSON.stringify(quotes));
            console.log('Quotes saved to local storage.');
        } catch (e) {
            console.error('Error saving quotes to local storage:', e);
            displayNotification('Failed to save quotes. Browser storage might be full.', 'error');
        }
    }

    function loadQuotes() {
        const storedQuotesJson = localStorage.getItem('quotes');
        if (storedQuotesJson) {
            try {
                quotes = JSON.parse(storedQuotesJson);
                console.log('Quotes loaded from local storage.');
            } catch (e) {
                console.error('Error parsing quotes from local storage:', e);
                localStorage.removeItem('quotes');
                quotes = [];
                displayNotification('Corrupted quote data found and cleared. Starting fresh.', 'error');
            }
        } else {
            // Default quotes for initial load if no data in localStorage
            quotes = [
                { id: 'local-1', text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                { id: 'local-2', text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
                { id: 'local-3', text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
                { id: 'local-4', text: "Strive not to be a success, but rather to be of value.", category: "Life" },
                { id: 'local-5', text: "The mind is everything. What you think you become.", category: "Philosophy" }
            ];
            saveQuotes(); // Save these defaults
            console.log('No quotes found. Initializing with default quotes.');
        }
    }

    function displayNotification(message, type = 'info') {
        syncStatusMessage.textContent = message;
        syncStatusMessage.className = ''; // Clear previous classes
        syncStatusMessage.classList.add('sync-status-message');
        syncStatusMessage.style.display = 'block';

        if (type === 'success') syncStatusMessage.classList.add('sync-success');
        else if (type === 'error') syncStatusMessage.classList.add('sync-error');

        setTimeout(() => { syncStatusMessage.style.display = 'none'; }, 3000);
    }



    // Displays a list of quotes (used by filter and random display)
    function displayQuotesList(quotesToDisplay) {
        quoteDisplay.innerHTML = '';
        if (quotesToDisplay.length === 0) {
            quoteDisplay.textContent = 'No quotes found for this selection.';
            return;
        }
        const fragment = document.createDocumentFragment();
        quotesToDisplay.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.innerHTML = `
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-category">- ${quote.category}</p>
                <hr>
            `;
            fragment.appendChild(quoteElement);
        });
        quoteDisplay.appendChild(fragment);
    }

    // Displays a single random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = 'No quotes. Create some!';
            sessionStorage.removeItem('lastViewedQuote');
            lastViewedQuoteDisplay.textContent = 'Last viewed quote (session): Not set.';
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        displayQuotesList([randomQuote]); // Display as a list of one item

        try {
            sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
            lastViewedQuoteDisplay.textContent = `Last viewed quote (session): "${randomQuote.text}"`;
        } catch (e) {
            console.error('Error saving last viewed quote to session storage:', e);
        }
    }

    // Adds a new quote from form input
    function addQuote() {
        const quoteText = newQuoteTextInput.value.trim();
        const quoteCategory = newQuoteCategoryInput.value.trim();

        if (quoteText === '' || quoteCategory === '') {
            alert('Please enter both text and category');
            return;
        }

        const newQuoteObject = {
            id: `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique ID for sync
            text: quoteText,
            category: quoteCategory,
            isLocal: true // Flag for conflict resolution
        };

        quotes.push(newQuoteObject);
        saveQuotes();

        populateCategories(); // Update categories dropdown
        filterQuotes(); // Re-filter and display

        newQuoteTextInput.value = ''; // Clear input fields
        newQuoteCategoryInput.value = '';
        newQuoteTextInput.focus();
        console.log('Quote added: ', newQuoteObject);
    }

    // Exports quotes to a JSON file
    function exportToJsonFile() {
        if (quotes.length === 0) {
            alert('No quotes to export!');
            return;
        }
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        displayNotification('Quotes exported successfully!', 'success');
        console.log('Quotes exported to my_quotes.json');
    }

    // Imports quotes from a JSON file
    function importFromJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => typeof q === 'object' && q !== null && 'text' in q && 'category' in q)) {
                    alert('Invalid JSON file format. Please upload a file containing an array of quote objects with "text" and "category" properties.');
                    return;
                }
                const processedImportedQuotes = importedQuotes.map(q => ({
                    id: q.id || `imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    text: q.text,
                    category: q.category,
                    isLocal: true
                }));
                quotes.push(...processedImportedQuotes);
                saveQuotes();
                populateCategories();
                filterQuotes();
                displayNotification('Quotes imported successfully!', 'success');
                console.log('Quotes imported:', importedQuotes);
            } catch (error) {
                console.error('Error importing quotes:', error);
                displayNotification('Failed to import quotes. Make sure the file is a valid JSON format.', 'error');
            }
            event.target.value = ''; // Clear file input
        };
        fileReader.onerror = () => {
            console.error('Error reading file:', fileReader.error);
            displayNotification('Failed to read file.', 'error');
        };
        fileReader.readAsText(file);
    }

    // Populates the category filter dropdown
    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Keep "All" option
        const uniqueCategories = new Set(quotes.map(quote => quote.category).filter(Boolean)); // Filter out undefined/null categories
        const sortedCategories = Array.from(uniqueCategories).sort();

        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Remember last selected filter
        const savedFilter = localStorage.getItem('lastCategoryFilter');
        if (savedFilter && Array.from(uniqueCategories).includes(savedFilter)) {
            categoryFilter.value = savedFilter;
        } else {
            categoryFilter.value = 'all';
        }
    }

    // Filters quotes based on selected category and displays them
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

        localStorage.setItem('lastCategoryFilter', selectedCategory); // Save filter preference
        displayQuotesList(filteredQuotes);
    }

    // Simulates data syncing with a server
    async function syncWithServer() {
        displayNotification('Syncing with server...', 'info');
        try {
            const response = await fetch(SERVER_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const serverPosts = await response.json();

            // Map server posts to our quote format
            const serverQuotes = serverPosts.map(post => ({
                id: `server-${post.id}`,
                text: post.title,
                category: `User ${post.userId}`
            }));

            // Server Wins:
            const newQuotes = [];
            const serverQuoteIds = new Set(serverQuotes.map(q => q.id));

            serverQuotes.forEach(serverQ => newQuotes.push(serverQ)); // Add all server quotes

            // Add local quotes that are NOT on the server AND were locally created
            quotes.forEach(localQ => {
                if (!serverQuoteIds.has(localQ.id) && localQ.isLocal) {
                    newQuotes.push(localQ);
                }
            });

            quotes = newQuotes;
            saveQuotes();

            populateCategories();
            filterQuotes();

            displayNotification('Data synced successfully!', 'success');
            console.log('Sync successful. Merged quotes:', quotes);

        } catch (error) {
            console.error('Error syncing with server:', error);
            displayNotification('Failed to sync with server. Check console for details.', 'error');
        }
    }




    function createAddQuoteForm() {
        const formHeading = document.createElement('h2');
        formHeading.textContent = 'Add a Quote';
        addQuoteFormPlaceholder.appendChild(formHeading);

        newQuoteTextInput = document.createElement('input');
        newQuoteTextInput.id = 'newQuoteText';
        newQuoteTextInput.type = 'text';
        newQuoteTextInput.placeholder = 'Enter a new quote';
        addQuoteFormPlaceholder.appendChild(newQuoteTextInput);

        newQuoteCategoryInput = document.createElement('input');
        newQuoteCategoryInput.id = 'newQuoteCategory';
        newQuoteCategoryInput.type = 'text';
        newQuoteCategoryInput.placeholder = 'Enter quote category';
        addQuoteFormPlaceholder.appendChild(newQuoteCategoryInput);

        addQuoteButton = document.createElement('button');
        addQuoteButton.id = 'add-quote-btn';
        addQuoteButton.textContent = 'Add Quote';
        addQuoteFormPlaceholder.appendChild(addQuoteButton);

        // Attach event listeners \
        addQuoteButton.addEventListener('click', addQuote);
        newQuoteTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') addQuote();
        });
        newQuoteCategoryInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') addQuote();
        });
    }



    loadQuotes(); //  Load quotes from local storage
    createAddQuoteForm(); //  Dynamically create the add quote form
    populateCategories(); //  Populate categories for the filter dropdown

    // Attach event listeners for main buttons
    showNewQuoteButton.addEventListener('click', showRandomQuote);
    exportQuotesButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    // Load and display last viewed quote from session storage
    const lastSessionQuoteJson = sessionStorage.getItem('lastViewedQuote');
    if (lastSessionQuoteJson) {
        try {
            const lastSessionQuote = JSON.parse(lastSessionQuoteJson);
            lastViewedQuoteDisplay.textContent = `Last viewed quote (session): "${lastSessionQuote.text}"`;
        } catch (e) {
            console.error('Error parsing last viewed quote from session storage:', e);
            sessionStorage.removeItem('lastViewedQuote');
            lastViewedQuoteDisplay.textContent = 'Last viewed quote (session): Not set (corrupted data).';
        }
    } else {
        lastViewedQuoteDisplay.textContent = 'Last viewed quote (session): Not set.';
    }

    // Start periodic server syncing and perform initial sync
    setInterval(syncWithServer, SYNC_INTERVAL_MS);
    syncWithServer(); // Initial sync on load

    // Perform initial display based on current filter (or all quotes)
    filterQuotes();

}); 
