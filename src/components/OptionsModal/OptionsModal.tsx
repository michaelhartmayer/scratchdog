import './OptionsModal.css';

interface OptionsModalProps {
  onClose: () => void;
}

export const OptionsModal = ({ onClose }: OptionsModalProps) => {
  return (
    <div className="modal-scrim" data-testid="options-modal">
      <div className="modal-container">
        <div className="modal-header">
          <span className="modal-title">Options</span>
          <button className="close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h3>Audio</h3>
            <label>
              <input type="checkbox" /> Mute
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Music
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Sound Effects
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Back</button>
          <button onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
};
