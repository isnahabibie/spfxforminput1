// PASTE KODE INI JIKA FILE ANDA BENAR-BENAR HILANG

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ListFormWebPartStrings';

// Import komponen React dan props-nya
import ListForm from './components/ListForm';
import { IListFormProps } from './components/IListFormProps';

// Import Service dan Props utama
import { SPService } from './services/SPService';
import { IListFormWebPartProps } from './IListFormWebPartProps';

export default class ListFormWebPart extends BaseClientSideWebPart<IListFormWebPartProps> {

  private _spService: SPService;

  protected onInit(): Promise<void> {
    // Inisialisasi service dengan context
    this._spService = new SPService(this.context);
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IListFormProps> = React.createElement(
      ListForm,
      {
        listName: this.properties.listName,
        childListName: this.properties.childListName,
        spService: this._spService,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'Parent List Name'
                }),
                PropertyPaneTextField('childListName', {
                  label: 'Child List Name'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}