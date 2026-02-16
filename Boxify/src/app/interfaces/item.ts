export interface Item {
    id: number;
    name: string;
    userId: number;
    description: string;
    category: string;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    weightKg: number;
    imagepath: string | null;
    createdAt: string | Date | null;
    updatedAt: string | Date | null;
}