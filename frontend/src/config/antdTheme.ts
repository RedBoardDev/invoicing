const antdTheme = {
  token: {
    colorPrimary: "#5a91c0",          // Primary color (blue)
    colorPrimaryHover: "#7ba5d0",     // Primary color on hover
    colorText: "#4a4a4a",             // Main text (dark gray)
    colorBgContainer: "#faf8f4",      // Container background (off-white)
    colorSecondary: "#fff9e6",        // Secondary accent (very pale yellow)
    colorBorder: "#e0e0e0",           // Border color
    borderRadius: 4,                  // Border radius
    fontFamily: "Helvetica Neue, Arial, sans-serif",
  },
  components: {
    Button: {
      colorPrimary: "#5a91c0",
      colorPrimaryHover: "#7ba5d0",
      borderRadius: 4,
    },
    Input: {
      colorBgContainer: "#faf8f4",
      colorBorder: "#e0e0e0",
      colorTextPlaceholder: "#a8a8a8", // Placeholder in medium gray
    },
    Menu: {
      // Selected background in very light blue (10% opacity)
      itemSelectedBg: "rgba(90, 145, 192, 0.1)",
      itemColor: "#4a4a4a",
      itemSelectedColor: "#5a91c0",
    },
  },
};

export default antdTheme;
