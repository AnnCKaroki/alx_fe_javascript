document.addEventListener('DOMContentLoaded', () => {

    //element references

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const dynamicFormContainer = document.querySelector('.dynamic-form-container');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');

    let newQuoteTextInput;
    let newQuoteCategoryInput;
    let addQuoteButton;

    let quotes = [];

    //[{text: "Long live the clan", category: "shadomado"}]

    //function to load quotes
    function loadQuotes() {

        const loadedQuotes = localStorage.getItem('quotes');
        quotes = JSON.parse(loadedQuotes)
    }

    //add a function for saving quotes
    function saveQuotes() {
        try {

            localStorage.setItem('savedQuotes', JSON.stringify(quotes))
            console.log('Quotes saved successfuly to local storage')

        } catch (e) {
            console.error('Error saving quotes to local storage', e);
            alert('Failed to save quotes')

        }
    }


    function showRandomQuote() {

        if (quotes.length === 0) {
            quoteDisplay.textContent = 'No quotes. Create some!'
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex]

        quoteDisplay.innerHTML = `<p>${randomQuote.text}</p>
        <p>${randomQuote.category}</p>`


        //implement session storage
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote))
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
        saveQuotes();
    }

    function createAddQuoteForm() {
        //creating a form to accept quotes from the user
        //heading, textInput, categoryInput - input,id,type,placeholder
        //addButton are created dynamically
        const formHeading = document.createElement('h2');
        formHeading.textContent = 'Add a Quote';
        dynamicFormContainer.appendChild(formHeading)


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

    function exportToJson(event) {
        const dataStr = JSON.stringify(quotes, null, 2); //access quotes
        const blob = new Blob([dataStr], { type: "application/json" }); //json file
        const url = URL.createObjectURL(blob); //temp url
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();
        URL.revokeObjectURL(url);
}


    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
  }




loadQuotes();
createAddQuoteForm();
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
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
importBtn.addEventListener('click', importFromJsonFile);
exportBtn.addEventListener('click', exportToJson)
})
