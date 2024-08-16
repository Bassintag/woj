#!/bin/bash

prisma migrate deploy &&

node api/main.js &
nginx -g "daemon off;" &

wait

exit $?
