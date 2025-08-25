// src/webparts/listForm/components/IListFormProps.ts
import { SPService } from "../services/SPService";

export interface IListFormProps {
  spService: SPService;
  listName: string;
}