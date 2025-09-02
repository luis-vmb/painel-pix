import React from 'react';

const ModalPedidosEntrega = ({ pedidos = [], onDetalhes }) => {
  return (
    <div className="modal fade" id="modalPedidosEntrega" tabIndex="-1" aria-labelledby="modalPedidosEntregaLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalPedidosEntregaLabel">Pedidos — Entrega</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
          </div>

          <div className="modal-body">
            {/* MOBILE: cards simples */}
            <div className="d-md-none">
              {pedidos.length === 0 ? (
                <div className="text-center text-muted">Nenhum pedido encontrado</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {pedidos.map(item => (
                    <div key={item.id} className="border rounded bg-white p-3 shadow-sm">
                      <div className="fw-semibold">#{item.numero}</div>
                      <div className="small text-muted">{item.cliente}</div>
                      <div className="mt-2 d-grid">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                          onClick={() => onDetalhes?.(item)}
                        >
                          <i className="bi bi-info-circle" />
                          Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP/TABLET: tabela completa */}
            <div className="d-none d-md-block">
              <div className="table-responsive" style={{ maxHeight: '60vh' }}>
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Emissão</th>
                      <th>Nº Pedido</th>
                      <th>Cliente</th>
                      <th>Posição</th>
                      <th style={{ width: 120 }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">Nenhum pedido encontrado</td>
                      </tr>
                    ) : pedidos.map(item => (
                      <tr key={item.id}>
                        <td>{item.emissao}</td>
                        <td>{item.numero}</td>
                        <td>{item.cliente}</td>
                        <td>{item.posicao}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                            onClick={() => onDetalhes?.(item)}
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger btn-sm" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPedidosEntrega;
