export interface Ibuilding {
  id: number;
  name: string;
  type: string;
  university: University;
}

interface University {
  id: number;
  name: string;
}