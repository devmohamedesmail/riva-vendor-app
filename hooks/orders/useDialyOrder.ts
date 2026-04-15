import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { config } from '@/constants/config'


export default function useDialyOrder() {
     const { data, isLoading , error , refetch } = useQuery({
        queryKey: ["dialy-orders"],
        queryFn: () => axios.get(`${config.URL}/orders/dialy/orders`).then((res) => res?.data),
    })
    
  return {data, isLoading , error , refetch}
}
