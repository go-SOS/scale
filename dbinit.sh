#!/bin/bash
MONGO_HOST="127.0.0.1" # Change to your MongoDB host if not localhost
MONGO_PORT="27017"     # Change to your MongoDB port if not default
USERNAME="scuser"      # Replace with your desired username
PASSWORD="pass"        # Replace with your desired password
mongod --fork --logpath /var/log/mongod.log --bind_ip 0.0.0.0
# Wait for MongoDB to start
until mongosh --host localhost --port 27017 --eval "print('waiting for connection...')" > /dev/null 2>&1; do
  sleep 2
done



# Create the custom database and user with roles
mongosh --host localhost --port 27017 <<EOF
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

echo "User '$MONGO_USER' created successfully with roles for '$MONGO_DB'."
exec "$@"

