# Overview
This is an ALX FrontEnd Project aimed at cementing my knowledge on DOM(Document Object Model) Manipulation and Web storage.

# My Process

## User stories
1. *Category-Based Quote Display*: As a user, I want to click on a category so that I can view all quotes belonging to that category.
2. *Add Quotes via UI*: As a user, I want to add new quotes through a form in the UI so that I can expand my quote collection easily.
3. *Random Quote Generator*: As a user, I want to click a "Show New Quote" button so that a randomly selected quote is displayed.
4. *Persistent Storage*: As a user, I want my quotes saved automatically when I exit the app so that they are retrieved the next time I open it.
5. *Export Quotes to JSON*: As a user, I want to click an "Export" button so that I can download my quotes as a JSON file.
6. *Import Quotes from JSON*: As a user, I want to upload a JSON file so that its contents are added to my quote collection.
7. *API Data Sync*: As a user, I want to fetch quotes from and post quotes to an external API so that my collection stays updated across devices.
8. *Server-Local Storage Sync*: As a user, I want to ensure the server and local storage are always synchronized so that I see consistent data everywhere.
9. *Update Notifications*: As a user, I want to receive notifications when data is updated or conflicts are resolved so that I’m aware of changes.
10. *Manual Conflict Resolution*: As a user, I want to manually resolve conflicts (e.g., choose which version to keep) so that I have control over my data.

## Acceptance Criteria
1. *Category-Based Quote Display*:
   - Clicking a category filters and displays only quotes from that category.
   - The UI updates dynamically without a page reload.

2. *Add Quotes via UI*:
   - A form with fields for quote text, author, and category is provided.
   - Submitting the form adds the quote to local storage and updates the UI.

3. *Random Quote Generator*:
   - Button click fetches a random quote from the stored collection.
   - The quote is displayed prominently on the screen.

4. *Persistent Storage*:
   - Quotes are saved to local storage/API on app close.
   - Quotes are loaded automatically upon app restart.

5. *Export Quotes to JSON*:
   - Clicking the button generates a JSON file containing all quotes.
   - The file is automatically downloaded to the user’s device.

6. *Import Quotes from JSON*:
   - File upload parses JSON and merges quotes into the existing array.
   - Duplicates are handled (either skipped or flagged).

7. *API Data Sync*:
   - API endpoints are integrated for GET (fetch) and POST (add) operations.
   - Errors (e.g., network issues) are displayed clearly.

8. *Server-Local Storage Sync*:
   - Changes are synced to the server in real-time (or on save).
   - Conflicts (e.g., offline edits) are detected and flagged.

9. *Update Notifications*:
   - Alerts/toasts appear for successful updates or conflicts.
   - Notifications are dismissible and non-intrusive.

10. *Manual Conflict Resolution*:
   - Conflicts are displayed side-by-side with options to "Keep Local" or "Keep Server."
   - Resolution updates both local storage and server.


## Built with:
- HTML5
- JavaScript
- Application Programming Interface

## What I learnt
- Advanced DOM manipulation
- The difference between localStorage and sessionStorage and how to use each
- How to randomly select items in an array using the Math.random() method

## Useful Resources

## Author
Ann Charity
