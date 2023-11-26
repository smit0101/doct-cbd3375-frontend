# Use an official Node.js runtime as the base image
FROM node:20.8.0

# Set the working directory inside the container
WORKDIR /app

ENV BACKEND_URL="http://127.0.0.1:8080/cyberbullyingpredict"

ENV BACKEND_URL=${BACKEND_URL}


# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source code to the container
COPY . .

# Build your React app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start your React app when the container starts
CMD ["npm", "start"]

