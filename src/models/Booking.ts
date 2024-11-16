// src/models/Booking.ts
export interface BookingRequest {
  when: string; // Daturm och tid
  lanes: number; //Antal banor
  people: number; // Antal deltagare
  shoes: number[]; // Array med skor
}

export interface BookingResponse {
  when: string;
  lanes: number;
  people: number;
  shoes: number[];
  price: string; // Pris som räkänas ut backend
  id: string; //Bokningsnummer
  active: boolean; // Visar om booknignen är aktiv
}
