// src/widgets/ModalPedidoDetalheRetira.jsx
import React from 'react';

const ModalPedidoDetalheRetira = ({ pedido }) => {
  const itens = pedido?.itens || [];

  return (
    <div
      className="modal fade"
      id="modalPedidoDetalheRetira"
      tabIndex="-1"
      aria-labelledby="modalPedidoDetalheRetiraLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalPedidoDetalheRetiraLabel">
              Detalhes do Pedido — Retira
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
          </div>

          <div className="modal-body">
            {/* Cabeçalho do pedido (mesmo layout do Entrega) */}
            <div className="row g-2 mb-3 small">
              <div className="col-12 col-md-3">
                <strong>Nº Pedido:</strong> {pedido?.numero || '-'}
              </div>
              <div className="col-12 col-md-3">
                <strong>Cliente:</strong> {pedido?.cliente || '-'}
              </div>
              <div className="col-12 col-md-3">
                <strong>RCA:</strong> {pedido?.rca || '-'}
              </div>
              <div className="col-12 col-md-3">
                <strong>Emitente:</strong> {pedido?.emitente || '-'}
              </div>
              <div className="col-12 col-md-3">
                <strong>Total de itens:</strong> {pedido?.totalItens ?? (itens?.length || 0)}
              </div>
            </div>

            {/* Itens (tabela idêntica à do Entrega) */}
            <div className="table-responsive" style={{ maxHeight: '55vh' }}>
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th>Filial</th>
                    <th>Qt</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        Nenhum item para este pedido
                      </td>
                    </tr>
                  ) : (
                    itens.map((it, idx) => (
                      <tr key={`${it.codigo}-${idx}`}>
                        <td>{it.codigo}</td>
                        <td>{it.descricao}</td>
                        <td>{it.filial}</td>
                        <td>{it.qt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger btn-sm" data-bs-dismiss="modal">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPedidoDetalheRetira;
