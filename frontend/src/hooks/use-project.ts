'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from '@/lib/api-client'
import type { CreateProjectData, UpdateProjectData, Project } from '@/lib/api-client'

export function useProject() {
  const queryClient = useQueryClient()

  // Get current user's project
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ['project'],
    queryFn: projectApi.getMyProject,
    retry: false,
  })

  // Create or update project mutation
  const createOrUpdateProjectMutation = useMutation({
    mutationFn: projectApi.createOrUpdateProject,
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.setQueryData(['project'], data.data.project)
        queryClient.invalidateQueries({ queryKey: ['project'] })
      }
    },
    onError: (error: any) => {
      console.error('Project save error:', error)
    },
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: projectApi.deleteProject,
    onSuccess: () => {
      queryClient.setQueryData(['project'], null)
      queryClient.invalidateQueries({ queryKey: ['project'] })
    },
    onError: (error: any) => {
      console.error('Project delete error:', error)
    },
  })

  // Get project by ID (for viewing other projects)
  const useProjectById = (projectId: string) => {
    return useQuery({
      queryKey: ['project', projectId],
      queryFn: () => projectApi.getProjectById(projectId),
      enabled: !!projectId,
    })
  }

  // Upload project logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: projectApi.uploadLogo,
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['project'] })
      }
    },
    onError: (error: any) => {
      console.error('Logo upload error:', error)
    },
  })

  // Upload project banner mutation
  const uploadBannerMutation = useMutation({
    mutationFn: projectApi.uploadBanner,
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['project'] })
      }
    },
    onError: (error: any) => {
      console.error('Banner upload error:', error)
    },
  })

  // Utility functions
  const createOrUpdateProject = async (data: CreateProjectData | UpdateProjectData) => {
    return await createOrUpdateProjectMutation.mutateAsync(data)
  }

  const deleteProject = () => {
    deleteProjectMutation.mutate()
  }

  const uploadLogo = (file: File) => {
    uploadLogoMutation.mutate(file)
  }

  const uploadBanner = (file: File) => {
    uploadBannerMutation.mutate(file)
  }

  return {
    // State
    project,
    isProjectLoading,
    projectError,
    hasProject: !!project,

    // Loading states
    isSaving: createOrUpdateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    isUploadingLogo: uploadLogoMutation.isPending,
    isUploadingBanner: uploadBannerMutation.isPending,

    // Errors
    saveError: createOrUpdateProjectMutation.error,
    deleteError: deleteProjectMutation.error,
    uploadLogoError: uploadLogoMutation.error,
    uploadBannerError: uploadBannerMutation.error,

    // Actions
    createOrUpdateProject,
    deleteProject,
    uploadLogo,
    uploadBanner,
    useProjectById,

    // Reset functions
    resetSaveError: createOrUpdateProjectMutation.reset,
    resetDeleteError: deleteProjectMutation.reset,
    resetUploadLogoError: uploadLogoMutation.reset,
    resetUploadBannerError: uploadBannerMutation.reset,
  }
}

// Hook to get all projects (for explore page)
export function useProjects(filters?: any) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectApi.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}