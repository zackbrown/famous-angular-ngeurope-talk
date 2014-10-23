#!/bin/bash

# deploy the docs site to s3
# requires credentials and aws-cli configuration

aws s3 --profile=ts cp --recursive --acl=public-read ./ s3://ts-public/famous/angular/ngeurope/
