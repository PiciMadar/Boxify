import { Component, OnInit } from '@angular/core';
import { MenuItem} from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { Knob } from 'primeng/knob';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { Box } from '../../../interfaces/box';
import { BoxItem } from '../../../interfaces/boxItem';
import { Item } from '../../../interfaces/item';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [Toolbar, ButtonModule, SplitButton, InputTextModule, IconField, InputIcon,ToolbarModule,CardModule,Knob,CommonModule,FormsModule,Dialog,FloatLabel,InputNumber,ScrollPanelModule, TableModule],
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
    }
    
    constructor(
        private api : ApiService,
        private msg : MessageService,
        private auth: AuthService,
      ) {}

    //Boxes
    box : Box = {
      id: 0,
      userId: 0,
      code: '',
      labelType: '',
      lengthCm: 0,
      widthCm: 0,
      heightCm: 0,
      maxWeightKg: 0,
      location: '',
      note: null,
      status: '',
      createdAt: null,
      updatedAt: null,
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

    clearForm(){
        this.box.name = '';
        this.box.note = '';
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
            this.box.userId = 1; // Ensure userId is set
            this.box.createdAt = new Date();
            this.box.updatedAt = new Date();
            console.log("Box details:", this.box);
            this.api.insert("boxes", this.box).subscribe({
                next: (response) => {
                    this.msg.show("success", "Success", "Box created successfully");
                },
                error: (error) => {
                    this.msg.show("error", "Error", "Failed to create box");
                    console.log("Error details:", error);
                }
            });
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
      { name: 'Name2', dimensions: '20x20x20', weight: '10kg' },
      { name: 'Name3', dimensions: '5x5x5', weight: '2kg' },
      { name: 'Name1', dimensions: '10x10x10', weight: '5kg' },
      { name: 'Name2', dimensions: '20x20x20', weight: '10kg' },
      { name: 'Name3', dimensions: '5x5x5', weight: '2kg' },
      { name: 'Name1', dimensions: '10x10x10', weight: '5kg' },
      { name: 'Name2', dimensions: '20x20x20', weight: '10kg' },
      { name: 'Name3', dimensions: '5x5x5', weight: '2kg' },
      { name: 'Name1', dimensions: '10x10x10', weight: '5kg' },
      { name: 'Name2', dimensions: '20x20x20', weight: '10kg' },
      { name: 'Name3', dimensions: '5x5x5', weight: '2kg' }
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
    }
}
