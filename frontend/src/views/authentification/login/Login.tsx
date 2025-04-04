import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, Typography } from 'antd';
import type React from 'react';
import styles from './Login.module.css';

const { Title } = Typography;

const Login: React.FC = () => {
  const onFinish = (values: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    console.log('Received values:', values);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard}>
        <Title level={2} className={styles.title}>
          Connexion
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className={styles.form}>
          <Form.Item
            label="Adresse email"
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' },
            ]}>
            <Input prefix={<MailOutlined className={styles.icon} />} placeholder="Adresse email" size="large" />
          </Form.Item>
          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}>
            <Input.Password prefix={<LockOutlined className={styles.icon} />} placeholder="Mot de passe" size="large" />
          </Form.Item>
          <div className={styles.formActions}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Se souvenir de moi</Checkbox>
            </Form.Item>
            {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
            <a href="#" className={styles.forgotPassword}>
              Mot de passe oublié ?
            </a>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" className={styles.loginButton}>
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
