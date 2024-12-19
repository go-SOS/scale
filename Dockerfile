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
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install && npm install next && npm install papaparse


RUN chmod +x dbinstall.sh && ./dbinstall.sh
RUN chmod +x  dbinit.sh
RUN npm run build
# Expose the ports for Next.js app and MongoDB
EXPOSE 3000 
EXPOSE 27017
ENTRYPOINT ["/bin/bash", "/app/dbinit.sh"]
CMD ["npm", "start" ]
