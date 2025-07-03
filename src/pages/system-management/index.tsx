import { LlmIcon } from '@/components/svg-icon';
import { useTheme } from '@/components/theme-provider';
import { useSetModalState, useTranslate } from '@/hooks/common-hooks';
import { useSelectLlmList } from '@/hooks/llm-hooks';
import {
  useInterfaceConfig,
  useSaveInterfaceConfig,
  useUploadInterfaceFile,
} from '@/hooks/system-hooks';
import {
  PictureOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  List,
  Menu,
  Radio,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import SettingTitle from '../user-setting/components/setting-title';

const { Content, Sider } = Layout;
const { Text } = Typography;

const ModelCard = ({ item, clickApiKey }: any) => {
  const { visible, switchVisible } = useSetModalState();
  const { t } = useTranslate('setting');
  const { theme } = useTheme();

  const handleApiKeyClick = () => {
    clickApiKey(item.name);
  };

  const handleShowMoreClick = () => {
    switchVisible();
  };

  return (
    <List.Item>
      <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
        <Row align={'middle'}>
          <Col span={12}>
            <Flex gap={'middle'} align="center">
              <LlmIcon name={item.name} />
              <Flex vertical gap={'small'}>
                <b>{item.name}</b>
                <Text>{item.tags}</Text>
              </Flex>
            </Flex>
          </Col>
          <Col span={12} className={'text-right'}>
            <Space size={'middle'}>
              <Button onClick={handleApiKeyClick}>
                <Flex align="center" gap={4}>
                  API-Key
                  <SettingOutlined />
                </Flex>
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </List.Item>
  );
};

const ModelSettings = () => {
  const { myLlmList: llmList, loading } = useSelectLlmList();

  const clickApiKey = (llmFactory: string) => {
    // This will be implemented later
    console.log(llmFactory);
  };

  return (
    <Spin spinning={loading}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={llmList}
        renderItem={(item) => (
          <ModelCard item={item} clickApiKey={clickApiKey}></ModelCard>
        )}
      />
    </Spin>
  );
};

const OcrSettings = () => {
  const [ocrModel, setOcrModel] = useState('deepdoc');

  const handleOcrModelChange = (value: string) => {
    setOcrModel(value);
  };

  const handleSwitchModel = () => {
    console.log('Switching to MinerU model');
    // Here you would typically make an API call to switch the OCR model
  };

  return (
    <Card title="OCR管理">
      <Form layout="vertical">
        <Form.Item label="OCR模型类型">
          <Radio.Group
            value={ocrModel}
            onChange={(e) => handleOcrModelChange(e.target.value)}
          >
            <Radio value="deepdoc">DeepDoc</Radio>
            <Radio value="mineru">MinerU</Radio>
          </Radio.Group>
        </Form.Item>

        {ocrModel === 'deepdoc' && (
          <Card
            title="DeepDoc 模型信息"
            size="small"
            style={{ marginTop: 16 }}
            className="bg-gray-50"
            extra={<Tag color="green">当前使用</Tag>}
          >
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>模型地址：</Text>
                  <Text>http://localhost:8000/deepdoc</Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>模型版本：</Text>
                  <Text>v1.0.0</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>状态：</Text>
                  <Tag color="green">运行中</Tag>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Text strong>支持语言：</Text>
                  <Text>中文、英文</Text>
                </div>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text strong>模型描述：</Text>
              <Text>
                DeepDoc是一个高性能的OCR模型，支持多种文档格式的文本识别
              </Text>
            </div>
          </Card>
        )}

        {ocrModel === 'mineru' && (
          <Card title="MinerU 模型配置" size="small" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text>MinerU是一个轻量级的OCR模型，适合快速文本识别任务。</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>模型地址：</Text>
              <Text>http://localhost:8001/mineru</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>模型版本：</Text>
              <Text>v2.1.0</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>支持语言：</Text>
              <Text>中文、英文、数字</Text>
            </div>
            <Form.Item>
              <Button type="primary" onClick={handleSwitchModel}>
                切换模型
              </Button>
            </Form.Item>
          </Card>
        )}
      </Form>
    </Card>
  );
};

const InterfaceSettings = () => {
  const { config: interfaceConfig } = useInterfaceConfig();
  const { saveInterfaceConfig, loading: saveLoading } =
    useSaveInterfaceConfig();
  const { uploadInterfaceFile, loading: uploadLoading } =
    useUploadInterfaceFile();

  const [logoFileList, setLogoFileList] = useState([]);
  const [faviconFileList, setFaviconFileList] = useState([]);
  const [loginLogoFileList, setLoginLogoFileList] = useState([]);
  const [welcomeText, setWelcomeText] = useState('');
  const [appName, setAppName] = useState('');
  const [loginTitle, setLoginTitle] = useState('');

  useEffect(() => {
    if (interfaceConfig) {
      setLogoFileList(
        interfaceConfig.logo
          ? [
              {
                uid: '-1',
                name: 'logo.png',
                status: 'done',
                url: interfaceConfig.logo,
              },
            ]
          : [],
      );
      setFaviconFileList(
        interfaceConfig.favicon
          ? [
              {
                uid: '-1',
                name: 'favicon.ico',
                status: 'done',
                url: interfaceConfig.favicon,
              },
            ]
          : [],
      );
      setLoginLogoFileList(
        interfaceConfig.login_logo
          ? [
              {
                uid: '-1',
                name: 'login-logo.png',
                status: 'done',
                url: interfaceConfig.login_logo,
              },
            ]
          : [],
      );
      setWelcomeText(
        interfaceConfig.login_welcome_text ||
          '欢迎使用 RAGForge\n智能知识管理与AI助手平台',
      );
      setAppName(interfaceConfig.app_name || 'RAGForge');
      setLoginTitle(interfaceConfig.login_title || '欢迎使用 RAGForge');
    }
  }, [interfaceConfig]);

  const handleUploadChange =
    (setter, type) =>
    ({ fileList }) => {
      setter(fileList);

      // 如果有新文件上传，自动上传到服务器
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;
        uploadInterfaceFile({ file, type }).then((result) => {
          if (result.code === 0) {
            // 更新文件列表为服务器返回的数据
            setter([
              {
                uid: '-1',
                name: file.name,
                status: 'done',
                url: result.data.url,
              },
            ]);
          }
        });
      }
    };

  const handleSave = async () => {
    try {
      const configData = {
        logo: logoFileList.length > 0 ? logoFileList[0].url : '',
        favicon: faviconFileList.length > 0 ? faviconFileList[0].url : '',
        login_logo:
          loginLogoFileList.length > 0 ? loginLogoFileList[0].url : '',
        login_welcome_text: welcomeText,
        app_name: appName,
        login_title: loginTitle,
      };

      await saveInterfaceConfig(configData);

      // 保存成功后，刷新页面以应用新配置
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  if (saveLoading || uploadLoading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <Card
        bordered={false}
        style={{ marginBottom: 24, background: '#fafafa' }}
      >
        <Typography.Title
          level={5}
          style={{ color: '#096dd9', marginBottom: '24px' }}
        >
          站点标识
        </Typography.Title>
        <Row align="middle" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>LOGO</Typography.Text>
          </Col>
          <Col span={18}>
            <Upload
              listType="picture-card"
              fileList={logoFileList}
              onChange={handleUploadChange(setLogoFileList, 'logo')}
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              {logoFileList.length === 0 && uploadButton}
            </Upload>
            <Typography.Text type="secondary">
              建议尺寸 200 * 50
            </Typography.Text>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>浏览器Tab小图标</Typography.Text>
          </Col>
          <Col span={18}>
            <Upload
              listType="picture-card"
              fileList={faviconFileList}
              onChange={handleUploadChange(setFaviconFileList, 'favicon')}
              maxCount={1}
              beforeUpload={() => false}
              accept=".ico,image/*"
            >
              {faviconFileList.length === 0 && uploadButton}
            </Upload>
            <Typography.Text type="secondary">
              建议尺寸 32 * 32, .ico格式
            </Typography.Text>
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>应用名称</Typography.Text>
          </Col>
          <Col span={18}>
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              style={{ maxWidth: 400 }}
              placeholder="RAGForge"
            />
            <Typography.Text type="secondary">
              显示在页面头部和浏览器标题中的应用名称
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} style={{ background: '#fafafa' }}>
        <Typography.Title
          level={5}
          style={{ color: '#096dd9', marginBottom: '24px' }}
        >
          登录页面
        </Typography.Title>
        <Row align="middle" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>登录界面LOGO</Typography.Text>
          </Col>
          <Col span={18}>
            <Upload
              listType="picture-card"
              fileList={loginLogoFileList}
              onChange={handleUploadChange(setLoginLogoFileList, 'login_logo')}
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              {loginLogoFileList.length === 0 && uploadButton}
            </Upload>
            <Typography.Text type="secondary">
              建议尺寸 200 * 200
            </Typography.Text>
          </Col>
        </Row>
        <Row align="top" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>登录页欢迎词</Typography.Text>
          </Col>
          <Col span={18}>
            <Input.TextArea
              rows={4}
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              style={{ maxWidth: 400 }}
              placeholder="欢迎使用 RAGForge\n智能知识管理与AI助手平台"
            />
          </Col>
        </Row>
        <Row align="middle" style={{ padding: '12px 0' }}>
          <Col span={6}>
            <Typography.Text strong>登录页主标题</Typography.Text>
          </Col>
          <Col span={18}>
            <Input
              value={loginTitle}
              onChange={(e) => setLoginTitle(e.target.value)}
              style={{ maxWidth: 400 }}
              placeholder="欢迎使用 RAGForge"
            />
            <Typography.Text type="secondary">
              登录页面显示的主要标题
            </Typography.Text>
          </Col>
        </Row>
      </Card>

      <Flex justify="flex-start" style={{ marginTop: 32 }}>
        <Button
          type="primary"
          size="large"
          onClick={handleSave}
          loading={saveLoading || uploadLoading}
        >
          保存更改
        </Button>
      </Flex>
    </div>
  );
};

const LicenseSettings = () => {
  return (
    <Card title="授权管理">
      <Form layout="vertical">
        <Form.Item label="系统版本">
          <Space>
            <Tag color="blue">社区版</Tag>
            <Tag color="green">企业版</Tag>
          </Space>
        </Form.Item>
        <Form.Item label="License 信息">
          <Typography.Text code>LIC-XXXX-XXXX-XXXX-XXXX</Typography.Text>
        </Form.Item>
        <Form.Item label="上传授权文件">
          <Upload>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Card>
  );
};

const SystemManagementPage = () => {
  const [selectedKey, setSelectedKey] = useState('license');

  const renderContent = () => {
    switch (selectedKey) {
      case 'license':
        return <LicenseSettings />;
      default:
        return <LicenseSettings />;
    }
  };

  return (
    <Layout style={{ width: '100%', background: '#f0f2f5' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="license" icon={<SafetyCertificateOutlined />}>
            授权管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '24px', minHeight: 280 }}>
        <SettingTitle title={'系统管理'}></SettingTitle>
        <Divider />
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default SystemManagementPage;
