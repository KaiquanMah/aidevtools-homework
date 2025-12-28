import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#003399", // Finnish Blue
                secondary: "#FFFFFF", // Finnish White
            },
        },
    },
    plugins: [],
};
export default config;
