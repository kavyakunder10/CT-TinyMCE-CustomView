/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'ct-tiny-mce',
  cloudIdentifier: 'gcp-au',
  headers: {
    csp: {
      'connect-src': ['self', 'http://localhost:3001', '*.tiny.cloud'],
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
      hostUriPath:
        '/tiny_mc_demo/products/044434cc-8de6-47ff-a307-51116c47a8e9',
    },
    production: {
      customViewId: '${env: CUSTOM_VIEW_ID}',
      url: '${env: CUSTOM_VIEW_URL}',
    },
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
