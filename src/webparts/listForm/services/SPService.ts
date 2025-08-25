import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";

// Import interface dari sub-modul yang benar
import { IItem } from "@pnp/sp/items";
import { IAttachments} from "@pnp/sp/attachments";

// Side-effect imports untuk mengaktifkan fungsi
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

// Interface kustom untuk membantu TypeScript
// BENAR
interface IItemWithAttachments extends IItem {
    attachmentFiles: IAttachments;
}

export class SPService {
  private _sp: SPFI;

  constructor(context: WebPartContext) {
    this._sp = spfi().using(SPFx(context));
  }

  public async addListItem(listName: string, title: string, file: File | undefined): Promise<void> {
    try {
      const itemAddResult = await this._sp.web.lists.getByTitle(listName).items.add({
        Title: title
      });

      console.log("Item added successfully. New item ID:", itemAddResult.data.Id);

      if (file) {
        const itemWithAttachments = this._sp.web.lists.getByTitle(listName).items.getById(itemAddResult.data.Id);

        await (itemWithAttachments as IItemWithAttachments).attachmentFiles.add(file.name, file);

        console.log("Attachment added successfully.");
      }

    } catch (error) {
      console.error("Error adding list item:", error);
      throw error;
    }
  }
}