// Modal inicial dos botes de multiplos pagamentos
import React, { useState } from 'react';

const ModalMultiplos = ({
  onClickMultiploPix = () => { },
  onClickMultiploPedidos = () => { },
}) => {
  const [infoPixAberto, setInfoPixAberto] = useState(false);
  const [infoPedidosAberto, setInfoPedidosAberto] = useState(false);

  return (
    <div
      className="modal fade"
      id="modalMultiplos"
      tabIndex="-1"
      aria-labelledby="modalMultiplosLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalMultiplosLabel">
              Múltiplos pagamentos
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fechar"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-grid gap-3">

              {/* ---- PIX ---- */}
              <div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-rymo-multPag flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    data-bs-dismiss="modal"
                    onClick={onClickMultiploPix}
                  >
                    <i className="bi bi-cash-coin"></i>
                    <span>Múltiplos Pix</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-link p-0 ms-1"
                    aria-label="Mais informações sobre Múltiplos Pix"
                    aria-expanded={infoPixAberto}
                    aria-controls="infoPix"
                    onClick={() => setInfoPixAberto(v => !v)}
                  >
                    <i className="bi bi-info-circle fs-5 text-secondary"></i>
                  </button>
                </div>

                {infoPixAberto && (
                  <div id="infoPix" className="mt-2 info-toggle">
                    <small className="d-block p-2 bg-light rounded text-muted">
                      Utilize várias transferências PIX em um único número de pedido.
                    </small>
                  </div>
                )}
              </div>

              {/* ---- PEDIDOS ---- */}
              <div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-rymo-multPag flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    data-bs-dismiss="modal"
                    onClick={onClickMultiploPedidos}
                  >
                    <i className="bi bi-list-check"></i>
                    <span>Múltiplos pedidos</span>
                  </button>


                  <button
                    type="button"
                    className="btn btn-link p-0 ms-1"
                    aria-label="Mais informações sobre Múltiplos pedidos"
                    aria-expanded={infoPedidosAberto}
                    aria-controls="infoPedidos"
                    onClick={() => setInfoPedidosAberto(v => !v)}
                  >
                    <i className="bi bi-info-circle fs-5 text-secondary"></i>
                  </button>
                </div>

                {infoPedidosAberto && (
                  <div id="infoPedidos" className="mt-2 info-toggle">
                    <small className="d-block p-2 bg-light rounded text-muted">
                      Use uma única transferência PIX para vários números de pedidos.
                    </small>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMultiplos;
