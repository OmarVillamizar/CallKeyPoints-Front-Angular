/** Mirrors the backend Call DTOs exactly — field names must not drift. */

export interface CallSummary {
  id: number;
  title: string;
  createdAt: string;
}

export interface CreateCallRequest {
  transcript: string;
}

/**
 * Full call. The structured report fields arrive as explicit columns (no client-side
 * JSON parse needed). Optional fields may be absent when the LLM could not extract them.
 */
export interface CallDetail {
  id: number;
  userId: string;
  title: string;
  technicianName?: string;
  transcript: string;
  knowledgeBase?: string;
  reportExtractedData?: string;

  atendio?: string;
  numeroCuenta?: string;
  direccion?: string;
  protocoloKb?: string;
  severidad?: string;
  responsabilidad?: string;
  sintomaReportado?: string;
  diagnostico?: string;
  accionesRecomendadas?: string[];
  estadoResolucion?: string;
  ordenTrabajo?: string;
  tiempoRespuesta?: string;
  cumplimientoProtocolo?: string;
  sentimientoCliente?: string;
  reportSummary?: string;

  reportGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}
