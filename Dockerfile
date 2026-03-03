# 1️⃣ Use official Node image
FROM node:18-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first (for better caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install 

# 5️⃣ Copy remaining source code
COPY . .

# 6️⃣ Expose your app port
EXPOSE 8010

# 7️⃣ Start the application
CMD ["npm", "start"]
