import React from 'react';
import ReactDOM from 'react-dom';
import styles from './style.css';
import ReactModal from 'react-modal';
import MiniListing from './MiniListing.jsx';
import List from './List.jsx';
import CreateList from './CreateList.jsx';

// ReactModal.setAppElement('#app');

const Modal = ({isOpen, handleCloseModal, lists, handleHeartToggle, data, handleAdd}) => {

  return (
    <ReactModal 
      isOpen={isOpen}
      contentLabel="onRequestClose Example"
      onRequestClose={handleCloseModal}
      className={`${styles.Modal}`}
      overlayClassName={styles.Overlay}
    >
    <div className={styles.topModal}>
      <button onClick={handleCloseModal}>
        <svg className={styles.xSVG}>
        <path className={styles.xPath} d='m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22' />
          </svg>
      </button>

      <h1 className={styles.modalHeader}>Save to list</h1>
      <div>
        <CreateList handleAdd={handleAdd}/>
      </div>
      <div>
      <table className={styles.table}>
        <tbody>
          {
            Object.keys(lists).map((key, index) => {
              return <List key={index} isHeart={lists[key]} name={key} handleHeartToggle={handleHeartToggle} />
            })
          }
           
        </tbody>
      </table>
      </div>
      </div>

      <MiniListing data={data}/>
    </ReactModal>
  )

  
}



export default Modal;