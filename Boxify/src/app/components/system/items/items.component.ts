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
export class ItemsComponent implements OnInit{
    visible: boolean = false;
    visible2: boolean = false;
    showDialog() {
        this.showNewCategoryInput = false;
        this.newCategory = '';
        this.visible = true;
    }
    closeDialog() {
        this.showNewCategoryInput = false;
        this.newCategory = '';
        this.visible = false;
    }
    
    ngOnInit(): void {
      this.clearItems();
      this.getItems()
    }
    constructor(
        private api : ApiService,
        private msg : MessageService,
        private auth: AuthService,
        private messageService: MessageService
    ) {}

        //Item
    item:Item = {
        name: '',
        userId: 0,
        description: '',
        category: '',
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
        weightKg: 0,
        imagepath: null,
    };
    ItemsList: Item[] = []
    items: any[] | undefined;

    // Categories
    categories: string[] = [];
    filteredCategories: string[] = [];
    newCategory: string = '';
    showNewCategoryInput: boolean = false;

    value: any;

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredCategories = this.categories.filter(c =>
            c.toLowerCase().includes(query)
        );
    }

    extractCategories() {
        const unique = new Set<string>();
        this.ItemsList.forEach(i => {
            if (i.category && i.category.trim() !== '') {
                unique.add(i.category.trim());
            }
        });
        this.categories = Array.from(unique).sort();
    }

    addNewCategory() {
        if (this.newCategory.trim() !== '') {
            const cat = this.newCategory.trim();
            if (!this.categories.includes(cat)) {
                this.categories.push(cat);
                this.categories.sort();
            }
            this.item.category = cat;
            this.newCategory = '';
            this.showNewCategoryInput = false;
        }
    }

    onBasicUploadAuto(event: UploadEvent) {
        alert("a")
    }
    
    clearItems(){
      this.item.name = '',
      this.item.description = '',
      this.item.category = '',
      this.item.lengthCm = 0,
      this.item.widthCm = 0,
      this.item.heightCm = 0,
      this.item.weightKg = 0,
      this.item.imagepath = null

      this.ItemsList = []
    }
    NoItemsFound:boolean = false;
    getItems(){
      this.clearItems();
      this.api.selectByField("items", "userId", "eq", this.auth.loggedUser().id).subscribe({
            next: (response) => {
                this.ItemsList = response as Item[];
                this.extractCategories();
                if(this.ItemsList.length !== 0) {
                    this.NoItemsFound = false;
                }
            },
            error: (error) => {
                this.msg.show("error", "Error", "Failed to retrieve boxes");
                console.log("Error details:", error);
            }
        });
    }
    saveItem(){
      if(this.item.name == '' || this.item.description == '' || this.item.weightKg == 0 || this.item.widthCm == 0 || this.item.heightCm == 0 || this.item.lengthCm == 0){
        this.msg.show('error', 'Error', 'Please fill in all inputs');
      }
      else{
        console.log(this.auth.loggedUser().id);
        this.item.userId = this.auth.loggedUser().id
        this.api.insert('items', this.item, true).subscribe({
            next: (res) => {
                console.log(this.item)
                this.msg.show('success', 'Success', 'Item added to box');
                this.closeDialog();
                this.clearItems()
                this.getItems();
            },
            error: (err) => {
                console.error('Failed to add item to box', err);
                this.msg.show('error', 'Error', err.error?.error || 'Failed to add item to box');
            }
        });
      }
    }

    deleteItem(itemId:string){
      console.log(itemId)
      this.api.delete("items",itemId).subscribe({
        next:(res)=>{
          console.log(itemId)
          this.msg.show('success','Success','Item deleted successfully!')
          this.getItems();
        },
        error:(err)=>{
          console.error('Failed to delete item', err)
          this.msg.show('error','Error', err.error?.error|| 'Failed to delete item!')
        }
      });

    }
    moveToBox(){
      this.visible2 = true;
    }
}
