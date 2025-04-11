export interface Irooms {

  id: number;
  roomNumber: string;
  capacity: number;
  currentOccupancy: number;
  type: string;
  status: string;
  building: Building;
}

interface Building {
  id: number;
  name: string;
  type: string;
  university: University;
}

interface University {
  id: number;
  name: string;
}