import { ConfigProvider, ThemeConfig } from "antd";
import React from "react";

type Props = {
  children: React.PropsWithChildren<React.ReactNode>;
};
const AntConfigProvider = ({ children }: Props) => {
  const configTheme: ThemeConfig = {
    token: {
      colorPrimary: "#A91D3A",
      colorLink: "red",
      
    },
    components: {
      Layout: {
        bodyBg: "#DDDDDD",
      },
    },
  };
  return (
    <ConfigProvider theme={configTheme} direction="ltr">
      {children}
    </ConfigProvider>
  );
};

export default AntConfigProvider;
