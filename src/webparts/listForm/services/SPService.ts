// src/webparts/listform/services/SPService.ts

// 1. PASTIKAN IMPORT INI ADA
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

// INI ADALAH CLASS LENGKAP YANG SUDAH DIPERBAIKI
export class SPService {
  // Property untuk menyimpan context
  private _context: WebPartContext;

  // Constructor untuk menerima context dari web part
  constructor(context: WebPartContext) {
    this._context = context;
  }

  public async addListItem(listName: string, title: string, files: File[]): Promise<void> {
    // Gunakan context yang sudah disimpan: this._context
    const sp = spfi().using(SPFx(this._context));

    try {
      // Step 1: Buat itemnya dulu
      const itemAddResult = await sp.web.lists.getByTitle(listName).items.add({
        Title: title
      });

      // Step 2: Tambahkan attachment jika ada
      if (files && files.length > 0) {
        const addedItem = itemAddResult.item;
        for (const file of files) {
          await addedItem.attachmentFiles.add(file.name, file);
        }
      }
    } catch (error) {
      console.error("Error adding list item with attachments", error);
      throw error;
    }
  }
}