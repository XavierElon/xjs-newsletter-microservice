#!/bin/bash
docker build -t xsj-newsletter-microservice .
docker tag xsj-newsletter-microservice:latest public.ecr.aws/i7c1y0j6/xsj-newsletter-microservice:latest
docker push public.ecr.aws/i7c1y0j6/xsj-newsletter-microservice:latest