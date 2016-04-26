# Dockerfile

## Run

```sh
docker run \
	-it \
	-d \
	-v /path/to/your/app:/data \
	--name codecamp \
	f3l1x/codecamp:ionic1
```

## Attach

```sh
docker exec -i -t codecamp /bin/bash
```

## Share application

```sh
sh /usr/bin/codecamp-share
# or just
codecamp-share
```
