import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, DashboardFilters } from '@/lib/api-client';
import { useState, useCallback } from 'react';

/**
 * Custom hook for dashboard data fetching and management
 */

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDashboardCompanies = (initialFilters?: DashboardFilters) => {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters || {
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const query = useQuery({
    queryKey: ['dashboard', 'companies', filters],
    queryFn: () => dashboardApi.getCompanies(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  return {
    ...query,
    filters,
    updateFilters,
    resetFilters,
  };
};

export const useCompanyDetails = (companyId: string) => {
  return useQuery({
    queryKey: ['dashboard', 'company', companyId],
    queryFn: () => dashboardApi.getCompanyById(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDashboardPartnerships = () => {
  return useQuery({
    queryKey: ['dashboard', 'partnerships'],
    queryFn: dashboardApi.getPartnerships,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useDashboardMessages = () => {
  return useQuery({
    queryKey: ['dashboard', 'messages'],
    queryFn: dashboardApi.getMessages,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useDashboardNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: dashboardApi.getNotifications,
    staleTime: 1000 * 60, // 1 minute
  });

  const markAsReadMutation = useMutation({
    mutationFn: dashboardApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  return {
    ...query,
    markAsRead: markAsReadMutation.mutate,
  };
};

export const useDashboardProfile = () => {
  return useQuery({
    queryKey: ['dashboard', 'profile'],
    queryFn: dashboardApi.getDashboardProfile,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Combined hook for all dashboard data
export const useDashboard = (filters?: DashboardFilters) => {
  const stats = useDashboardStats();
  const companies = useDashboardCompanies(filters);
  const partnerships = useDashboardPartnerships();
  const messages = useDashboardMessages();
  const notifications = useDashboardNotifications();
  const profile = useDashboardProfile();

  const isLoading = 
    stats.isLoading || 
    companies.isLoading || 
    partnerships.isLoading || 
    messages.isLoading || 
    notifications.isLoading ||
    profile.isLoading;

  const isError = 
    stats.isError || 
    companies.isError || 
    partnerships.isError || 
    messages.isError || 
    notifications.isError ||
    profile.isError;

  return {
    stats: stats.data,
    companies: companies.data,
    partnerships: partnerships.data,
    messages: messages.data,
    notifications: notifications.data,
    profile: profile.data,
    isLoading,
    isError,
    filters: companies.filters,
    updateFilters: companies.updateFilters,
    resetFilters: companies.resetFilters,
    markNotificationAsRead: notifications.markAsRead,
    refetch: {
      stats: stats.refetch,
      companies: companies.refetch,
      partnerships: partnerships.refetch,
      messages: messages.refetch,
      notifications: notifications.refetch,
      profile: profile.refetch,
    },
  };
};