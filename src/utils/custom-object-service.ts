import axios from 'axios';


export const fetchSelectedAttributes = async (
  authToken: string,
  productId: string
) => {
  try {
    const response = await axios.get(
      `https://api.australia-southeast1.gcp.commercetools.com/tiny_mc_demo/custom-objects/selectedAttributes/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data.value.selectedAttributes;
  } catch (error) {
    console.error('Error fetching selected attributes:', error);
    throw error;
  }
};


export const saveSelectedAttributesToCustomObject = async (
  authToken: string,
  productId: string,
  updatedAttributes: any
) => {
  try {
    await axios.post(
      `https://api.australia-southeast1.gcp.commercetools.com/tiny_mc_demo/custom-objects`,
      {
        container: 'selectedAttributes',
        key: productId,
        value: {
          selectedAttributes: updatedAttributes,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Selected attributes saved to custom object.');
  } catch (error) {
    console.error('Error saving selected attributes:', error);
    throw error;
  }
};
