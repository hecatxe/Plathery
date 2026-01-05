import React from "react";

const ModalMessage = ({
  show,
  type = "info",
  title,
  message,
  onClose,
  removeBook,
  bookToDelete,
}) => {
  const typeConfig = {
    success: { icon: "bi-check-circle-fill", color: "text-success" },
    error: { icon: "bi-x-circle-fill", color: "text-danger" },
    warning: { icon: "bi-exclamation-triangle-fill", color: "text-warning" },
    info: { icon: "bi-info-circle-fill", color: "text-primary" },
  };

  const { icon, color } = typeConfig[type];

  return (
    <>
      {/* MODAL */}
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <i className={`bi ${icon} ${color} fs-4`}></i>
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
              {type === "warning" && bookToDelete ? (
                <>
                  <button className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      removeBook(bookToDelete);
                      onClose();
                    }}
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={onClose}>
                  Aceptar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP (fondo oscuro) */}
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default ModalMessage;
