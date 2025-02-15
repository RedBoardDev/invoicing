import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import type React from "react";
import styles from "./Login.module.css";

const { Title } = Typography;

const Login: React.FC = () => {
	const onFinish = (values: { email: string; password: string }) => {
		console.log("Received values:", values);
		// Ici, vous pouvez ajouter la logique de connexion (appel API, etc.)
	};

	return (
		<Flex justify="center" align="center" className={styles.container}>
			<Card className={styles.loginCard}>
				<Title level={2} className={styles.title}>
					Connexion
				</Title>
				<Form
					name="login"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: "Veuillez saisir votre email" },
							{ type: "email", message: "Email invalide" },
						]}
					>
						<Input
							prefix={<MailOutlined className={styles.icon} />}
							placeholder="Email"
							size="large"
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{ required: true, message: "Veuillez saisir votre mot de passe" },
						]}
					>
						<Input.Password
							prefix={<LockOutlined className={styles.icon} />}
							placeholder="Mot de passe"
							size="large"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							size="large"
							className={styles.loginButton}
						>
							Se connecter
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Flex>
	);
};

export default Login;
