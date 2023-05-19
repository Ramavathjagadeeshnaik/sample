const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal"
            style={{
                display: 'block',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
            }}
        >
            <div className="modal-dialog">
                <div className="modal-content bg-dark">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
