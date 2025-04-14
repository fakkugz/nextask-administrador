import { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TasksContext } from '../contexts/TasksContext';

const PopOver = ( {popOver, setPopOver, message} ) => {

const { theme } = useContext(TasksContext);

    return (
        <>
            <Modal
                show={popOver}
                onHide={() => setPopOver(false)}
                dialogClassName="modal-90w"
                aria-labelledby="popover-title"
                data-bs-theme={theme}
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>{message}</Modal.Body>
            </Modal>
        </>
    );
}

export default PopOver;