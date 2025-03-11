export interface Ideadlins 

  {
  id: number;
  applicationStartDate: string;
  applicationEndDate: string;
  studentType: string;
  universityResponseDTO: UniversityResponseDTO;
}

interface UniversityResponseDTO {
  id: number;
  name: string;
}
