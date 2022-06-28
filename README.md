# GuestME Backend

Backend API server for Guestme App

## Development Environment

Details about how to configure the development environment.

---

### Extension Installation

Please ensure the following extensions are installed:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (new)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) (optional)

---

### VSCode Settings

Please open the settings.json file in your VSCode. You can do so by:

1. Press `Ctrl+Shift+p`
2. Enter `settings.json`
3. Select: `Preferences: Open Settings (JSON)`

Then copy and paste the following into the file and save:

```
// <-- EDITOR --> //
  "editor.tabSize": 2,
  "editor.formatOnPaste": true,
  "editor.formatOnType": true,
  "editor.formatOnSave": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.addMissingImports": true,
    "source.organizeImports": true,
    "source.autoFixOnSave": true
  },
  "editor.suggestSelection": "first",
  "diffEditor.ignoreTrimWhitespace": false,
  "files.trimTrailingWhitespace": true,
  // <-- ESLINT --> //
  "eslint.quiet": false,
  "eslint.format.enable": true,
  // <-- LANGUAGE-SPECIFIC SETTINGS --> //
  "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets": true,
  "javascript.preferences.quoteStyle": "single",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[javascriptreact]": {
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
```

**Warning!** you must install the extensions first otherwise VSCode may complain that some of the settings do not exist.

---

### Env File

| Key                   | Value                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| PORT                  | 8080                                                                                    |
| DB_DIALECT            | MongoDB                                                                                 |
| DB_HOST               | MongoDB Atlas                                                                           |
| DATABASE_ACCESS       | Contact Admin for database url                                                          |
| DB_NAME               | guest_me_app                                                                            |
| MODE                  | development                                                                             |
| DOMAIN                | localhost (guestmeapp.heroku.com in production, if not specified defaults to localhost) |
| JWT_SECRET_ACCESS     | JWT Secret get from Heroku or generate using node crypto module                         |
| AWS_ACCESS_KEY_ID     | Get from admin                                                                          |
| AWS_SECRET_ACCESS_KEY | Get from admin                                                                          |
| S3_BUCKET             | teamneptune                                                                             |

---

### Scripts

The following is a summary of the scripts (more will be added later):

| Script | Command       | Description                         |
| ------ | ------------- | ----------------------------------- |
| test   | npm run test  | Not currently implemented.          |
| dev    | npm run dev   | Starts the development environment. |
| build  | npm run build | Builds the application.             |

---

### Running The Project

Ensure you first run `npm install`. Then there are two methods to run the app:

**Development**

1. Ensure your machine is connected to the Internet for database access to MongoDB Atlas Cloud.

2. `npm run start` will start the application in development mode. The application should hot reload after saving changes to a file

3. Whenever a new endpoint is added, please also add it to the `endpoints` folder.

### Testing

When launching the app you should see a message like this in the console:

`🛫 Server ready at http://localhost:8080/`

---
