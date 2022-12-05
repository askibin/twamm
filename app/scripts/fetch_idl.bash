#!/bin/bash -ex
ENVFILE=.env.local
if [[ -f "$ENVFILE" ]]; then
  source "$ENVFILE"
fi

npx @project-serum/anchor-cli --provider.cluster https://api.mainnet-beta.solana.com idl fetch ${NEXT_PUBLIC_PROGRAM_ADDRESS} > ./idl.json
