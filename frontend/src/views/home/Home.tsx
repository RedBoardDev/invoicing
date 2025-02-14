import type React from "react";
import styles from "./Home.module.css";

const Home: React.FC = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Welcome to Your Frontend Template</h1>
			<p className={styles.subtitle}>
				A scalable and modular starter for building modern React applications.
			</p>
		</div>
	);
};

export default Home;
