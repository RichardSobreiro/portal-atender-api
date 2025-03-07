export interface AnamnesisQueryDto {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  professionalId?: string;
  anamnesisModelType?: string;
  patientId?: string;
}
