import { strict as assert } from "assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import sinon from "sinon";
import fs from "fs";
import { readCSV } from ".";

describe("readCSV", () => {
  let sandbox: sinon.SinonSandbox;
  let createReadStreamStub: sinon.SinonStub;
  let parseStub: sinon.SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    createReadStreamStub = sandbox.stub(fs, "createReadStream");
    parseStub = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should read and parse CSV file correctly", async () => {
    const mockData = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ];

    const mockStream = {
      pipe: sinon.stub().returnsThis(),
      on: sinon.stub().callsFake((event, callback) => {
        if (event === "data") {
          mockData.forEach(callback);
        }
        if (event === "end") {
          callback();
        }
        return mockStream;
      }),
    };

    createReadStreamStub.returns(mockStream);
    parseStub.returns(mockStream);

    const result = await readCSV<{ id: string; name: string }>(
      "mockFilePath.csv"
    );

    assert.deepStrictEqual(result, mockData);
  });

  it("should handle errors during CSV reading", async () => {
    const mockError = new Error("Read error");

    const mockStream = {
      pipe: sinon.stub().returnsThis(),
      on: sinon.stub().callsFake((event, callback) => {
        if (event === "error") {
          callback(mockError);
        }
        return mockStream;
      }),
    };

    createReadStreamStub.returns(mockStream);
    parseStub.returns(mockStream);

    await assert.rejects(
      readCSV<{ id: string; name: string }>("mockFilePath.csv"),
      mockError
    );
  });
});
