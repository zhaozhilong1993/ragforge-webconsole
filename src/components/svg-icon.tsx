import { IconMap } from '@/constants/llm';
import { cn } from '@/lib/utils';
import Icon, { UserOutlined } from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Avatar } from 'antd';
import { AvatarSize } from 'antd/es/avatar/AvatarContext';

const importAll = (requireContext: __WebpackModuleApi.RequireContext) => {
  const list = requireContext.keys().map((key) => {
    const name = key.replace(/\.\/(.*)\.\w+$/, '$1');
    return { name, value: requireContext(key) };
  });
  return list;
};

let routeList: { name: string; value: string }[] = [];

try {
  routeList = importAll(require.context('@/assets/svg', true, /\.svg$/));
  console.log('SvgIcon: Loaded SVG files:', routeList.map(item => item.name));
} catch (error) {
  console.warn('SvgIcon: Error loading SVG files:', error);
  routeList = [];
}

interface IProps extends IconComponentProps {
  name: string;
  width: string | number;
  height?: string | number;
  imgClass?: string;
}

const SvgIcon = ({ name, width, height, imgClass, ...restProps }: IProps) => {
  const ListItem = routeList.find((item) => item.name === name);
  
  if (!ListItem) {
    console.warn(`SvgIcon: Icon "${name}" not found. Available icons:`, routeList.map(item => item.name));
  }
  
  return (
    <Icon
      component={() => (
        <img
          src={ListItem?.value}
          alt=""
          width={width}
          height={height}
          className={cn(imgClass, 'max-w-full')}
        />
      )}
      {...(restProps as any)}
    />
  );
};

export const LlmIcon = ({
  name,
  height = 48,
  width = 48,
  size = 'large',
  imgClass,
}: {
  name: string;
  height?: number;
  width?: number;
  size?: AvatarSize;
  imgClass?: string;
}) => {
  const icon = IconMap[name as keyof typeof IconMap];

  return icon ? (
    <SvgIcon
      name={`llm/${icon}`}
      width={width}
      height={height}
      imgClass={imgClass}
    ></SvgIcon>
  ) : (
    <Avatar shape="square" size={size} icon={<UserOutlined />} />
  );
};

export default SvgIcon;
