import type React from "react";
import { Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loader: React.FC = () => (
  <Flex style={{ height: "100vh" }} align="center" justify="center">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 96 }} spin />} />
  </Flex>
);

export default Loader;
