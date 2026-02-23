export interface BoxItem {
    id: number;
    boxId: number;
    itemId: number;
    quantity: number;
    createdAt: string | Date | null;
    updatedAt: string | Date | null;
}