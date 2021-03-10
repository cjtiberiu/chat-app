import React from 'react';

import './Modal.css';

const Modal = (props) => {

    const findByKey = (name) => {
        return props.children.map(child => {
            
            if (child.key === name) {
                return child;
            }
        })
    }

    // close modal function
    const closeModal = e => {
        // stop the event bubble
        e.stopPropagation();

        // if target element contains .modal-close toggle modal
        if (e.target.classList.contains('modal-close')) {
            props.setShowModal(!props.showModal);
            if (props.setSearchTerm) {
                props.setSearchTerm('')
                props.setSuggestions([])
            }
        }
    }


    return (
        <div className='modal-mask modal-close' onClick={e => closeModal(e)}>
            <div className='modal-wrapper'>
                <div className='modal-container'>

                    <div className='modal-header'>
                        {findByKey('header')}
                    </div>

                    <div className='modal-body'>
                        {findByKey('body')}
                    </div>

                    <div className='modal-footer'>
                        {findByKey('footer')}
                        <button className='modal-close' onClick={(e) => closeModal(e)}>Close</button>
                         
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Modal;