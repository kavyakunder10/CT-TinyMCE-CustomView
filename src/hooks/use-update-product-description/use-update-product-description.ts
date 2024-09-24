import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

const UPDATE_PRODUCT_DESCRIPTION = gql`
  mutation UpdateProductDescription(
    $productId: String!
    $version: Long!
    $locale: Locale!
    $description: String!
  ) {
    updateProduct(
      id: $productId
      version: $version
      actions: [
        {
          setDescription: {
            description: { locale: $locale, value: $description }
          }
        }
      ]
    ) {
      id
      version
      masterData {
        current {
          description(locale: $locale)
        }
      }
    }
  }
`;

export const useUpdateProductDescription = () => {
  const [updateProductDescription, { loading, error }] = useMutation(
    UPDATE_PRODUCT_DESCRIPTION,
    {
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM, // Ensure the correct GraphQL target is set here
      },
    }
  );

  const updateDescription = async (
    productId: string,
    version: number,
    locale: string,
    description: string
  ) => {
    try {
      const result = await updateProductDescription({
        variables: {
          productId,
          version,
          locale,
          description,
        },
      });
      return result.data.updateProduct;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateDescription,
    loading,
    error,
  };
};
