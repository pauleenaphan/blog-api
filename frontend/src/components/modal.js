// Modal.js
import React from 'react';
import "../styles/modal.css";

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;