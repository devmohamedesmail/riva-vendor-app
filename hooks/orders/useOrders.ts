// import { config } from '@/constants/config';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useAuth } from '@/hooks/auth/useAuth';

// export default function useOrders() {
//     const { auth } = useAuth();
//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['orders'],
//         queryFn: () => axios.get(`${config.URL}/orders`, {
//             headers: {
//                 Authorization: `Bearer ${auth?.token}`,
//             },
//         }).then(res => res.data),
       
//     })
    
//     return {
//         orders: data,
//         isLoading,
//         error,
//         refetch,
//     }
// }


import { config } from '@/constants/config';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/auth/useAuth';

export default function useOrders() {
    const { auth } = useAuth();

    const query = useInfiniteQuery({
        queryKey: ['orders'],
        initialPageParam: 1,

        queryFn: async ({ pageParam }) => {
            const res = await axios.get(
                `${config.URL}/orders?page=${pageParam}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`,
                    },
                }
            );

            return res.data;
        },

        getNextPageParam: (lastPage) => {
            const pagination = lastPage.data.pagination;

            return pagination.current_page < pagination.total_pages
                ? pagination.current_page + 1
                : undefined;
        },
    });

    return {
        ...query,

        orders:
            query.data?.pages.flatMap(page => page.data.orders) ?? [],

        pagination:
            query.data?.pages.at(-1)?.data.pagination,
    };
}
