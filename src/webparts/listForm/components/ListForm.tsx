// src/webparts/listForm/components/ListForm.tsx

import * as React from 'react';
import { useState } from 'react';
import styles from './ListForm.module.scss';
import { IListFormProps } from './IListFormProps';

export default function ListForm(props: IListFormProps): JSX.Element {
  // State untuk menyimpan nilai dari setiap input field
  const [title, setTitle] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  // State untuk menangani proses submit
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ message: string, isError: boolean } | null>(null);

  // Handler saat input file berubah
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
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
      await props.spService.addListItem(props.listName, title, selectedFile);

      // Jika sukses, reset form dan tampilkan pesan sukses
      setStatusMessage({ message: 'Item successfully added!', isError: false });
      setTitle('');
      setSelectedFile(undefined);
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
          <label htmlFor="file-input">Attachment</label>
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
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