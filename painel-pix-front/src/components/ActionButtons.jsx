// src/components/ActionButtons.jsx
import React from 'react';

const ActionButtons = () => {
  return (
    <div className="d-flex gap-3 mb-md-0 mb-3">
      <button
        type="button"
        className="btn btn-rymo-outline"
        data-bs-toggle="modal"
        data-bs-target="#modalMultiplos"
      >
        Múltiplos pagamentos
      </button>

      <button
        type="button"
        className="btn btn-rymo-outline"
        data-bs-toggle="modal"
        data-bs-target="#modalMeusPedidos"
      >
        Meus pedidos
      </button>

      <div id="notification-container" className="ms-2"></div>
    </div>
  );
};

export default ActionButtons;
