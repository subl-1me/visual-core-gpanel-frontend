const fs = require("fs");
const path = require("path");

const env = process.env; // Variables de Netlify

const environmentContent = `export const environment = {
  production: true,
  apiUrl: '${env.API_URL || "https://api.default.com"}',
};`;

const envFile = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.ts"
);

fs.writeFileSync(envFile, environmentContent);
