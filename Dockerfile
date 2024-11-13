# Stage 1: Build

FROM node:21-alpine AS build

# Set /app as the Working Directory on Docker filesystem
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build


# Stage 2: Run

FROM node:21-alpine AS run

# Set /app as the Working Directory on Docker filesystem
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Install only production dependencies
RUN npm install --only=production

# Expose the port that your Next.js app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

