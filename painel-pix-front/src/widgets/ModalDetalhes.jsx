// src/widgets/ModalMeusPedidos.jsx - MODAL DE DETALHES DO PAGAMENTO ATIVO SOMENTE NA VERSAO MOBILE
import React, { useEffect, useState } from 'react';

const ModalDetalhes = ({
  dados,
  pedidos = [],            // ← opções para o select
  onClose = () => {},
  onConfirm = () => {}      // ← retorna { dados, pedido, modo }
}) => {
  const [modo, setModo] = useState('select'); // 'select' | 'input'
  const [pedidoSelect, setPedidoSelect] = useState('');
  const [pedidoInput, setPedidoInput] = useState('');

  // sempre que abrir com novos dados, reseta campos
  useEffect(() => {
    setModo('select');
    setPedidoSelect('');
    setPedidoInput('');
  }, [dados]);

  const pedidoEscolhido = modo === 'input' ? (pedidoInput || '').trim() : (pedidoSelect || '').trim();
  const confirmar = () => {
    if (!pedidoEscolhido) return;
    onConfirm({ dados, pedido: pedidoEscolhido, modo });
  };

  return (
    <div
      className="modal fade"
      id="modalDetalhes"
      tabIndex="-1"
      aria-labelledby="modalDetalhesLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalDetalhesLabel">Detalhes do Pagamento</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fechar"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {dados ? (
              <>
                <p className="mb-1"><strong>CPF/CNPJ:</strong> {dados.cpfCnpj}</p>
                <p className="mb-1"><strong>Nome:</strong> {dados.nome}</p>
                <p className="mb-1"><strong>Data de Envio:</strong> {dados.data}</p>
                <p className="mb-3"><strong>Valor:</strong> {dados.valor}</p>

                {/* Seletor do pedido: select ↔ input */}
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <label className="form-label mb-0"><strong>Número do pedido</strong></label>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    onClick={() => setModo(modo === 'select' ? 'input' : 'select')}
                    title={modo === 'select' ? 'Digitar pedido' : 'Selecionar da lista'}
                  >
                    <i className={modo === 'select' ? 'bi bi-type' : 'bi bi-chevron-down'} />
                    {modo === 'select' ? 'Digitar' : 'Listar'}
                  </button>
                </div>

                {modo === 'select' ? (
                  <select
                    className="form-select"
                    value={pedidoSelect}
                    onChange={(e) => setPedidoSelect(e.target.value)}
                  >
                    <option value="">Selecione um pedido</option>
                    {pedidos.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Digite o nº do pedido"
                    value={pedidoInput}
                    onChange={(e) => setPedidoInput(e.target.value)}
                  />
                )}

                {!pedidoEscolhido && (
                  <small className="text-muted d-block mt-2">
                    Informe o número do pedido para confirmar.
                  </small>
                )}
              </>
            ) : (
              <small className="text-muted">Carregando…</small>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" data-bs-dismiss="modal" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary d-flex align-items-center gap-1"
              disabled={!pedidoEscolhido}
              onClick={confirmar}
            >
              <i className="bi bi-check2-circle" />
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhes;
