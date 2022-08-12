import * as anchor from "@project-serum/anchor";
import { TwammTester, OrderSide } from "./twamm_tester";
import { expect } from "chai";

describe("multi_user_single_tif", () => {
  let twamm = new TwammTester();
  let tifs = [0, 300, 0, 900, 0, 0, 0, 0, 0, 0];
  let tif = 300;
  let side: OrderSide = "sell";
  let reverseSide: OrderSide = "buy";
  let settleAmountFull = 1e12;

  it("init", async () => {
    await twamm.init();
  });

  it("scenario1", async () => {
    await twamm.reset(tifs, [0, 10]);

    let ta_balances = [];
    let tb_balances = [];

    // place first order
    await twamm.setOraclePrice(60, 1);
    await twamm.placeOrder(0, side, tif, 1e9);
    [ta_balances[0], tb_balances[0]] = await twamm.getBalances(0);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(1000000000),
        targetBalance: new anchor.BN(0),
        lpSupply: new anchor.BN(1000000000),
        tokenDebtTotal: new anchor.BN(0),
        fillsVolume: new anchor.BN(0),
        weightedFillsSum: 0,
        minFillPrice: 0,
        maxFillPrice: 0,
        numTraders: new anchor.BN(1),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(0),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // settle
    await twamm.setTime(27);
    await twamm.setOraclePrice(30, 1);
    await twamm.settle(reverseSide, settleAmountFull);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(900000000),
        targetBalance: new anchor.BN(3000000),
        lpSupply: new anchor.BN(1000000000),
        tokenDebtTotal: new anchor.BN(0),
        fillsVolume: new anchor.BN(100000000),
        weightedFillsSum: 3000000000,
        minFillPrice: 30,
        maxFillPrice: 30,
        numTraders: new anchor.BN(1),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(27),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // place second order
    await twamm.setOraclePrice(15, 1);
    await twamm.placeOrder(1, side, tif, 1e9);
    [ta_balances[1], tb_balances[1]] = await twamm.getBalances(1);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(1900000000),
        targetBalance: new anchor.BN(3000000),
        lpSupply: new anchor.BN(2111111111),
        tokenDebtTotal: new anchor.BN(3333334),
        fillsVolume: new anchor.BN(100000000),
        weightedFillsSum: 3000000000,
        minFillPrice: 30,
        maxFillPrice: 30,
        numTraders: new anchor.BN(2),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(27),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // settle
    await twamm.setTime(27 * 2);
    await twamm.setOraclePrice(35, 1);
    await twamm.settle(reverseSide, settleAmountFull);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(1688888889),
        targetBalance: new anchor.BN(10388889),
        lpSupply: new anchor.BN(2111111111),
        tokenDebtTotal: new anchor.BN(3333334),
        fillsVolume: new anchor.BN(311111111),
        weightedFillsSum: 10388888885,
        minFillPrice: 30,
        maxFillPrice: 35,
        numTraders: new anchor.BN(2),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(54),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    await twamm.setTime(27 * 3);
    await twamm.setOraclePrice(20, 1);
    await twamm.settle(reverseSide, settleAmountFull);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(1477777778),
        targetBalance: new anchor.BN(14611112),
        lpSupply: new anchor.BN(2111111111),
        tokenDebtTotal: new anchor.BN(3333334),
        fillsVolume: new anchor.BN(522222222),
        weightedFillsSum: 14611111105,
        minFillPrice: 20,
        maxFillPrice: 35,
        numTraders: new anchor.BN(2),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(81),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // place third order
    await twamm.setOraclePrice(30, 1);
    await twamm.placeOrder(2, side, tif, 1e9);
    [ta_balances[2], tb_balances[2]] = await twamm.getBalances(2);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(2477777778),
        targetBalance: new anchor.BN(14611112),
        lpSupply: new anchor.BN(3539682539),
        tokenDebtTotal: new anchor.BN(15476193),
        fillsVolume: new anchor.BN(522222222),
        weightedFillsSum: 14611111105,
        minFillPrice: 20,
        maxFillPrice: 35,
        numTraders: new anchor.BN(3),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(81),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // settle
    await twamm.setTime(27 * 4);
    await twamm.setOraclePrice(35, 1);
    await twamm.settle(reverseSide, settleAmountFull);

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(2123809524),
        targetBalance: new anchor.BN(27000001),
        lpSupply: new anchor.BN(3539682539),
        tokenDebtTotal: new anchor.BN(15476193),
        fillsVolume: new anchor.BN(876190476),
        weightedFillsSum: 26999999995,
        minFillPrice: 20,
        maxFillPrice: 35,
        numTraders: new anchor.BN(3),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(108),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // cancel all orders
    await twamm.setOraclePrice(30, 1);
    let ta_balances2 = [];
    let tb_balances2 = [];
    for (let i = 0; i < 3; ++i) {
      await twamm.cancelOrder(i, tif, 1e15);
      [ta_balances2[i], tb_balances2[i]] = await twamm.getBalances(i);
    }

    expect(
      JSON.stringify({
        sourceBalance: new anchor.BN(0),
        targetBalance: new anchor.BN(0),
        lpSupply: new anchor.BN(0),
        tokenDebtTotal: new anchor.BN(0),
        fillsVolume: new anchor.BN(876190476),
        weightedFillsSum: 26999999995,
        minFillPrice: 20,
        maxFillPrice: 35,
        numTraders: new anchor.BN(0),
        settlementDebtTotal: new anchor.BN(0),
        lastBalanceChangeTime: new anchor.BN(108),
      })
    ).to.equal(JSON.stringify((await twamm.getPool(tif, 0)).sellSide));

    // check received amount
    expect(ta_balances2[0] - ta_balances[0]).to.equal(600000000);
    expect(tb_balances2[0] - tb_balances[0]).to.equal(12000000);

    expect(ta_balances2[1] - ta_balances[1]).to.equal(666666666);
    expect(tb_balances2[1] - tb_balances[1]).to.equal(10000000);

    expect(ta_balances2[2] - ta_balances[2]).to.equal(857142858);
    expect(tb_balances2[2] - tb_balances[2]).to.equal(5000001);
  });
});
