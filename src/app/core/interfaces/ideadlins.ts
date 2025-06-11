export interface Ideadlins 

  {
  id: number;
  applicationStartDate: string;
  applicationEndDate: string;
  studentType: string;
  universityResponseDTO: UniversityResponseDTO;
  uid: number;
}

interface UniversityResponseDTO {
  id: number;
  name: string;
}
