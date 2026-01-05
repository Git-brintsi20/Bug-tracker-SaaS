import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bugs, comments } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useOrganization } from '@/lib/contexts/OrganizationContext'

// Bug Queries
export function useBugs(filters?: any) {
  const { currentOrg } = useOrganization()
  
  return useQuery({
    queryKey: ['bugs', currentOrg?.id, filters],
    queryFn: async () => {
      if (!currentOrg) throw new Error('No organization selected')
      const response = await bugs.getAll(currentOrg.id, filters)
      return response.data
    },
    enabled: !!currentOrg,
  })
}

export function useBug(bugId: string | null) {
  return useQuery({
    queryKey: ['bug', bugId],
    queryFn: async () => {
      if (!bugId) throw new Error('No bug ID provided')
      const response = await bugs.getById(bugId)
      return response.data
    },
    enabled: !!bugId,
  })
}

export function useSearchBugs(searchParams: any) {
  const { currentOrg } = useOrganization()
  
  return useQuery({
    queryKey: ['bugs', 'search', currentOrg?.id, searchParams],
    queryFn: async () => {
      if (!currentOrg) throw new Error('No organization selected')
      const response = await bugs.search(currentOrg.id, searchParams)
      return response.data
    },
    enabled: !!currentOrg && Object.keys(searchParams).length > 0,
  })
}

export function useBugStatistics() {
  const { currentOrg } = useOrganization()
  
  return useQuery({
    queryKey: ['bugs', 'statistics', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg) throw new Error('No organization selected')
      const response = await bugs.statistics(currentOrg.id)
      return response.data
    },
    enabled: !!currentOrg,
  })
}

// Bug Mutations
export function useCreateBug() {
  const queryClient = useQueryClient()
  const { currentOrg } = useOrganization()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: any) => {
      if (!currentOrg) throw new Error('No organization selected')
      const response = await bugs.create({ ...data, organizationId: currentOrg.id })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs', currentOrg?.id] })
      toast({
        title: 'Success',
        description: 'Bug created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create bug',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateBug() {
  const queryClient = useQueryClient()
  const { currentOrg } = useOrganization()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await bugs.update(id, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bugs', currentOrg?.id] })
      queryClient.invalidateQueries({ queryKey: ['bug', variables.id] })
      toast({
        title: 'Success',
        description: 'Bug updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update bug',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteBug() {
  const queryClient = useQueryClient()
  const { currentOrg } = useOrganization()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (bugId: string) => {
      const response = await bugs.delete(bugId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs', currentOrg?.id] })
      toast({
        title: 'Success',
        description: 'Bug deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete bug',
        variant: 'destructive',
      })
    },
  })
}

// Comment Queries
export function useComments(bugId: string | null) {
  return useQuery({
    queryKey: ['comments', bugId],
    queryFn: async () => {
      if (!bugId) throw new Error('No bug ID provided')
      const response = await comments.getAll(bugId)
      return response.data
    },
    enabled: !!bugId,
  })
}

// Comment Mutations
export function useCreateComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ bugId, data }: { bugId: string; data: any }) => {
      const response = await comments.create(bugId, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.bugId] })
      queryClient.invalidateQueries({ queryKey: ['bug', variables.bugId] })
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ bugId, commentId }: { bugId: string; commentId: string }) => {
      const response = await comments.delete(bugId, commentId)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.bugId] })
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete comment',
        variant: 'destructive',
      })
    },
  })
}
