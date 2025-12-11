import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const useDeleteMutation = (queryKey) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios.post('/api/media', { ids, deleteType })

      if (!response.success) {
        throw new Error(response.message || "Operation failed")
      }
      return response
    },
    onSuccess: (data) => {
      toast.success(data.message || "Operation successful")
      queryClient.invalidateQueries(queryKey)
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong")

      
    },
  })
}

export default useDeleteMutation
