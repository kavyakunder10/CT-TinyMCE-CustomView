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


## TinyMCE API Key

This project uses [TinyMCE](https://www.tiny.cloud/) for the rich-text editor. To use TinyMCE, you need an API key.

### How to Get an API Key
1. Register on [TinyMCE's website](https://www.tiny.cloud/get-tiny/).
2. Generate an API key after signing up.

![image](https://github.com/user-attachments/assets/f5226691-21bf-4ece-ae16-39e952251d77)

### Using the API Key
Once you have the API key, add it to the relevant configuration file or environment variable. Here's an example:

```javascript
<Editor
  apiKey: 'YOUR_API_KEY',
></Editor>
});
```

## AWS Amplify Deployment 

### Step 1. Prepare your react application for production build : 

 - Make sure your React app is ready for production

         npm run build 

 - This will create a build (or dist or public) directory with your production-ready files.

### Step 2. Create an AWS Amplify App

- Log in to the [AWS Amplify Console.](https://aws.amazon.com/amplify/)
- Search for AWS Amplify in search bar and click on "create new app".
<img width="1400" alt="Screenshot 2024-08-13 at 5 11 21 PM" src="https://github.com/user-attachments/assets/84987b4d-65df-4950-a9a0-8cc7bb3c34e9">


### Step 3. Connect Your Repository

- **Choose a repository provider**: Select your Git provider(e.g., GitHub, GitLab, Bitbucket, AWS CodeCommit) and authorize AWS Amplify to access your repository.
<img width="1400" alt="Screenshot 2024-08-13 at 5 11 53 PM" src="https://github.com/user-attachments/assets/2235c14f-8001-4bde-a96c-82015012c9d2">

- **Select a repository**: Choose the repository and branch where your React app is stored.
<img width="1400" alt="Screenshot 2024-08-13 at 5 12 46 PM" src="https://github.com/user-attachments/assets/408ae2f6-4aba-4ad1-8fbd-d5c020525408">


- **Configure build settings**:
    - Amplify will automatically detect your React app and suggest a build configuration.
    - You can review or edit the build settings. If needed, you can specify the build command (npm run build) and the directory where the build output is located (build or dist or public).
<img width="1400" alt="Screenshot 2024-08-13 at 5 13 33 PM" src="https://github.com/user-attachments/assets/cf9bfe46-1970-4a5f-93e0-e489d6829270">


### Step 4. Configure App Settings
- **Environment variables**: If your React app requires environment variables, add them in the "Environment Variables" section.


### Step 5. Deploy the App
- **Deploy**: Click Save and deploy. AWS Amplify will build your app and deploy it to a globally available CDN (via Amazon CloudFront).
<img width="1400" alt="Screenshot 2024-08-13 at 5 14 19 PM" src="https://github.com/user-attachments/assets/789152fe-3d9b-42a5-8508-a1b88f1a2da2">

- **Monitor the deployment**: The Amplify Console will show the progress of your deployment. Once the deployment is complete, your app will be live.

This will deploy your custom application on AWS Amplify and provide you with a domain link.

Finally, update the CUSTOM_VIEW_URL in the .env file with the Amplify link.
