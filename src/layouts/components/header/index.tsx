import { ReactComponent as FileIcon } from '@/assets/svg/file-management.svg';
import { ReactComponent as GraphIcon } from '@/assets/svg/graph.svg';
import { ReactComponent as KnowledgeBaseIcon } from '@/assets/svg/knowledge-base.svg';
import { useTranslate } from '@/hooks/common-hooks';
import { useFetchAppConf } from '@/hooks/logic-hooks';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { useInterfaceConfig } from '@/hooks/system-hooks';
import {
  MessageOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Flex, Layout, Radio, Space } from 'antd';
import { MouseEventHandler, useCallback, useMemo } from 'react';
import { useLocation } from 'umi';
import Toolbar from '../right-toolbar';

import { useTheme } from '@/components/theme-provider';
import styles from './index.less';

const { Header } = Layout;

const RagHeader = () => {
  const navigate = useNavigateWithFromState();
  const { pathname } = useLocation();
  const { t } = useTranslate('header');
  const appConf = useFetchAppConf();
  const { theme: themeRag } = useTheme();
  const { config: interfaceConfig } = useInterfaceConfig();

  const tagsData = useMemo(
    () => [
      { path: '/knowledge', name: t('knowledgeBase'), icon: KnowledgeBaseIcon },
      { path: '/chat', name: t('chat'), icon: MessageOutlined },
      { path: '/search', name: t('search'), icon: SearchOutlined },
      { path: '/flow', name: t('flow'), icon: GraphIcon },
      { path: '/file', name: t('fileManager'), icon: FileIcon },
      { path: '/system-management', name: '系统管理', icon: SettingOutlined },
    ],
    [t],
  );

  const currentPath = useMemo(() => {
    return (
      tagsData.find((x) => pathname.startsWith(x.path))?.name || 'knowledge'
    );
  }, [pathname, tagsData]);

  const handleChange = useCallback(
    (path: string): MouseEventHandler =>
      (e) => {
        e.preventDefault();
        navigate(path);
      },
    [navigate],
  );

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // 动态logo URL
  const logoUrl = useMemo(() => {
    if (interfaceConfig?.logo) {
      return interfaceConfig.logo;
    }
    return '/logo.svg';
  }, [interfaceConfig?.logo]);

  return (
    <Header
      style={{
        padding: '0 16px',
        background: 'linear-gradient(to right, #5e72e4, #fef9fb)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '72px',
      }}
    >
      <Flex align="center" gap={50}>
        <a href={window.location.origin}>
          <Space
            size={12}
            onClick={handleLogoClick}
            className={styles.logoWrapper}
          >
            <img src={logoUrl} alt="" className={styles.appIcon} />
            <span className={styles.appName}>
              {interfaceConfig?.app_name || appConf.appName}
            </span>
          </Space>
        </a>
        <Space size={[0, 8]} wrap>
          <Radio.Group
            defaultValue="a"
            buttonStyle="solid"
            className={
              themeRag === 'dark' ? styles.radioGroupDark : styles.radioGroup
            }
            value={currentPath}
          >
            {tagsData.map((item, index) => (
              <Radio.Button
                className={`${themeRag === 'dark' ? 'dark' : 'light'} ${index === 0 ? 'first' : ''} ${index === tagsData.length - 1 ? 'last' : ''}`}
                value={item.name}
                key={item.name}
              >
                <a href={item.path}>
                  <Flex
                    align="center"
                    gap={8}
                    onClick={handleChange(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon
                      className={styles.radioButtonIcon}
                      stroke={item.name === currentPath ? '#4a90e2' : 'white'}
                    ></item.icon>
                    {item.name}
                  </Flex>
                </a>
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
      </Flex>
      <Toolbar></Toolbar>
    </Header>
  );
};

export default RagHeader;
