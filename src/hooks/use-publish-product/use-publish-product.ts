import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

// Corrected GraphQL mutation for publishing a product
const PUBLISH_PRODUCT = gql`
  mutation PublishProduct($productId: String!, $version: Long!) {
    updateProduct(
      id: $productId
      version: $version
      actions: [{ publish: {} }] # Corrected action for publishing
    ) {
      id
      version
      masterData {
        published # Correct query to check if the product is published
      }
    }
  }
`;

export const usePublishProduct = () => {
  const [publishProduct, { loading, error }] = useMutation(PUBLISH_PRODUCT, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM, // Correct GraphQL target
    },
  });

  // Function to publish the product
  const publish = async (productId: string, version: number) => {
    try {
      const result = await publishProduct({
        variables: {
          productId,
          version,
        },
      });

      console.log('Publish result:', result); // Log the result for debugging
      return result.data.updateProduct;
    } catch (error:any) {
      console.error(
        'Publish error details:',
        error.networkError || error.graphQLErrors || error
      );
      throw error;
    }
  };

  return {
    publish,
    loading,
    error,
  };
};
