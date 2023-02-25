import * as config from 'config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');
const rpc = config.get<string>('rpc');
const web3 = new Web3(rpc);
export class TransactionRecordsHelper {
  public static checkRecoverSameAddress(
    address: string,
    signature: string,
    message: string,
  ): boolean {
    const recover = web3.eth.accounts.recover(message, signature);
    console.log({ recover });
    const recoverConvert = Web3.utils.toChecksumAddress(recover);
    const addressConvert = Web3.utils.toChecksumAddress(address);
    return addressConvert === recoverConvert;
  }

  public static getGasLimit(tx): number {
    return web3.eth.estimateGas(tx);
  }

  public static async getChainId(): Promise<number> {
    return web3.eth.getChainId();
  }

  public static async getNonceKey(): Promise<string> {
    const chainId = await TransactionRecordsHelper.getChainId();
    return chainId + '_nonce';
  }

  public static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
