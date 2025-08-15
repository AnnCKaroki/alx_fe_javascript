document.addEventListener('DOMContentLoaded', () => {

    //element references

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const dynamicFormContainer = document.querySelector('.dynamic-form-container');

    let quotes = [];
    //[{text: "Long live the clan", category: "shadomado"}]


    function showRandomQuote() {

        if (quotes.length === 0) {
            quoteDisplay.textContent = 'No quotes. Create some!'
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex]

        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p>
        <p>${randomQuote.category}</p>`
    }

    function addQuote(){

        //get input, add it, push to quotes

        const quoteText = newQuoteTextInput.value.trim();
        const quoteCategory = newQuoteCategoryInput.value.trim();

        //ensure it is not empty

        if (quoteText === '' || quoteCategory === '') {
            alert('Please enter both text and category')
            return;
        }

        const newQuoteObject = {
            text: quoteText,
            category: quoteCategory
        }

        quotes.push(newQuoteObject);
    }

    function createAddQuoteForm() {
        //creating a form to accept quotes from the user
        //heading, textInput, categoryInput - input,id,type,placeholder
        //addButton are created dynamically
        const formHeading = document.createElement('h2');
        formHeading.textContent = 'Add a Quote';


        //elements creation
        newQuoteTextInput = document.createElement('input');
        newQuoteTextInput.id = 'newQuoteText';
        newQuoteTextInput.type = 'text';
        newQuoteTextInput.placeholder = 'Enter a new quote';
        dynamicFormContainer.appendChild(newQuoteTextInput);

        newQuoteCategoryInput = document.createElement('input');
        newQuoteCategoryInput.id = 'newQuoteCategory';
        newQuoteCategoryInput.type = 'text';
        newQuoteCategoryInput.placeholder = 'Enter quote category';
        dynamicFormContainer.appendChild(newQuoteCategoryInput);

        addQuoteButton = document.createElement('button');
        addQuoteButton.id = 'add-quote-btn';
        addQuoteButton.textContent = 'Add Quote';
        dynamicFormContainer.append(addQuoteButton);
    }
showRandomQuote();
addQuote();
createAddQuoteForm();
})
