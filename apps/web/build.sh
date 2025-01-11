touch ./src/api/BACKEND_URI.ts
echo "export const BACKEND_URI = 'https://legoaibot-prd-apim.azure-api.net/legoaibot-api/';" > ./src/api/BACKEND_URI.ts
NODE_OPTIONS='--max_old_space_size=16384'

# tsc --noEmit && vite build
npx vite build 