TEST_CONTAINER_NAME=my-test-mongo

.PHONY: install
install:
	npm install;

.PHONY: run
<<<<<<< HEAD
run: install
	npm start;
=======
run:
	bash ./run.sh
>>>>>>> 93ae4ffdfe5472c87e7a37c22ba164090921411d

.PHONY: test
test:
	docker run --rm -d -p 27017:27017 --name="$(TEST_CONTAINER_NAME)" mongo:3.6.4;
<<<<<<< HEAD
	(npm run test:integration && docker stop $(TEST_CONTAINER_NAME)) || docker stop $(TEST_CONTAINER_NAME);
=======
	(npm test && npm run test:integration && docker stop $(TEST_CONTAINER_NAME)) || docker stop $(TEST_CONTAINER_NAME);
>>>>>>> 93ae4ffdfe5472c87e7a37c22ba164090921411d

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
