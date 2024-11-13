import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Modal = ({ handleModalClose, items, handleSelect, type }) => {


    const handleSelectItem = (item) => {
        handleSelect({
            type: type,
            value: item
        });
        handleModalClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-[350px] min-w-[150px] p-3 pb-3 relative">
                <div className="flex justify-end mb-1">
                    <HighlightOffIcon onClick={handleModalClose} className="cursor-pointer" />
                </div>
                <ul>
                    <div className="text-center">
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-[14px]"
                                onClick={() => handleSelectItem(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Modal;
