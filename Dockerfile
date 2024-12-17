FROM ubuntu:latest

# Set environment variables to avoid prompts and for better apt performance
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages: curl, gnupg, git, nodejs, npm
RUN apt update && apt install -y \
    git \
    nodejs \
    npm \
    curl \
    gnupg

# Set /app as the Working Directory on Docker filesystem
WORKDIR /app
COPY package.json  ./


COPY . .

# Install dependencies
RUN npm install && npm install next


# Make installdb.sh executable and run it
RUN chmod +x installdb.sh && ./installdb.sh

# Expose the ports for Next.js app and MongoDB
EXPOSE 3000 

# Start the Next.js app in development mode
CMD ["npm", "run", "dev"]
