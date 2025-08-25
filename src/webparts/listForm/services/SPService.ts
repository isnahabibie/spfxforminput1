// src/webparts/listform/services/SPService.ts

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

export class SPService {
  private _context: WebPartContext;

  constructor(context: WebPartContext) {
    this._context = context;
  }

  // --- FUNGSI YANG DIPERBARUI UNTUK MENERIMA 5 ARGUMEN ---
  public async addListItem(
    parentListName: string,
    childListName: string,
    title: string,
    startDate: string,   // <-- Parameter baru
    finishDate: string,  // <-- Parameter baru
    parentFiles: File[],
    childFiles: File[]
  ): Promise<void> {

    const sp = spfi().using(SPFx(this._context));

    try {
      // === LANGKAH 1: BUAT ITEM DI LIST PARENT (My Documents) ===
      const itemAddResult = await sp.web.lists.getByTitle(parentListName).items.add({
        Title: title,
      StartDate: startDate,  // <-- Data baru untuk disimpan
      FinishDate: finishDate   // <-- Data baru untuk disimpan
      });

      // Ambil ID dari item yang baru saja dibuat
      const parentItemId = itemAddResult.data.Id;
      
      // Tambahkan attachment untuk item parent jika ada
      if (parentFiles && parentFiles.length > 0) {
        const addedItem = itemAddResult.item;
        for (const file of parentFiles) {
          await addedItem.attachmentFiles.add(file.name, file);
        }
      }

      // === LANGKAH 2: BUAT ITEM DI LIST CHILD (mydocattach) UNTUK SETIAP FILE ===
      if (childFiles && childFiles.length > 0 && childListName) {
        for (const file of childFiles) {
          // Buat item baru di list child, dan langsung isi kolom lookup-nya.
          // PENTING: Untuk mengisi kolom lookup "MyDocId", nama field-nya harus diakhiri dengan "Id" -> "MyDocIdId".
          const childItemAddResult = await sp.web.lists.getByTitle(childListName).items.add({
            Title: file.name, // Anda bisa ganti dengan title lain jika perlu
            MyDocIdId: parentItemId
          });

          // Tambahkan file sebagai attachment ke item child yang baru dibuat
          const addedChildItem = childItemAddResult.item;
          await addedChildItem.attachmentFiles.add(file.name, file);
        }
      }

    } catch (error) {
      console.error("Error in addListItem service", error);
      throw error;
    }
  }
}