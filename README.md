# Custom Views

Prerequisites
Before you start development, make sure to have the following:
* A Merchant Center account and a Project.
* Basic knowledge of React and some experience working with web applications.
* Node.js installed (version 18.x, recommended >=20).
* A Node.js package manager such as yarn, pnpm or npm.

## Install a starter template
The easiest way to get started is to use one of the starter templates. To create a new Custom View from a starter template using the `create-mc-app` package, run the following command:
Create new Custom View from the starter templateTerminal

`npx @commercetools-frontend/create-mc-app@latest \
 my-new-custom-view-project \
 --application-type custom-view \
 --template starter`

After the installation is complete, issue the following command to start the development server:


`cd my-new-custom-view-project
yarn start`

This command opens a new browser tab pointing to http://localhost:3001. You'll be redirected to the Merchant Center login page, where you need to enter your Merchant Center account credentials. After authentication, you'll be redirected to the local development server and have access to the Project.

The following image shows the local development landing page for the starter template:

![image](https://github.com/user-attachments/assets/2cb7e6d2-2aef-4b1d-890d-465f733c6519)

