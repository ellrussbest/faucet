/**
 * tx_hash = keccak256(tx_data)
 * address = last 20 bytes of keccak256(public_key)
 *
 * anything less than 0x80 is decoded as it is
 *
 * tx-data: 0xf86c01850c4b201000825208949cbfd6ebdb9cfcccd6b043f43e524583486d455e880490283b23ec8f768025a067da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6ca00b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842
 * 0x
 * f8 = f7 + length of payload in binary form in bytes i.e.
 * length of our payload is 108bytes,
 * 108 to binary is 01101100 which is exactly one byte
 * so it is f7 + 0x01 = f8
 *
 * f8 -> (0xf8 - 0xf7) = 1byte is the length of the next string
 * 6c -> (108bytes) length of your paload
 * 01 -> nonce
 * 85 -> (0x85 - 0x80) = 5bytes is the length of the next string
 * 0c4b201000 -> gas price
 * 82 -> (0x82 - 0x80) = 2bytes is the length of the next string
 * 5208 -> gas limit
 * 94 -> (0x94 - 0x80) = 20bytes is the length of the next string
 * 9cbfd6ebdb9cfcccd6b043f43e524583486d455e -> to address
 * 88 -> (0x88 - 0x80) = 8bytes is the length of the next string
 * 0490283b23ec8f76 -> value
 * 80 -> data (empty string, or null)
 * 25 -> v
 * a0 -> (0xa0 - 0x80) = 32bytes is the length of the next string
 * 67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c - r
 * a0 -> (0xa0 - 0x80) = 32bytes is the length of the next string
 * 0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842 - s
 */

const EthereumTx = require("ethereumjs-tx").Transaction;

// 1 nibble = 4 bits
// 1 byte = 8 bits
const signedtxParams = {
  nonce: "0x01",
  gasPrice: "0x0c4b201000",
  gasLimit: "0x5208",
  to: "0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e",
  value: "0x0490283b23ec8f76",
  data: "0x", // null, ""
  v: "0x25",
  r: "0x67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c",
  s: "0x0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842",
};

const signed_tx = new EthereumTx(signedtxParams, { chain: "mainnet" });

const key = signed_tx.getSenderPublicKey();
const address = signed_tx.getSenderAddress();
const isValid = signed_tx.verifySignature();

console.log("Public key: ", key.toString("hex"));
console.log("Address: ", address.toString("hex"));
console.log("Is Valid: ", isValid);

// let's sign our own tx
const unsignedtxParams = {
  nonce: "0x01",
  gasPrice: "0x0c4b201000",
  gasLimit: "0x5208",
  to: "0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e",
  value: "0x0490283b23ec8f76",
  data: "0x", // null, ""
};

const unsigned_tx = new EthereumTx(unsignedtxParams, { chain: "mainnet" });

// for us to sign a transaction we'll need a private key
let privateKey =
  "015f9c89a1f798aad19b174ca04ea012f9996c7248791972dbf2b081e3167fa3";

// the private key should be transaformed into a byte sequence
privateKey = Buffer.from(privateKey, "hex");

// now sign the transaction
unsigned_tx.sign(privateKey);

const newSignedTx = Object.assign({}, unsigned_tx);

const { r, s, v } = newSignedTx;

console.log("r:", r.toString("hex"));
console.log("s:", s.toString("hex"));
console.log("v:", v.toString("hex"));

console.log(newSignedTx);
