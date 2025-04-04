const antdTheme = {
	token: {
		colorPrimary: "#2640aeff", // Persian Blue
		colorPrimaryHover: "#1a2f8cff", // Persian Blue plus sombre
		colorText: "#4a4a4a", // Gris foncé
		colorBgContainer: "#ffffff", // Blanc
		colorBorder: "#e0e0e0", // Gris clair
		borderRadius: 8, // Rayon des bordures
		fontFamily: "'Inter', sans-serif", // Police moderne
	},
	components: {
		Button: {
			colorPrimary: "#2640aeff",
			colorPrimaryHover: "#1a2f8cff",
			borderRadius: 8,
		},
		Input: {
			colorBgContainer: "#ffffff",
			colorBorder: "#e0e0e0",
			colorTextPlaceholder: "#6c757d", // Gris moyen
		},
		Menu: {
			itemSelectedBg: "rgba(38, 64, 174, 0.1)", // Persian Blue avec 10% d'opacité
			itemSelectedColor: "#2640aeff", // Persian Blue
			itemColor: "#4a4a4a", // Gris foncé
		},
	},
};

export default antdTheme;
