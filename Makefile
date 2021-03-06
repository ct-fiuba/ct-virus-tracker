TEST_CONTAINER_NAME=my-test-mongo

.PHONY: install
install:
	npm install;

.PHONY: run
run:
	bash ./run.sh

.PHONY: test
test:
	docker run --rm -d -p 27017:27017 --name="$(TEST_CONTAINER_NAME)" mongo:3.6.4;
	( npm run test:integration && docker stop $(TEST_CONTAINER_NAME)) || docker stop $(TEST_CONTAINER_NAME);

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
