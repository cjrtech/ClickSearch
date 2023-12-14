## Development Instructions
in your terminal (make sure you are in project directory), run:

### `npm install`

installs all dependencies for the project

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles extension in production mode and optimizes the build for the best performance. <br />
Navigate to chrome://extensions and click 'load unpacked'<br />
Select build folder<br />
Each time you add code and want to test, build again and click the refresh button on the extension from chrome://extensions<br />
whenever errors occur in the extension, clear them before refreshing the extension


### Create .env file

create a .env file at the root of the project. inside of the file assign the following environment variables: <br />
REACT_APP_OPENAI_API_KEY="PLACE KEY HERE"
REACT_APP_YOUTUBE_API_KEY="PLACE KEY HERE" <br />
<br />
.env files are ignored by git via .gitignore, do not edit that file


