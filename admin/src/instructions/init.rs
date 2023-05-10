#[allow(dead_code)]
use anchor_client::{
    solana_sdk::{
        pubkey::Pubkey,
        signature::{Keypair, Signature},
        signer::Signer,
    },
    Client,
};
use anchor_lang::{prelude::*, solana_program::bpf_loader, system_program};
use anchor_lang::{ToAccountInfos, ToAccountMetas};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use std::str::FromStr;

#[derive(Accounts)]
pub struct InstructionInit<'info> {
    upgrade_authority: Account<'info, TokenAccount>,
    //multisig: Pubkey,
    //transfer_authority: Pubkey,
    //twamm_program: Pubkey,
    //twamm_program_data: Pubkey,
    //system_program: Pubkey,
}

#[derive(PartialEq, Eq, Clone, Debug, AnchorSerialize, AnchorDeserialize)]
struct InitParams {
    min_signatures: u8,
}

struct UAthority {
    upgrade_authority: TokenAccount,
}

pub fn init(
    client: Client<&Keypair>,
    pid: Pubkey,
    payer: &Keypair,
    min_signatures: u8,
    signers: Vec<String>,
) -> Result<()> {
    let program = client.program(pid);

    let args = InitParams { min_signatures };
    let accounts = signers
        .iter()
        .map(|signer| {
            return Pubkey::from_str(signer.as_str()).expect("Bad signer");
            // Break on invalid keys
        })
        .collect::<Vec<Pubkey>>();

    println!("{:?}, {:?}", accounts, args);

    let multisig = Pubkey::find_program_address(&[b"multisig"], &pid);
    let transfer_authority = Pubkey::find_program_address(&[b"transfer_authority"], &pid);

    let program_data =
        Pubkey::find_program_address(vec![pid.to_bytes().as_slice()].as_slice(), &bpf_loader::ID);

    let system_program = system_program::ID;

    //let accos = InstructionInit {
    //upgrade_authority: payer.pubkey(),
    //multisig: multisig.0,
    //transfer_authority: transfer_authority.0,
    //twamm_program: pid,
    //twamm_program_data: program_data.0,
    //system_program: system_program::ID,
    //};

    //let sig = program
    //.request()
    //.accounts(InstructionInit {
    //    upgrade_authority: payer,
    //})
    //.accounts(accos)
    //.accounts(InstructionInit {
    //upgrade_authority: payer.pubkey(),
    //multisig: multisig.0,
    //transfer_authority: transfer_authority.0,
    //twamm_program: pid,
    //twamm_program_data: program_data.0,
    //system_program: system_program::ID,
    //})
    // .args(twamm::instructions::InitParams { min_signatures })
    // .send();
    //.expect("Request failed");

    Ok(())
}
