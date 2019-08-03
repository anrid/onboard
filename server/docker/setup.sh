#!/bin/bash
docker network create onboard
docker volume create --name onboard-es1-volume
docker volume create --name onboard-scylla1-volume
# docker volume create --name es-volume --opt device=:/tmp/docker/es-volume