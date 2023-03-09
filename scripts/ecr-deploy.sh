#!/bin/bash
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/i7c1y0j6
docker build -t xsj-newsletter-microservice .
docker tag xsj-newsletter-microservice:latest public.ecr.aws/i7c1y0j6/xsj-newsletter-microservice:latest
docker push public.ecr.aws/i7c1y0j6/xsj-newsletter-microservice:latest