import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import type React from "react";

const Loader: React.FC = () => (
	<Flex style={{ height: "100vh" }} align="center" justify="center">
		<Spin indicator={<LoadingOutlined style={{ fontSize: 96 }} spin />} />
	</Flex>
);

export default Loader;
