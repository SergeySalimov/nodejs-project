#!/bin/bash

find /home/user/nodejs-project/db/backups/* -mtime +10 -exec rm -rf {} \;
