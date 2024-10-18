import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

// GraphQL mutation to update product attributes
const UPDATE_PRODUCT_ATTRIBUTES = gql`
  mutation UpdateProductAttributes(
    $productId: String!
    $version: Long!
    $actions: [ProductUpdateAction!]!
  ) {
    updateProduct(id: $productId, version: $version, actions: $actions) {
      id
      version
      masterData {
        current {
          allVariants {
            id
            attributesRaw {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const useUpdateProductAttributes = () => {
  const [updateProductAttributes, { loading, error }] = useMutation(
    UPDATE_PRODUCT_ATTRIBUTES,
    {
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM, // Ensure the correct GraphQL target
      },
    }
  );

  // Function to update attributes
  const updateAttributes = async (
    productId: string,
    version: number,
    attributes: { name: string; value: string; variantId: number }[] // Add variantId here
  ) => {
    try {
      // Map over the attributes, including variantId
      const actions = attributes.map((attr) => ({
        setAttribute: {
          name: attr.name,
          value: JSON.stringify(attr.value),
          variantId: attr.variantId, // Ensure that variantId is passed
        },
      }));

      // Send the properly formatted actions
      const result = await updateProductAttributes({
        variables: {
          productId,
          version,
          actions,
        },
      });

      return result.data.updateProduct;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateAttributes,
    loading,
    error,
  };
};
