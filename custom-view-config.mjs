/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'ct-tiny-mce',
  cloudIdentifier: 'gcp-au',
  headers: {
    csp: {
      'connect-src': [
        'self',
        'http://localhost:3001',
        '*.tiny.cloud',
        'https://api.australia-southeast1.gcp.commercetools.com', // Add this
        '*.commercetools.com', // To cover all commercetools subdomains
      ],
      'script-src': ['self', '*.tiny.cloud'],
      'style-src': [
        'self',
        '*.googleapis.com',
        'unsafe-inline',
        '*.tiny.cloud',
      ],
      'font-src': [
        'self',
        'https://fonts.gstatic.com',
        'unsafe-inline',
        '*.tiny.cloud',
      ],
    },
  },
  env: {
    development: {
      initialProjectKey: 'tiny_mc_demo',
    },
    production: {
      customViewId: '${env: CUSTOM_VIEW_ID}',
      url: '${env: CUSTOM_VIEW_URL}',
    },
  },
  additionalEnv: {
    authUrl: '${env: CTP_AUTH_URL}',
    apiUrl: '${env:CTP_API_URL}',
    projectKey: '${env: CTP_PROJECT_KEY}',
  },
  locators: ['products.product_details.general'],
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: ['products.product_details.general'],
};

export default config;
