// src/app/components/item-list/item-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  imports: [
    FormsModule,
    NgForOf
  ]
})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  newItem = '';

  constructor(private itemService: TestService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe((data) => {
      this.items = data;
    });
  }

  addItem(): void {
    if (this.newItem.trim()) {
      this.itemService.addItem({ name: this.newItem }).then(() => {
        this.newItem = '';
      });
    }
  }

  deleteItem(id: string): void {
    this.itemService.deleteItem(id);
  }
}
