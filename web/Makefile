IMAGE:=sgumirov/jitsi-recordings-browser-web
CNT:=jitsi-recordings-browser-web
PORT:=3000

DEFAULT_GOAL: dev
.PHONY:	start stop logs status dev build

# Development below

dev :
	npm start

# Production below

build :
	docker build . -t ${IMAGE}

start :
	@docker run -p ${PORT}:80 -d --name ${CNT} ${IMAGE} || echo "Error, for details see above. The possible reason is container image wasn't build. Build first with 'make build'"

stop :
	@docker stop ${CNT} || echo "no container to stop"
	@docker container rm ${CNT} || echo "no container to remove"

logs :
	@docker logs ${CNT}

status :
	@docker ps | grep $(CNT) && echo "Jitsi recordings browser backend is running"

