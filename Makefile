build:
	docker-compose build

up:
	docker-compose up -d

restart: stop_notebook_servers
	docker-compose restart

stop: stop_notebook_servers
	docker-compose stop

down: stop_notebook_servers
	docker-compose down

shell:
	docker exec -it server flask shell

logs:
	docker-compose logs --follow $(service)

stop_notebook_servers:
	docker ps --filter name='jupyter\-\w+' -aq | xargs docker stop | xargs docker rm

build_notebook_container:
	docker build -t hsghori/test-jupyter:0.01-test ./jupyter_notebook_container

push_notebook_container:
	docker push hsghori/test-jupyter:0.01-test
