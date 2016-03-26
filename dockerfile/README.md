# Dockerfile

## Run

```sh
docker run \
	-it \
	-d \
	-v /path/to/your/app:/data \
	--name codecamp \
	f3l1x/codecamp
```

## Attach

```sh
docker attach codecamp /bin/bash
```