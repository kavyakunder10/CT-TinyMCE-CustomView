import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type { ApolloError } from '@apollo/client';
import FetchProductDescriptionQuery from './fetch-product-description.ctp.graphql';

// Define the type for the query result
type TProductDescriptionQuery = {
  product: {
    id: string;
    masterData: {
      current: {
        description: string;
      };
    };
  };
};

// Define the hook type
type TUseProductDescription = (
  productId: string,
  locale?: string
) => {
  productDescription?: string;
  error?: ApolloError;
  loading: boolean;
};

// Create the hook
export const useProductDescription: TUseProductDescription = (
  productId,
  locale = 'en'
) => {
  const { data, error, loading } = useMcQuery<TProductDescriptionQuery>(
    FetchProductDescriptionQuery,
    {
      variables: { productId, locale }, // Use the productId passed as argument
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  return {
    productDescription: data?.product?.masterData?.current?.description || '',
    error,
    loading,
  };
};
