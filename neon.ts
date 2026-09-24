import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    'apiproducts': {
      name: "Products API",
      source: "./functions/api-products.ts",
      dev: { port: 8081 }
    },
  },
});
