import { config } from '@/constants/config'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../useAuth'

export default function useProfile() {
  const { auth } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await axios.get(`${config.URL}/auth/get-profile`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      })
    }
  })

  return {}
}
