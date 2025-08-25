// src/webparts/listForm/components/ListForm.tsx

import * as React from 'react';
import { useState } from 'react';
import styles from './ListForm.module.scss';
import { IListFormProps } from './IListFormProps';

export default function ListForm(props: IListFormProps): JSX.Element {
  // State untuk menyimpan nilai dari setiap input field
  const [title, setTitle] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // --- PERUBAHAN ---: State baru untuk attachment kedua
  const [mydocAttachFiles, setMydocAttachFiles] = useState<File[]>([]);

    // --- TAMBAHKAN STATE BARU DI SINI ---
  const [startDate, setStartDate] = useState<string>('');
  const [finishDate, setFinishDate] = useState<string>('');
  // ------------------------------------

  // State untuk menangani proses submit
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ message: string, isError: boolean } | null>(null);

  // Handler untuk attachment pertama
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  // --- PERUBAHAN ---: Handler baru untuk attachment kedua
  const handleMydocAttachChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setMydocAttachFiles(Array.from(event.target.files));
    }
  };

  // Handler saat form di-submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    // --- PERUBAHAN ---: Validasi untuk kedua nama list
    if (!props.listName || !props.childListName) {
      setStatusMessage({ message: 'Error: Parent and Child list names must be configured in web part properties.', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // --- PERUBAHAN ---: Mengirim kedua set attachment ke service
      await props.spService.addListItem(props.listName, props.childListName, title,startDate,finishDate, selectedFiles, mydocAttachFiles);

      // Jika sukses, reset form dan tampilkan pesan sukses
      setStatusMessage({ message: 'Item and all attachments successfully added!', isError: false });
      setTitle('');
    // --- TAMBAHKAN RESET STATE BARU DI SINI ---
    setStartDate('');
    setFinishDate('');
    // ----------------------------------------
      setSelectedFiles([]);
      // --- PERUBAHAN ---: Reset state attachment kedua
      setMydocAttachFiles([]);

      // Reset file input value pertama
      const fileInput1 = document.getElementById('file-input-1') as HTMLInputElement;
      if (fileInput1) fileInput1.value = '';

      // --- PERUBAHAN ---: Reset file input value kedua
      const fileInput2 = document.getElementById('file-input-2') as HTMLInputElement;
      if (fileInput2) fileInput2.value = '';

    } catch (error) {
      setStatusMessage({ message: `Error: ${error.message}`, isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.listForm}>
      <h2 className={styles.formTitle}>Reimbursement Request</h2>
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
          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="finish-date">Finish Date</label>
          <input
            type="date"
            id="sfinish-date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            required
          />
        </div>
        



        {/* --- PERUBAHAN ---: Memperjelas label dan mengubah ID */}
        <div className={styles.formGroup}>
          <label htmlFor="file-input-1">Attachments (for My Documents)</label>
          <input
            type="file"
            id="file-input-1"
            onChange={handleFileChange}
            multiple
          />
        </div>

        {/* --- PERUBAHAN ---: Menambahkan field attachment kedua */}
        <div className={styles.formGroup}>
          <label htmlFor="file-input-2">Attachments (for mydocattach)</label>
          <input
            type="file"
            id="file-input-2"
            onChange={handleMydocAttachChange}
            multiple
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