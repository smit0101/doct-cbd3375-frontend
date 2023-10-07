# Use an official Node.js runtime as the base image
FROM node:20.8.0

RUN apt install git -y

RUN git clone https://github.com/Rob--W/cors-anywhere.git

RUN cd cors-anywhere && npm install
 
RUN cd cors-anywhere && node server.js

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source code to the container
COPY . .

# Build your React app
RUN nohup npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start your React app when the container starts
CMD ["npm", "start"]

