IMAGE:=sgumirov/jitsi-recordings-browser-backend
CNT:=sgumirov/jitsi-recordings-browser-backend-service
PORT:=3001

DEFAULT_GOAL: dev
.PHONY:	start start-local stop logs status dev build

# Development below

dev : 
	NODE_ENV=development node index.js

start-local :
	node index.js

# Production below

build :
	docker build . -t ${IMAGE}

start :
	docker run -p ${PORT}:${PORT} -d --name ${CNT} ${IMAGE} || echo "Error, for details see above. The possible reason is container image wasn't build. Build first with 'make build'"

stop :
	docker stop ${CNT}

logs :
	docker logs ${CNT}

status :
	@docker ps | grep $(CNT) && echo "Jitsi recordings browser backend is running"

