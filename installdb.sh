# Define variables
MONGO_HOST="127.0.0.1" # Change to your MongoDB host if not localhost
MONGO_PORT="27017"     # Change to your MongoDB port if not default
USERNAME="scuser"      # Replace with your desired username
PASSWORD="pass"        # Replace with your desired password

apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc |   gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg    --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
apt-get update && apt-get install -y mongodb-org
mkdir -p  /data/db
chmod -R 777 /data/db
mongod --fork --logpath /var/log/mongod.log --bind_ip 0.0.0.0
#!/bin/bash


# Execute the MongoDB command via mongosh
mongosh --host $MONGO_HOST --port $MONGO_PORT <<EOF
use scaledb;
db.createUser({
  user: "$USERNAME",
  pwd: "$PASSWORD",


  
  roles: [

    { role: "dbAdmin", db: "scaledb" },
    { role: "userAdmin", db: "scaledb" },
    { role: "readWrite", db: "scaledb" },
    { role: "root", db: "admin" }
  ]
});
EOF

echo "User '$USERNAME' created successfully with root role."
