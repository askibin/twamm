SHELL:=bash

app-dev:
	cd app && yarn dev

deploy-app:
	cd app && npx vercel
