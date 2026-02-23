export interface BoxItem {
    id: number;
    boxId: number;
    description: string;
    category: string;
    itemId: number;
    quantity: number;
    createdAt: string | Date | null;
    updatedAt: string | Date | null;
}