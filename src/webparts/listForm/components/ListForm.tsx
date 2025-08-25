// src/webparts/listForm/components/ListForm.tsx

import * as React from 'react';
import { useState } from 'react';
import styles from './ListForm.module.scss';
import { IListFormProps } from './IListFormProps';

export default function ListForm(props: IListFormProps): JSX.Element {
  // State untuk menyimpan nilai dari setiap input field
  const [title, setTitle] = useState<string>('');
  // DIUBAH: State untuk menyimpan array of files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // State untuk menangani proses submit
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ message: string, isError: boolean } | null>(null);

  // DIUBAH: Handler saat input file berubah untuk multiple files
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  // Handler saat form di-submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!props.listName) {
      setStatusMessage({ message: 'Error: List name is not configured in web part properties.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // DIUBAH: Mengirim array 'selectedFiles' ke service
      // PENTING: Pastikan props.spService.addListItem juga diubah untuk menerima array File[]
      await props.spService.addListItem(props.listName, title, selectedFiles);

      // Jika sukses, reset form dan tampilkan pesan sukses
      setStatusMessage({ message: 'Item and attachments successfully added!', isError: false });
      setTitle('');
      // DIUBAH: Reset state file menjadi array kosong
      setSelectedFiles([]);
      // Reset file input value
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setStatusMessage({ message: `Error: ${error.message}`, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.listForm}>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="file-input">Attachments</label>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            multiple // DIUBAH: Tambahkan atribut multiple
          />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      {statusMessage && (
        <div className={`${styles.statusMessage} ${statusMessage.isError ? styles.error : styles.success}`}>
          {statusMessage.message}
        </div>
      )}
    </section>
  );
}