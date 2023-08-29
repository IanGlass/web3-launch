export default interface Request {
  description: string;
  amount: number;
  recipient: string;
  complete: boolean;
  approvalCount: number;
}