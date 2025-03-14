export interface Ipenalty {

  id: number;
  penaltyTitle: string;
  reason: string;
  dateIssued: string;
  user: User;
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
}