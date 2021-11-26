#!/bin/bash

mongodump --db postman --gzip --archive  > /home/user/nodejs-project/db/backups/`date +"%y-%m-%d"`.gz
