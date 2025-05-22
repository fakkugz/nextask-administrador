import Modal from 'react-bootstrap/Modal';
import useTaskStore from "../store/useTaskStore";

const PopOver = ( {popOver, setPopOver, message} ) => {

const theme = useTaskStore((state) => state.theme);

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