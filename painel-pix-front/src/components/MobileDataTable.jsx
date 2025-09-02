// src/components/MobileDataTable.jsx
import React, { useRef, useState } from 'react';

// mocks (substitua pelos seus dados reais)
const rows = [
  { id: 1, data: '01/08/2025', valor: 'R$ 150,00', cpfCnpj: '12345678901', nome: 'João Silva' },
  { id: 2, data: '02/08/2025', valor: 'R$ 320,00', cpfCnpj: '98765432100', nome: 'Maria Souza' },
];

const pedidosMock = [
  { id: '1234', label: '#1234 - Pedido João Silva' },
  { id: '5678', label: '#5678 - Pedido Maria Souza' },
  { id: '9876', label: '#9876 - Pedido Carlos Lima' },
];

const MobileDataTable = ({
  // modo: 'none' | 'pix' | 'pedidos'
  multiploMode,

  // Múltiplos Pix (vários PIX -> 1 pedido)
  pedidoSelecionado,
  setPedidoSelecionado,
  idsSelecionados,           // Set<number>
  toggleSelecionado,
  

  // Múltiplos Pedidos (1 PIX -> vários pedidos)
  selectedPixId,
  setSelectedPixId,
  pedidosSelecionados,       // string[]
  setPedidosSelecionados,

  // ações comuns
  confirmarVinculo,
  onSairMultiplo,

  // fluxo "Continuar" (quando multiploMode === 'none')
  onContinuar,
}) => {
  const hasAnyChecked = (idsSelecionados?.size || 0) > 0;

  /* =========================
     BARRA SUPERIOR — PIX
     ========================= */
  const [pedidoModoTopo, setPedidoModoTopo] = useState('select'); // 'select' | 'input'
  const [pedidoDigitadoTopo, setPedidoDigitadoTopo] = useState('');
  const pixInputRef = useRef(null);

  const pedidoTopoAtual =
    pedidoModoTopo === 'input'
      ? (pedidoDigitadoTopo || '').trim()
      : (pedidoSelecionado || '');

  const handleConfirmarPix = () => {
    if (!pedidoTopoAtual || !hasAnyChecked) return;
    if (pedidoModoTopo === 'input') setPedidoSelecionado(pedidoTopoAtual);
    confirmarVinculo();
  };

  const handleChangeInputPix = (e) => {
    setPedidoDigitadoTopo(e.target.value);
    requestAnimationFrame(() => {
      if (pixInputRef.current) pixInputRef.current.focus();
    });
  };

  const PixBar = () => (
    <div className="sticky-top bg-white py-2" style={{ top: 0, zIndex: 1020 }}>
      <div className="d-flex flex-column gap-2 align-items-stretch">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => setPedidoModoTopo(prev => (prev === 'select' ? 'input' : 'select'))}
            title={pedidoModoTopo === 'select' ? 'Digitar pedido' : 'Selecionar da lista'}
          >
            <i className={pedidoModoTopo === 'select' ? 'bi bi-type' : 'bi bi-chevron-down'} />
            {pedidoModoTopo === 'select' ? 'Digitar' : 'Listar'}
          </button>

          {pedidoModoTopo === 'select' ? (
            <select
              className="form-select form-select-sm"
              value={pedidoSelecionado}
              onChange={(e) => setPedidoSelecionado(e.target.value)}
            >
              <option value="">Selecione um pedido</option>
              {pedidosMock.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          ) : (
            <input
              ref={pixInputRef}
              type="text"
              inputMode="numeric"
              className="form-control form-control-sm"
              placeholder="Digite o nº do pedido"
              value={pedidoDigitadoTopo}
              onChange={handleChangeInputPix}
              onBlur={() => setPedidoSelecionado(pedidoTopoAtual)}
            />
          )}
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            onClick={handleConfirmarPix}
            disabled={!pedidoTopoAtual || !hasAnyChecked}
            title={!pedidoTopoAtual || !hasAnyChecked
              ? 'Selecione/Digite um pedido e pelo menos um pagamento'
              : 'Confirmar vínculo'}
          >
            <i className="bi bi-check2-circle"></i>
            Confirmar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onSairMultiplo}
          >
            Sair
          </button>
        </div>

        {(!pedidoTopoAtual || !hasAnyChecked) && (
          <small className="text-muted">
            Marque os pagamentos abaixo e selecione/digite um pedido para habilitar o confirmar.
          </small>
        )}
      </div>
      <hr className="mt-2 mb-0" />
    </div>
  );

  /* =========================
     BARRA SUPERIOR — PEDIDOS
     (1 PIX -> vários pedidos)
     ========================= */
  const [inputManual, setInputManual] = useState('');

  const parseLista = (txt) =>
    (txt || '')
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(Boolean);

  const addPedidos = (pids) => {
    const arr = Array.isArray(pids) ? pids : [pids];
    setPedidosSelecionados(prev => {
      const set = new Set(prev);
      arr.forEach(id => set.add(id));
      return Array.from(set);
    });
  };

  const addPedido = (pid) => addPedidos([pid]);
  const removePedido = (pid) =>
    setPedidosSelecionados(prev => prev.filter(x => x !== pid));

  const handleAdicionarManual = () => {
    const lista = parseLista(inputManual);
    if (lista.length === 0) return;
    addPedidos(lista);
    setInputManual('');
  };

  const disponiveis = pedidosMock.filter(p => !pedidosSelecionados.includes(p.id));

  const PedidosBar = () => (
    <div className="sticky-top bg-white py-2" style={{ top: 0, zIndex: 1020 }}>
      <div className="d-flex flex-column gap-2 align-items-stretch">
        {/* Input manual + Adicionar */}
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Digite pedidos (vírgula ou espaço)"
            value={inputManual}
            onChange={(e) => setInputManual(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdicionarManual();
              }
            }}
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
            onClick={handleAdicionarManual}
            disabled={!inputManual.trim()}
          >
            <i className="bi bi-plus-circle" />
            Adicionar
          </button>
        </div>

        {/* Dropdown acumulativo */}
        <div className="dropdown">
          <button
            className="btn btn-outline-primary btn-sm dropdown-toggle w-100"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Adicionar da lista
          </button>
          <ul className="dropdown-menu w-100 p-0 overflow-auto" style={{ maxHeight: 240 }}>
            {disponiveis.length === 0 && (
              <li>
                <span className="dropdown-item text-muted small">Nenhum pedido disponível</span>
              </li>
            )}
            {disponiveis.map(p => (
              <li key={p.id}>
                <button
                  type="button"
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => addPedido(p.id)}
                >
                  <span>{p.label}</span>
                  <i className="bi bi-plus-circle" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chips dos pedidos selecionados */}
        <div className="d-flex flex-wrap gap-2">
          {pedidosSelecionados.length === 0 ? (
            <small className="text-muted">Adicione pedidos pelo input ou pela lista acima.</small>
          ) : (
            pedidosSelecionados.map(pid => {
              const info = pedidosMock.find(p => p.id === pid);
              return (
                <span key={pid} className="badge rounded-pill text-bg-light border d-flex align-items-center gap-2">
                  {info ? info.label : pid}
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0 d-flex align-items-center"
                    aria-label={`Remover ${pid}`}
                    onClick={() => removePedido(pid)}
                  >
                    <i className="bi bi-x-circle" />
                  </button>
                </span>
              );
            })
          )}
        </div>

        {/* Confirmar / Sair */}
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
            onClick={confirmarVinculo}
            disabled={!selectedPixId || pedidosSelecionados.length === 0}
            title={!selectedPixId || pedidosSelecionados.length === 0
              ? 'Escolha um PIX abaixo e adicione pedidos'
              : 'Confirmar vínculo'}
          >
            <i className="bi bi-check2-circle" />
            Confirmar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onSairMultiplo}
          >
            Sair
          </button>
        </div>
      </div>
      <hr className="mt-2 mb-0" />
    </div>
  );

  return (
    <div className="container px-2">

      {/* Barras superiores conforme o modo */}
      {multiploMode === 'pix' && <PixBar />}
      {multiploMode === 'pedidos' && <PedidosBar />}

      {/* Lista de pagamentos (cards) */}
      <div className="mt-3">
        {rows.map(item => (
          <div key={item.id} className="border rounded bg-white shadow-sm p-3 mb-2">

            {/* Seletor por item conforme o modo */}
            {multiploMode === 'pix' && (
              <div className="form-check mb-2">
                <input
                  id={`mob-chk-${item.id}`}
                  type="checkbox"
                  className="form-check-input"
                  checked={idsSelecionados?.has?.(item.id)}
                  onChange={() => toggleSelecionado(item.id)}
                />
                <label htmlFor={`mob-chk-${item.id}`} className="form-check-label">
                  Selecionar
                </label>
              </div>
            )}

            {multiploMode === 'pedidos' && (
              <div className="form-check mb-2">
                <input
                  id={`mob-radio-${item.id}`}
                  type="radio"
                  name="mob-pix-unico"
                  className="form-check-input"
                  checked={selectedPixId === item.id}
                  onChange={() => setSelectedPixId(item.id)}
                />
                <label htmlFor={`mob-radio-${item.id}`} className="form-check-label">
                  Usar este PIX
                </label>
              </div>
            )}

            {/* Infos essenciais */}
            <div className="d-flex justify-content-between">
              <div className="fw-semibold">{item.cpfCnpj}</div>
              <div className="text-success">{item.valor}</div>
            </div>
            <div className="small text-muted">{item.nome}</div>
            <div className="small">Data: {item.data}</div>

            {/* Botão "Continuar" somente quando NÃO está no modo múltiplos */}
            {multiploMode === 'none' && (
              <div className="mt-2 d-grid">
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                  onClick={() => onContinuar && onContinuar(item)}
                >
                  <i className="bi bi-arrow-right-circle" />
                  Continuar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default MobileDataTable;
