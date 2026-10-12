import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toPosition } from "#zerion/commands/analytics/positions.js";

describe("toPosition", () => {
  it("includes protocol, position_type, position_name and dapp for DeFi rows", () => {
    const p = toPosition({
      attributes: {
        name: "ether.fi Yield: WETH Pool",
        protocol: "ether.fi",
        position_type: "deposit",
        fungible_info: { name: "Wrapped Ether", symbol: "WETH" },
        quantity: { float: 1.5 },
        value: 6000,
        price: 4000,
        changes: { absolute_1d: 12, percent_1d: 0.2 },
      },
      relationships: { chain: { data: { id: "ethereum" } }, dapp: { data: { id: "ether-fi" } } },
    });
    assert.deepEqual(p, {
      name: "Wrapped Ether",
      symbol: "WETH",
      chain: "ethereum",
      quantity: 1.5,
      value: 6000,
      price: 4000,
      change_absolute_1d: 12,
      change_percent_1d: 0.2,
      protocol: "ether.fi",
      position_type: "deposit",
      position_name: "ether.fi Yield: WETH Pool",
      dapp: "ether-fi",
    });
  });

  it("returns nulls for wallet tokens without protocol metadata", () => {
    const p = toPosition({
      attributes: { fungible_info: { name: "Ether", symbol: "ETH" }, position_type: "wallet", value: 10 },
      relationships: { chain: { data: { id: "base" } } },
    });
    assert.equal(p.protocol, null);
    assert.equal(p.position_type, "wallet");
    assert.equal(p.position_name, null);
    assert.equal(p.dapp, null);
  });
});
