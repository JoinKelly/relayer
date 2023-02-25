import { Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { TransactionRecordsService } from './transaction-records.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');
import * as config from 'config';
import { relayer_ABI } from '../../shares/abis/relayer';
import { TransactionRecordStatus } from './constants/constants';
import { TransactionRecordsHelper } from './helper/transaction-records.helper';
@Console()
@Injectable()
export class TransactionRecordsConsole {
  private web3;
  private contract;
  private readonly signerAddress;
  private readonly threshold;
  private readonly maxAmountTx;
  constructor(
    private readonly transactionRecordsService: TransactionRecordsService,
  ) {
    const rpc = config.get<string>('rpc');
    const privateKey = config.get<string>('privateKey');
    this.web3 = new Web3(rpc);
    this.web3.eth.accounts.wallet.add(privateKey);
    const contractABI = relayer_ABI;
    const contractAddress = config.get<string>('relayContract');
    this.contract = new this.web3.eth.Contract(
      contractABI as any,
      contractAddress,
    );
    this.signerAddress = config.get<string>('signerAddress');
    this.threshold = config.get<string>('threshold');
    this.maxAmountTx = config.get<string>('maxAmountTx');
  }
  @Command({
    command: 'send-tx',
    description: 'Send list of transactions',
  })
  async sendBatchTx(): Promise<void> {
    while (true) {
      const listTx = await this.transactionRecordsService.getTransactionRecords(
        this.maxAmountTx,
      );
      if (listTx.length != 0) {
        console.log('\x1b[32m%s\x1b[0m', 'Processing batch of transactions:');
        const listId = listTx.map((item) => item.id);
        let nonce = await this.transactionRecordsService.getNonce();
        if (!nonce) {
          nonce = +(await this.contract.methods.nonce().call());
        }
        const newNonce = nonce + 1;
        await this.transactionRecordsService.updateListTx(
          listId,
          TransactionRecordStatus.PROCESSING,
          null,
        );
        const targets = listTx.map((item) => item.targetAddress);
        const callData = listTx.map((item) => item.callData);
        const gasLimit = await this.contract.methods
          .execute(targets, callData, newNonce)
          .estimateGas({
            from: this.signerAddress,
          });
        const rs = await this.contract.methods
          .execute(targets, callData, newNonce)
          .send({
            from: this.signerAddress,
            gas: gasLimit,
          });

        await this.transactionRecordsService.updateNonce(newNonce);
        await this.transactionRecordsService.updateListTx(
          listId,
          TransactionRecordStatus.SUCCESS,
          rs.transactionHash,
        );
        console.log(rs);
        console.log('\x1b[32m%s\x1b[0m', 'Done ......');
      }
      console.log('\x1b[32m%s\x1b[0m', 'Waiting ......');
      await TransactionRecordsHelper.sleep(this.threshold);
    }
  }
}
