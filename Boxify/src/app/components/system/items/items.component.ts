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
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-items',
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
        AutoCompleteModule,
        FileUpload,
        ToastModule
    ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {
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
        private messageService: MessageService
    ) {}

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

    items: any[] | undefined;

    value: any;

    search(event: AutoCompleteCompleteEvent) {
    let _items = [...Array(10).keys()];

    this.items = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
    }

    onBasicUploadAuto(event: UploadEvent) {
        alert("a")
    }
    
    getItems(){

    }
    saveItem(){
      if(this.item.name == '' || this.item.description == '' || this.item.weightKg == 0 || this.item.widthCm == 0 || this.item.heightCm == 0 || this.item.lengthCm == 0){
        this.msg.show('error', 'Error', 'Please fill in all inputs');
      }
      else{
        this.api.insert('items', this.item, true).subscribe({
            next: (res) => {
                console.log(this.item)
                this.msg.show('success', 'Success', 'Item added to box');
                this.closeDialog();
                this.getItems();
            },
            error: (err) => {
                console.error('Failed to add item to box', err);
                this.msg.show('error', 'Error', err.error?.error || 'Failed to add item to box');
            }
        });
      }
    }
}
