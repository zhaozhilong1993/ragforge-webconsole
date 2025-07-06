import userService from '@/services/user-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

/**
 * Hook to fetch system configuration including register enable status
 * @returns System configuration with loading status
 */
export const useSystemConfig = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: async () => {
      try {
        // 直接使用 fetch 而不是 userService，避免触发错误通知
        const response = await fetch('/v1/system/config', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const { data = {} } = await response.json();
          return data.data || { registerEnabled: 1 }; // Default to enabling registration
        } else {
          // 如果请求失败，返回默认配置
          return { registerEnabled: 1 }; // Default to enabling registration
        }
      } catch (error) {
        // 如果API调用失败（比如未登录），返回默认配置
        return { registerEnabled: 1 }; // Default to enabling registration
      }
    },
    retry: false, // 不重试，避免重复的错误请求
    refetchOnWindowFocus: false, // 不在窗口聚焦时重新获取
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
  });

  return { config: data, loading: isLoading };
};

/**
 * Hook to fetch interface configuration
 * @returns Interface configuration with loading status
 */
export const useInterfaceConfig = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['interfaceConfig'],
    queryFn: async () => {
      try {
        // 直接使用 request 而不是 userService，以便传递特殊标记
        const response = await fetch('/v1/system/interface/config', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const { data = {} } = await response.json();
          return (
            data.data || {
              logo: '',
              favicon: '',
              login_logo: '',
              login_welcome_text: '欢迎使用 RAGForge\n智能知识管理与AI助手平台',
            }
          );
        } else {
          // 如果请求失败，返回默认配置
          return {
            logo: '',
            favicon: '',
            login_logo: '',
            login_welcome_text: '欢迎使用 RAGForge\n智能知识管理与AI助手平台',
          };
        }
      } catch (error) {
        // 如果API调用失败（比如未登录），返回默认配置
        return {
          logo: '',
          favicon: '',
          login_logo: '',
          login_welcome_text: '欢迎使用 RAGForge\n智能知识管理与AI助手平台',
        };
      }
    },
    retry: false, // 不重试，避免重复的错误请求
    refetchOnWindowFocus: false, // 不在窗口聚焦时重新获取
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
  });

  return { config: data, loading: isLoading, refetch };
};

/**
 * Hook to save interface configuration
 * @returns Save interface configuration mutation
 */
export const useSaveInterfaceConfig = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['saveInterfaceConfig'],
    mutationFn: async (config: {
      logo?: string;
      favicon?: string;
      login_logo?: string;
      login_welcome_text?: string;
    }) => {
      const { data = {} } = await userService.saveInterfaceConfig(config);
      return data;
    },
    onSuccess: (data) => {
      if (data.code === 0) {
        message.success('界面配置保存成功');
        // 刷新界面配置缓存
        queryClient.invalidateQueries({ queryKey: ['interfaceConfig'] });
      } else {
        message.error(data.message || '保存失败');
      }
    },
    onError: (error) => {
      message.error('保存失败');
      console.error('Save interface config error:', error);
    },
  });

  return { saveInterfaceConfig: mutateAsync, loading: isPending };
};

/**
 * Hook to upload interface file
 * @returns Upload interface file mutation
 */
export const useUploadInterfaceFile = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['uploadInterfaceFile'],
    mutationFn: async (params: { file: File; type: string }) => {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('type', params.type);

      const { data = {} } = await userService.uploadInterfaceFile(formData);
      return data;
    },
    onSuccess: (data) => {
      if (data.code === 0) {
        message.success('文件上传成功');
        // 刷新界面配置缓存，让页面上的logo立即更新
        queryClient.invalidateQueries({ queryKey: ['interfaceConfig'] });
      } else {
        message.error(data.message || '上传失败');
      }
    },
    onError: (error) => {
      message.error('上传失败');
      console.error('Upload interface file error:', error);
    },
  });

  return { uploadInterfaceFile: mutateAsync, loading: isPending };
};
