include variables.mk

.PHONY: generate-docker-compose add-new-site

install:
	make add-new-site
	make generate-ssl-certs
	make up

generate-config:
	@docker compose $(COMPOSE_FILE) config > docker-compose.yml

add-new-site:
	@read -p "Enter new site name: " site_name; \
	./scripts/add_new_site.sh $$site_name

generate-ssl-certs:
	@./scripts/generate_ssl_certs.sh

up: generate-config
	@docker compose up --build

down:
	@docker compose down