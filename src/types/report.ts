export type TReport = {
  items: TItem[];
  feedbacks: TFeedback[];
};

export type TItem = {
  name: string;
  total: number;
  percent: number;
};

export type TFeedback = {
  id: number;
  rate: number;
  content: string;
  createDate: string;
  orderId: number;
  customerId: number;
};
