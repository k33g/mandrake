#!/usr/bin/env bash
mkdir $1
cd $1
mkdir clevercloud
cd clevercloud

cat > jar.json << EOF
{"deploy": {"jarName": "gitbucket.war"}}
EOF

cat > buckets.json << EOF
[{
  "bucket_host": "$2-fsbucket.services.clever-cloud.com",
  "folder": "/storage"
}]
EOF
