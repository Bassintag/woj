#!/bin/bash

prisma migrate deploy &&

node packages/api/dist/main.js &
nginx -g "daemon off;" &

wait

exit $?
