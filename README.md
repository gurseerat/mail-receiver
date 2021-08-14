# Mail Service (IMAP and POP3)

##### Technologies used
1. Angular 12 (Frontend framework)
2. NodeJs (Backend framework)

##### Packages used
1. Bootstrap (for UI responsiveness)
2. [Imap](https://www.npmjs.com/package/imap) (for IMAP connection)
3. [Poplib](https://www.npmjs.com/package/poplib) (for POP3 connection)
4. [Angular2-Toaster](https://www.npmjs.com/package/angular2-toaster) (to display notifications for error)
5. [Ngx-ui-loader](https://www.npmjs.com/package/ngx-ui-loader) (for loader)

## Frontend (./frontend)
##### Components
1. AppComponent: Root component
2. ConnectionComponent: Contains the form for API call (Event: Submit button)
3. EmailListComponent: Child component to display list of emails on left side (Event: click on mail item)
4. EmailViewComponent: Child component to display HTML view of emails (Event: no event)

##### Interfaces
1. Response Interface: To log proper response for all API calls

##### Services
1. WebService: Base service for all HTTP calls with proper error handling
2. MailService: Service designed specifically for all API calls related to emails

##### Other files
1. AppGlobals: Contains all constant values

## Backend (./backend)
Entry: app.ts
App.ts contains routes and cors registrations and starts the server at port **3000**.

##### Controllers
1. BaseController: Inherited in other controllers for standardised response and request body data.
2. MailController: REST API to get all emails

##### Routes
1. MailRoutes(/mail): API URL to fetch all emails. (/mail/getAll)

##### Interfaces
1. BaseInterface: Interface for request data and response data
2. MailInterface: Interface for payload required for mail connection

##### Services
1. MailService: **Contains the main mail connection to IMAP and POP3**.
connectToImap(): Connect to imap connection with requested mail connection data
connectToPop(): Connect to pop3 connection with requested mail connection data

Accounts used while development: Gmail and Outlook

## Deployment
1. Run `docker pull gurseerat/gurseerat_mailservice` to pull the image.
2. Run `docker run -d --name mailservice -p 8080:8080 -p 3000:3000 gurseerat/gurseerat_mailservice` to deploy the image.
3. Go to [http://localhost:8080](http://localhost:8080) to access the web application.
