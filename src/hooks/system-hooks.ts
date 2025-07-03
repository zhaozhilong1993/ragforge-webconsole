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
      const { data = {} } = await userService.getSystemConfig();
      return data.data || { registerEnabled: 1 }; // Default to enabling registration
    },
  });

  return { config: data, loading: isLoading };
};

/**
 * Hook to fetch interface configuration
 * @returns Interface configuration with loading status
 */
export const useInterfaceConfig = () => {
  // 暂时禁用接口调用，直接返回默认值，避免404错误
  const defaultConfig = {
    logo: '',
    favicon: '',
    login_logo: '',
    login_welcome_text: '欢迎使用 RAGForge\n智能知识管理与AI助手平台',
  };

  return { 
    config: defaultConfig, 
    loading: false, 
    refetch: () => Promise.resolve() 
  };
};

/**
 * Hook to save interface configuration
 * @returns Save interface configuration mutation
 */
export const useSaveInterfaceConfig = () => {
  // 暂时禁用保存功能，避免404错误
  const mutateAsync = async (config: {
    logo?: string;
    favicon?: string;
    login_logo?: string;
    login_welcome_text?: string;
  }) => {
    message.warning('界面配置功能暂时不可用，后端接口未实现');
    return { code: 0, message: '功能暂时不可用' };
  };

  return { saveInterfaceConfig: mutateAsync, loading: false };
};

/**
 * Hook to upload interface file
 * @returns Upload interface file mutation
 */
export const useUploadInterfaceFile = () => {
  // 暂时禁用文件上传功能，避免404错误
  const mutateAsync = async (params: { file: File; type: string }) => {
    message.warning('文件上传功能暂时不可用，后端接口未实现');
    return { code: 0, message: '功能暂时不可用' };
  };

  return { uploadInterfaceFile: mutateAsync, loading: false };
};
