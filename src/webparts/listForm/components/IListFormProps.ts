// src/webparts/listForm/components/IListFormProps.ts
import { WebPartContext } from '@microsoft/sp-webpart-base';
import  { SPService }   from "../services/SPService";

export interface IListFormProps {
  listName: string;
  childListName: string; // <-- TAMBAHKAN BARIS INI
  spService: SPService;
  context: WebPartContext;
}