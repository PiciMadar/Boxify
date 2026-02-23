import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../interfaces/message';


@Injectable({
  providedIn: 'root'
})

export class MessageService {
  add(arg0: { severity: string; summary: string; detail: string; }) {
    throw new Error('Method not implemented.');
  }

  private messageSubject = new BehaviorSubject<Message | null>(null);

  message$ = this.messageSubject.asObservable();

  show(severity: Message['severity'], title: string, message: string){
    this.messageSubject.next({ severity, title, message });
    setTimeout(()=> this.hide(), 3000);
  }

  private hide(){
    this.messageSubject.next(null);
  }

}