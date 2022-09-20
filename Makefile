SHELL:=bash

app-dev:
	cd app && yarn dev

deploy-app:
	cd app && npx vercel

import-program:
	cp target/idl/twamm.json app/src/idl.json
