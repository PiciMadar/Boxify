import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
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

    boxItems = [
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
