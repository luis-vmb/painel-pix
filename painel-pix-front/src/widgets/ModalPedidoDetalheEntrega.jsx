// src/widgets/ModalPedidoDetalheEntrega.jsx
import React from 'react';


// Dica: quando você for ligar na API, basta trocar o mock de detalhado por um fetch real 
// usando o registro.id ou registro.numero e preencher pedidoEntregaDetalhe com a resposta.

const ModalPedidoDetalheEntrega = ({ pedido }) => {
    // `pedido` esperado:
    // {
    //   numero: '1001', romaneio: 'R-7788', cliente: 'João Silva',
    //   rca: 'RCA-09', emitente: 'Matriz', totalItens: 3,
    //   itens: [{ codigo:'P001', descricao:'Produto A', filial:'01', qt:2 }, ...]
    // }

    const itens = pedido?.itens || [];

    return (
        <div
            className="modal fade"
            id="modalPedidoDetalheEntrega"
            tabIndex="-1"
            aria-labelledby="modalPedidoDetalheEntregaLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content shadow">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalPedidoDetalheEntregaLabel">
                            Detalhes do Pedido — Entrega
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" />
                    </div>

                    <div className="modal-body">
                        {/* Cabeçalho do pedido */}
                        <div className="row g-2 mb-3 small">
                            <div className="col-12 col-md-4">
                                <strong>Nº Pedido:</strong> {pedido?.numero || '-'}
                            </div>
                            <div className="col-12 col-md-4">
                                <strong>Romaneio:</strong> {pedido?.romaneio || '-'}
                            </div>
                            <div className="col-12 col-md-4">
                                <strong>Cliente:</strong> {pedido?.cliente || '-'}
                            </div>
                            <div className="col-12 col-md-4">
                                <strong>RCA:</strong> {pedido?.rca || '-'}
                            </div>
                            <div className="col-12 col-md-4">
                                <strong>Emitente:</strong> {pedido?.emitente || '-'}
                            </div>
                            <div className="col-12 col-md-4">
                                <strong>Total de itens:</strong> {pedido?.totalItens ?? (itens?.length || 0)}
                            </div>
                        </div>

                        {/* Itens */}
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

export default ModalPedidoDetalheEntrega;
