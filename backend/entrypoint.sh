#!/bin/bash
api_comment='basePath: "/"'
api_path='basePath: '${API_SWAGGER_PATH}

echo ${api_path}
echo ${api_comment}

sed -i "s|${api_comment}|${api_path}|g" /usr/src/app/documentation/swaggerDefiniton.js

npm start