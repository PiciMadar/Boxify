import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { KnobModule } from 'primeng/knob';
import { CardModule } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { Box } from '../../../interfaces/box';
import { BoxItem } from '../../../interfaces/boxItem';
import { Item } from '../../../interfaces/item';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-boxes',
  standalone: true,
    imports: [
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        KnobModule,
        CardModule,
        CommonModule,
        FormsModule,
        DialogModule,
        FloatLabelModule,
        InputNumber,
        TableModule,
        SelectModule
    ],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss'
})
export class BoxesComponent implements OnInit{
    //Modal controll
    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }
    closeDialog() {
        this.visible = false;
        this.AddItemMode = false;
        this.selectedBox = null;
    }
    AddItemMode:boolean = false;
    NoBoxesFound:boolean = true;
    EditMode:boolean = false;
    BoxesList:Box[] = [];

    constructor(
        private api : ApiService,
        private msg : MessageService,
        private auth: AuthService,
      ) {}

    //Boxes
    box : Box = {
      userId: 0,
      lengthCm: 0,
      widthCm: 0,
      heightCm: 0,
      maxWeightKg: 0,
      name:'',
    };
    //BoxItem
    boxItem: BoxItem = {
      id: 0,
      boxId: 0,
      itemId: 0,
      quantity: 0,
      createdAt: null,
      updatedAt: null
    };
    //Item
    item:Item = {
        id: 0,
        name: '',
        userId: 0,
        description: '',
        category: '',
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
        weightKg: 0,
        imagepath: null,
        createdAt: null,
        updatedAt: null
    };
    items: Item[] = [];
    selectedItem: Item | null = null;

    getBoxes(){
        this.api.selectByField("boxes", "userId", "eq", this.auth.loggedUser().id).subscribe({
            next: (response) => {
                this.BoxesList = response as Box[];
                if(this.BoxesList.length !== 0) {
                    this.NoBoxesFound = false;
                    // Load items for each box
                    this.BoxesList.forEach(b => {
                        if (b.id) {
                            this.loadBoxItems(b.id, 'card');
                        }
                    });
                }
            },
            error: (error) => {
                this.msg.show("error", "Error", "Failed to retrieve boxes");
                console.log("Error details:", error);
            }
        });
    }

    clearForm(){
        this.box.name = '';
        this.box.note = '';
    }
    editBoxes(){

    }
    addItem(){
        if(this.box.name != '' || this.box.note != '') {

        }
        else
        {
            this.msg.show("error", "Error", "Please fill in the box name and description");
        }
    }
    saveBox(){
        if(this.box.name != '' || this.box.note != '') {
            this.box.userId = this.auth.loggedUser().id;
            console.log("Box details:", this.box);

            this.api.insert("boxes", this.box, true).subscribe({
                next: (response) => {
                    this.msg.show("success", "Success", "Box created successfully");
                    this.clearForm();
                    this.getBoxes()
                },
                error: (error) => {
                    this.msg.show("error", "Error", "Failed to create box");
                    console.log("Error details:", error);
                }
            });
            this.AddItemMode = false;
            this.closeDialog();
        }
        else
        {
            this.msg.show("error", "Error", "Please fill in the box name and description");
        }
    }
    selectBoxSize(size:string){
        this.box.widthCm = size === 'small' ? 30 : size === 'medium' ? 90 : 200;
        this.box.heightCm = size === 'small' ? 30 : size === 'medium' ? 90 : 200;
        this.box.lengthCm = size === 'small' ? 30 : size === 'medium' ? 90 : 200;
    }

    boxItems: { name: string, dimensions: string, weight: string, quantity: number }[] = [];

    // Map to store resolved box items per box id for the cards
    boxItemsMap: { [boxId: string]: { name: string, dimensions: string, weight: string, quantity: number }[] } = {};


  value: number = 0;
  menuItems: MenuItem[] | undefined;
  ngOnInit() {
        this.menuItems = [
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
        this.getBoxes();
        this.getUserItems();
    }

    getUserItems() {
        this.api.selectByField("items", "userId", "eq", this.auth.loggedUser().id).subscribe({
            next: (response) => {
                this.items = response as Item[];
            },
            error: (error) => {
                console.error("Failed to retrieve items:", error);
            }
        });
    }

    loadBoxItems(boxId: string, target: 'dialog' | 'card' = 'dialog') {
        this.api.selectByField("box_items", "boxId", "eq", boxId).subscribe({
            next: (response) => {
                const boxItemRecords = response as BoxItem[];
                const resolved: { name: string, dimensions: string, weight: string, quantity: number }[] = [];
                let pending = boxItemRecords.length;

                if (pending === 0) {
                    if (target === 'dialog') {
                        this.boxItems = [];
                    } else {
                        this.boxItemsMap[boxId] = [];
                    }
                    return;
                }

                boxItemRecords.forEach(bi => {
                    this.api.selectById("items", bi.itemId.toString()).subscribe({
                        next: (itemRes: any) => {
                            const it = (Array.isArray(itemRes) ? itemRes[0] : itemRes) as Item;
                            resolved.push({
                                name: it.name,
                                dimensions: `${it.widthCm}x${it.heightCm}x${it.lengthCm}`,
                                weight: `${it.weightKg} kg`,
                                quantity: bi.quantity
                            });
                            pending--;
                            if (pending === 0) {
                                if (target === 'dialog') {
                                    this.boxItems = resolved;
                                } else {
                                    this.boxItemsMap[boxId] = resolved;
                                }
                            }
                        },
                        error: () => {
                            resolved.push({
                                name: `Item #${bi.itemId}`,
                                dimensions: '—',
                                weight: '—',
                                quantity: bi.quantity
                            });
                            pending--;
                            if (pending === 0) {
                                if (target === 'dialog') {
                                    this.boxItems = resolved;
                                } else {
                                    this.boxItemsMap[boxId] = resolved;
                                }
                            }
                        }
                    });
                });
            },
            error: (error) => {
                console.error("Failed to load box items:", error);
                if (target === 'dialog') {
                    this.boxItems = [];
                }
            }
        });
    }

    onItemSelected(event: any) {
        if (this.selectedItem) {
            this.item = { ...this.selectedItem };
        }
    }

    // Selected box for adding items
    selectedBox: Box | null = null;

    openAddItem(box: Box) {
        this.AddItemMode = true;
        this.selectedBox = box;
        this.selectedItem = null;
        this.boxItems = [];
        this.getUserItems();
        if (box.id) {
            this.loadBoxItems(box.id, 'dialog');
        }
        // Prefill dialog with selected box context
        this.box = {
            ...this.box,
            userId: box.userId,
            name: box.name,
            note: box.note,
            lengthCm: box.lengthCm,
            widthCm: box.widthCm,
            heightCm: box.heightCm,
            maxWeightKg: box.maxWeightKg
        };
        this.showDialog();
    }

    addItemToBox() {
        if (!this.selectedBox) {
            this.msg.show('error', 'Error', 'No box selected');
            return;
        }
        if (!this.selectedItem && !this.item.id) {
            this.msg.show('error', 'Error', 'Please select an item');
            return;
        }
        
        const itemId = this.selectedItem?.id || this.item.id;
        const payload: any = {
            boxId: this.selectedBox.id,
            itemId: itemId,
            quantity: this.boxItem.quantity || 1
        };
        this.api.insert('box_items', payload, true).subscribe({
            next: (res) => {
                this.msg.show('success', 'Success', 'Item added to box');
                // Refresh the box items in the dialog
                if (this.selectedBox?.id) {
                    this.loadBoxItems(this.selectedBox.id, 'dialog');
                }
                this.selectedItem = null;
                this.item = { id: 0, name: '', userId: 0, description: '', category: '', lengthCm: 0, widthCm: 0, heightCm: 0, weightKg: 0, imagepath: null, createdAt: null, updatedAt: null };
            },
            error: (err) => {
                console.error('Failed to add item to box', err);
                this.msg.show('error', 'Error', err.error?.error || 'Failed to add item to box');
            }
        });
        this.AddItemMode = false;
    }
    deleteBox(boxId: string) {
        this.api.delete(`boxes`, boxId, true).subscribe({
            next: (res) => {
                this.msg.show('success', 'Success', 'Box deleted successfully');
                this.getBoxes();
            },
            error: (err) => {
                console.error('Failed to delete box', err);
                this.msg.show('error', 'Error', err.error?.error || 'Failed to delete box');
            }
        });
        // Refresh the page
        location.reload();
    }
}
