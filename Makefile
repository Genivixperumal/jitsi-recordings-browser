
DEFAULT_TARGET : dev
.PHONY : start build stop dev

# Production below

start :
	(cd web && make start)
	(cd backend && make start)

build :
	(cd web && make build)
	(cd backend && make build)

stop :
	(cd web && make stop)
	(cd backend && make stop)

# Development below

dev :
	(cd web && make dev)
	(cd backend && make dev)

