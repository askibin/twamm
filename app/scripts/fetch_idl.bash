#!/bin/bash -ex
ENVFILE=.env.local
if [[ -f "$ENVFILE" ]]; then
  source "$ENVFILE"
  cat .env.local
fi


#npx @project-serum/anchor-cli --provider.cluster https://api.mainnet-beta.solana.com idl fetch ${NEXT_PUBLIC_PROGRAM_ADDRESS} > ./idl.json
#

if [[ "$(uname -s)" == "1Linux" ]]; then
apt-get update && apt-get upgrade && apt-get install -y pkg-config build-essential libudev-dev libssl-dev
fi

if [[ -x "which -s anchor" ]]; then
  echo "Skip installation. Anchor was already installed"
else
  curl https://sh.rustup.rs -sSf | sh
  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

  avm install latest
  avm use latest

  anchor --version
fi
