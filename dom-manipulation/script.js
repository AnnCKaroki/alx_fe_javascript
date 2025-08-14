/*Manage an array of quote objects where each quote has a text and a category
Implement functions to display a random quote and to add new quotes
showRandomQuote and createAddQuoteForm` respectively*/

document.addEventListener('DOMContentLoaded', () => {

    //get elements
    const quoteDisplay = document.getElementById('quoteDisplay');

    const newQuote = document.getElementById('newQuote');

    const addQuoteFormPlaceholder = document.getElementById('add-quote-form-placeholder');

    let quotes = [{text: "Tis better to have loved and lost than never to have loved at all.", category: "love"},
        {text: "By all means, marry. If you get a good wife, you'll become happy; if you get a bad one, you'll become a philosopher.", category:"witty"},
        {text: "Opportunities don't happen, you create them.", category: "motivational"},
        {text: "To be, or not to be, that is the question.", category: "deep"}
    ]

    let newQuoteTextInput;
    let newQuoteCategoryInput;
    let addQuoteButton;

    function showRandomQuote() {

        quoteDisplay.innerHTML = '';

        let randomIndex = Math.floor(Math.random() * quotes.length)

        let randomQuote = quotes[randomIndex]

        quoteDisplay.innerHTML =`
        <p class= "quote-text">${randomQuote.text}</p>
        <p class="quote-category">${randomQuote.category}</p>`;
    }

    function addQuote() {
        const quoteText = newQuoteTextInput.value.trim();

        const quoteCategory = newQuoteCategoryInput.value.trim();

        if (quoteText === '' || quoteCategory === '') {
            alert('Please enter both a quote and category');
            return;
        }

        const newQuoteObject = {
        text: quoteText,
        category: quoteCategory,
    }


    quotes.push(newQuoteObject)

    newQuoteTextInput = '';
    newQuoteCategoryInput = '';

    showRandomQuote();

    console.log('Quote added: ', newQuoteObject)
    }


    function createAddQuoteForm() {

        const formHeading = document.createElement('h2');
        formHeading.textContent = 'Add Your Own Quote';
        addQuoteFormPlaceholder.appendChild(formHeading);

        //create elements dynamically

        newQuoteTextInput = document.createElement('input'); // Assign to the outer-scoped variable
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
        addQuoteFormPlaceholder.append(addQuoteButton);

        //event listeners
        addQuoteButton.addEventListener('click', addQuote)

        newQuoteTextInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                addQuote();
            }
        });

        newQuoteCategoryInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                addQuote();
            }
        });

    }

    createAddQuoteForm();//setup the form

    newQuote.addEventListener('click', showRandomQuote);

    showRandomQuote(); //when page first loads

})
