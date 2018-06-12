import React from 'react';
import ReactDOM from 'react-dom';
import styles from './style.css';


class CreateList extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      showCreateNewList: false,
      newListName: ''
    }
   
    this.handleAdd = this.props.handleAdd;
    this.handleCreateToggle = this.handleCreateToggle.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleCreateToggle () {
    let newVal = !this.state.showCreateNewList;
    this.setState({
      showCreateNewList: newVal
    })
  }

  handleInput(e) {
    this.setState({
      newListName: e.target.value
    })
  }

  render () {
    if (this.state.showCreateNewList) {
      return (
        <div className={styles.createBox}>
        <div className={styles.listName}>Name</div>
        <input onChange={this.handleInput} type='text' name='text' placeholder='Name your list' className={styles.listInput}></input>
        <div>
        <button onClick={()=> {this.props.handleAdd(this.state.newListName); this.handleCreateToggle();}} className={ (this.state.newListName.length > 0) ? styles.createButton : `${styles.createButton} ${styles.disabled}`}>Create</button>
        <button className={styles.cancelButton} onClick={this.handleCreateToggle}>Cancel</button>
        </div>
        </div>
      )
    } else {
      return (
        <a onClick={this.handleCreateToggle} className={styles.subHeader}>Create New List</a>
      )
    }

  }

} 

export default CreateList;