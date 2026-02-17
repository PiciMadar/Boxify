export interface Box {
    id: number;
    name: string;
    userId: number;
    code: string;
    labelType: string;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    maxWeightKg: number;
    location: string;
    note: string | null;
    status: string;
    createdAt: string | Date | null;
    updatedAt: string | Date | null;
}