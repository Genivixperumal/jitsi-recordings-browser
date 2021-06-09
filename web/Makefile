IMAGE:=sgumirov/jitsi-recordings-browser-web
CNT:=jitsi-recordings-browser-web-container
PORT:=3000

DEFAULT_GOAL: dev
.PHONY:	start stop logs status dev build

# Development below

dev :
	npm start

# Production below

build :
	docker build . -t --build-arg PORT=${PORT} --build-arg REACT_APP_API_BASEURL=${REACT_APP_API_BASEURL} --build-arg REACT_APP_LANG=${REACT_APP_LANG} ${IMAGE}

start :
	@docker run -p ${PORT}:80 -d --name ${CNT} ${IMAGE} || echo "Error, for details see above. The possible reason is container image wasn't build. Build first with 'make build'"

stop :
	@docker stop ${CNT}

logs :
	@docker logs ${CNT}

status :
	@docker ps | grep $(CNT) && echo "Jitsi recordings browser backend is running"

