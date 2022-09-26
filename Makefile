SHELL:=bash

app-dev:
	cd app && yarn dev

deploy-app:
	cd app && npx vercel

import-program:
	anchor idl fetch $$PROGRAM_ADDRESS > ./app/src/idl.json;

import-program-localnet:
	cp target/idl/twamm.json app/src/idl.json
