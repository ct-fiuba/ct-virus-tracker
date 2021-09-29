TEST_CONTAINER_NAME=my-test-mongo

.PHONY: install
install:
	npm install;

.PHONY: run
run:
	bash ./run.sh

.PHONY: test
test:
	docker-compose up -d --force-recreate --remove-orphans -- ct-virus-tracker-db codes-queue;
	( QUEUE_ADDRESS="amqp://guest:guest@localhost:5672/" QUEUE_NAME="infected-codes" npm run test:integration && docker-compose down ) || docker-compose down;

.PHONY: ping
ping:
	curl -vvv "localhost:5007/ping"

.PHONY: help
help:
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Available targets are:'
	@echo ''
	@grep -E '^\.PHONY: *' $(MAKEFILE_LIST) | cut -d' ' -f2- | sort
