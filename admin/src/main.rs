use clap::{Parser, Subcommand};

mod test;
pub mod bulk;
pub mod instructions;
pub mod state;

#[derive(Parser)]
#[command(version = "0.1.0", long_about = None, about = "Command-line interface to administrate the `twamm` program")]
struct CLI {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    ///
    CancelWithdrawals,
    ///
    DeleteTestPair,
    ///
    DeleteTestPool,
    ///
    GetOutstandingAmount,
    /// Initialize
    Init,
    ///
    InitTokenPair,
    ///
    ListMultisig,
    ///
    ListOrders,
    ///
    ListPools,
    ///
    ListTokenPairs,
    ///
    SetAdminSigners,
    ///
    SetCrankAuthority,
    ///
    SetFees,
    ///
    SetLimits,
    ///
    SetOracleConfig,
    ///
    SetPermissions,
    ///
    SetTestOraclePrice,
    ///
    SetTestTime,
    ///
    SetTimeInForce,
    ///
    Settle,
    ///
    WithdrawFees,
}

fn main() {
    let args = CLI::parse();

    match args.command {
        Some(Commands::Init) => instructions::init(),
        // TODO: add other commands here
        _ => {
            println!("Welcome to twamm admin. Use the `help` command to get more information.");
        },
    }
}
