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
import { Box } from '../../../interfaces/box';
import { BoxItem } from '../../../interfaces/boxItem';
import { Item } from '../../../interfaces/item';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { SafeResourceUrl } from '@angular/platform-browser';



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
        TableModule
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

    getBoxes(){
        this.api.selectByField("boxes", "userId", "eq", this.auth.loggedUser().id).subscribe({
            next: (response) => {
                this.BoxesList = response as Box[];
                if(this.BoxesList.length !== 0) {
                    this.NoBoxesFound = false;
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

    boxItems = [
      { name: 'Name1', dimensions: '10x10x10', weight: '5kg' },
    ];


  value: number = 0;
  items: MenuItem[] | undefined;
  ngOnInit() {
        this.items = [
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
    }

    // Selected box for adding items
    selectedBox: Box | null = null;

    openAddItem(box: Box) {
        this.AddItemMode = true;
        this.selectedBox = box;
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
        
        const payload: any = {
            boxId: this.selectedBox.id,
            itemId: this.item.id,
            quantity: this.boxItem.quantity || 1
        };
        this.api.insert('boxitems', payload, true).subscribe({
            next: (res) => {
                this.msg.show('success', 'Success', 'Item added to box');
                this.closeDialog();
                this.getBoxes();
                this.AddItemMode = false;
                this.selectedBox = null;
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
