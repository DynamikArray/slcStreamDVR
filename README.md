# SLC Stream DVR

## Development Notes:

#### Run Development Stack using docker-compose.dev.yml

`docker-compose -f docker-compose -f docker-compose.dev.yml up`

#### Run Production Stack using docker-compose.prod.yml

`docker-compose up -d`

# Api - Express api for handling request

# Recordings - Saved recordings location when using `docker-compose.dev.yml`

# Worker - Node / BullMQ worker instance for processing jobs and recording streams
