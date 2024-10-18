import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import type { ApolloError } from '@apollo/client';
import FetchProductDescriptionAndAttributesQuery from './fetch-product-description.ctp.graphql';

// Define the type for the query result
type TProductDescriptionAndAttributesQuery = {
  product: {
    id: string;
    version: number;
    masterData: {
      current: {
        description: string;
        allVariants: Array<{
          id: string;
          attributesRaw: Array<{ name: string; value: any }>;
        }>;
      };
    };
  };
};

// Define the hook type
type TUseProductDescriptionAndAttributes = (
  productId: string,
  locale?: string
) => {
  productDescription?: string;
  productAttributes?: Array<{ name: string; value: any }>;
  productVersion?: number;
  error?: ApolloError;
  loading: boolean;
};

// Create the hook
export const useProductDescriptionAndAttributes: TUseProductDescriptionAndAttributes =
  (productId, locale = 'en') => {
    const { data, error, loading } =
      useMcQuery<TProductDescriptionAndAttributesQuery>(
        FetchProductDescriptionAndAttributesQuery,
        {
          variables: { productId, locale },
          context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          },
        }
      );

    // Merge all attributes from all variants into one array
    const productAttributes =
      data?.product?.masterData?.current?.allVariants.flatMap(
        (variant) => variant.attributesRaw
      ) || [];

    // Return productDescription, productAttributes, and productVersion
    return {
      productDescription: data?.product?.masterData?.current?.description || '',
      productAttributes,
      productVersion: data?.product?.version,
      error,
      loading,
    };
  };
