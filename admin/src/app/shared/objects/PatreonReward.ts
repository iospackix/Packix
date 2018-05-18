export interface PatreonReward {
  id: string;
  amount: number;
  campaignId: string;

  // public get price(): number {
  //   return this.amount;
  // }
}
