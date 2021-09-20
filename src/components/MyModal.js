import React, { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import useLocalStorage from '../Hooks/useLocalStorage'
import '../App.css';



export function MyModal({connectWallet,selectedAddress}) {
    
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(false);

  const [selectedAddress1, setselectedAddress] = useLocalStorage('useraddress123', 0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  


  useEffect( ()=>{
    if (selectedAddress1 !== 0) {
        
        connectWallet();
        console.log(selectedAddress1);
        setStatus(true);
     } 
      
  }, [] );



  return (

      
    <div>
        <button onClick={handleShow} className="Loginbutton">
            {status ? "---Connected---" : "Click to Connect"}
        </button>
        <Modal show={show} onHide={handleClose} animation={false} centered={true}>
            <Modal.Header closeButton>
            <Modal.Title>
            Click to Login 
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>Your almost there, button right below</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={() => {connectWallet();handleClose(); setStatus(true); console.log(selectedAddress); setselectedAddress(selectedAddress);}}>
            
                Login
            </Button> 
            </Modal.Footer>
        </Modal>
    </div>
  );    
}


export default MyModal;


