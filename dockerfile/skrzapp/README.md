# Dockerfile

## Run

```sh
docker run \
	-it \
	-d \
	-v /path/to/your/app:/data \
	--name skrzapp \
	f3l1x/codecamp:skrzapp
```

## Attach

```sh
docker exec -i -t skrzapp /bin/bash
```
