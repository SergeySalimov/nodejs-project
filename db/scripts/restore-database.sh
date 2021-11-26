#!/bin/bash

mongorestore --drop --gzip --archive=/home/user/nodejs-project/db/backups/recovery.gz --db postman
