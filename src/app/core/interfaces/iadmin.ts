export interface Iadmin {


  userID: number;
  username: string;
  role: string;
  privileges: Privilege[];
}

interface Privilege {
  id: number;
  name: string;
}