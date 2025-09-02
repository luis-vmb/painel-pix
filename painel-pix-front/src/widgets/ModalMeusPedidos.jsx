// src/widgets/ModalMeusPedidos.jsx BOTAO DE MEUS PEDIDOS
import React from 'react';

const ModalMeusPedidos = () => {
  return (
    <div
      className="modal fade"
      id="modalMeusPedidos"
      tabIndex="-1"
      aria-labelledby="modalMeusPedidosLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalMeusPedidosLabel">Meus pedidos</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
          </div>

          <div className="modal-body">
            <div className="d-grid gap-3">
              <button
                type="button"
                className="btn btn-rymo-multPag d-flex align-items-center justify-content-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#modalPedidosEntrega"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-truck" /> Entrega
              </button>

              <button
                type="button"
                className="btn btn-rymo-multPag d-flex align-items-center justify-content-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#modalPedidosRetira"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-shop" /> Retira
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMeusPedidos;

