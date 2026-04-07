
export interface Vuelo {
  id: number;
  aeropuertoOrigenId: number;
  aeropuertoDestinoId: number;
  fechaSalida: string; 
  fechaLlegada: string; 
  duracion: number;
  numeroEscalas: number;
}
