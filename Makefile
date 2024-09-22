include variables.mk

.PHONY: generate-config add-new-site

install:
	make generate-ssl-certs
	make up

up: generate-config
	@docker compose up --build

add-new-site:
	@read -p "Enter new site name: " site_name; \
	./scripts/add_new_site.sh $$site_name
	make generate-ssl-certs
	make up

generate-config:
	@docker compose $(COMPOSE_FILE) config > docker-compose.yml

generate-ssl-certs:
	@./scripts/generate_ssl_certs.sh

down:
	@docker compose down