// src/components/DataTable.jsx
import React from 'react';

// mocks
const rows = [
  { id: 1, data: '01/08/2025', valor: 'R$ 150,00', cpfCnpj: '12345678901', nome: 'João Silva' },
  { id: 2, data: '02/08/2025', valor: 'R$ 320,00', cpfCnpj: '98765432100', nome: 'Maria Souza' },
];

const pedidosMock = [
  { id: '1234', label: '#1234 - Pedido João Silva' },
  { id: '5678', label: '#5678 - Pedido Maria Souza' },
  { id: '9876', label: '#9876 - Pedido Carlos Lima' },
];

const DataTable = ({
  // modos
  multiploMode,                 // 'none' | 'pix' | 'pedidos'
  onSairMultiplo,

  // Múltiplos Pix (vários PIX -> 1 pedido)
  pedidoSelecionado,
  setPedidoSelecionado,
  idsSelecionados,
  toggleSelecionado,
  selecionarTodos,

  // Múltiplos Pedidos (1 PIX -> vários pedidos)
  pedidosSelecionados,
  setPedidosSelecionados,
  selectedPixId,
  setSelectedPixId,

  // ação comum
  confirmarVinculo
}) => {
  // ----- Modo normal (por linha)
  const [pedidoModo, setPedidoModo] = React.useState({});
  const [pedidoSelecionadoPorLinha, setPedidoSelecionadoPorLinha] = React.useState({});
  const [pedidoDigitado, setPedidoDigitado] = React.useState({});

  const alternarModoPedido = (rowId) => {
    setPedidoModo(prev => ({ ...prev, [rowId]: prev[rowId] === 'input' ? 'select' : 'input' }));
  };

  const confirmarLinha = (rowId) => {
    const modo = pedidoModo[rowId] === 'input' ? 'input' : 'select';
    const valor = modo === 'input'
      ? (pedidoDigitado[rowId] || '').trim()
      : (pedidoSelecionadoPorLinha[rowId] || '');
    if (!valor) return alert('Informe o número do pedido (digitando ou selecionando) antes de confirmar.');
    console.log(`Confirmar linha ${rowId} =>`, { modo, pedido: valor });
    // TODO: chamada de API por linha
  };

  // ----- Barra topo: MODO PIX (toggle lista ↔ input à esquerda, sem colar)
  // LOCAL (não sincronize a cada tecla)
  const [pedidoModoTopo, setPedidoModoTopo] = React.useState('select'); // 'select' | 'input'
  const [pedidoDigitadoTopo, setPedidoDigitadoTopo] = React.useState('');
  const pixInputRef = React.useRef(null);

  // NADA de useEffect sincronizando com o Home aqui

  // Valor efetivo: quando em input, usa o local; quando em select, usa o do Home
  const pedidoTopoAtual =
    pedidoModoTopo === 'input'
      ? (pedidoDigitadoTopo || '').trim()
      : (pedidoSelecionado || '');

  // Confirmar: se for input, copia p/ Home e confirma
  const handleConfirmarPix = () => {
    if (!pedidoTopoAtual || (idsSelecionados?.size || 0) === 0) return;
    if (pedidoModoTopo === 'input') {
      setPedidoSelecionado(pedidoTopoAtual);
    }
    confirmarVinculo();
  };

  // Manter foco mesmo após re-render
  const handleChangeInputPix = (e) => {
    const v = e.target.value;
    setPedidoDigitadoTopo(v);
    // Garante foco mesmo se o nó for recriado
    requestAnimationFrame(() => {
      if (pixInputRef.current) pixInputRef.current.focus();
    });
  };

  const ModoPixBar = () => {
    const allIds = rows.map(r => r.id);
    const allChecked = allIds.every(id => idsSelecionados?.has?.(id));
    const someChecked = !allChecked && allIds.some(id => idsSelecionados?.has?.(id));

    return (
      <div className="d-flex flex-column align-items-center mb-3">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2" style={{ maxWidth: 860 }}>
          {/* Toggle à esquerda */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={() => setPedidoModoTopo(prev => (prev === 'select' ? 'input' : 'select'))}
            title={pedidoModoTopo === 'select' ? 'Digitar nº do pedido' : 'Selecionar da lista'}
          >
            <i className={pedidoModoTopo === 'select' ? 'bi bi-type' : 'bi bi-chevron-down'} />
            {pedidoModoTopo === 'select' ? 'Digitar' : 'Listar'}
          </button>

          {/* Campo ao lado (sem colar) */}
          {pedidoModoTopo === 'select' ? (
            <select
              className="form-select form-select-sm"
              style={{ width: 280 }}
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
              style={{ width: 280 }}
              placeholder="Digite o nº do pedido"
              value={pedidoDigitadoTopo}
              onChange={handleChangeInputPix}              // só local + re-foco
              onBlur={() => setPedidoSelecionado((pedidoDigitadoTopo || '').trim())} // opcional
            />
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={handleConfirmarPix}
            disabled={!pedidoTopoAtual || (idsSelecionados?.size || 0) === 0}
            title={
              !pedidoTopoAtual || (idsSelecionados?.size || 0) === 0
                ? 'Selecione/Informe um pedido e ao menos um pagamento'
                : 'Confirmar vínculo'
            }
          >
            <i className="bi bi-check2-circle" />
            Confirmar
          </button>

          <button className="btn btn-danger btn-sm" onClick={onSairMultiplo}>Sair</button>
        </div>

        {(!pedidoTopoAtual || (idsSelecionados?.size || 0) === 0) && (
          <small className="text-muted mt-1">
            Selecione ou digite um pedido e marque os pagamentos na tabela para habilitar o confirmar.
          </small>
        )}

        {/* master checkbox opcional */}
        <div className="mt-2 d-none">
          <input
            type="checkbox"
            className="form-check-input"
            checked={allChecked}
            ref={el => el && (el.indeterminate = someChecked)}
            onChange={() => selecionarTodos(allIds)}
          />
        </div>
      </div>
    );
  };


  // ----- Barra topo: MODO PEDIDOS (dropdown acumulativo + input manual + chips)
  const ModoPedidosBar = () => {
    const normalizar = (s) => s.trim();
    const parseLista = (txt) =>
      txt.split(/[,\s]+/).map(normalizar).filter(Boolean);

    const addPedido = (pid) => {
      setPedidosSelecionados(prev => (prev.includes(pid) ? prev : [...prev, pid]));
    };
    const addPedidos = (pids = []) => {
      const arr = Array.isArray(pids) ? pids : [pids];
      setPedidosSelecionados(prev => {
        const set = new Set(prev);
        arr.forEach(id => set.add(id));
        return Array.from(set);
      });
    };
    const removePedido = (pid) => {
      setPedidosSelecionados(prev => prev.filter(x => x !== pid));
    };

    const [inputManual, setInputManual] = React.useState('');
    const handleAdicionarManual = () => {
      const lista = parseLista(inputManual);
      if (lista.length === 0) return;
      addPedidos(lista);
      setInputManual('');
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdicionarManual();
      }
    };

    const disponiveis = pedidosMock.filter(p => !pedidosSelecionados.includes(p.id));

    return (
      <div className="d-flex flex-column align-items-center mb-3">
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2" style={{ maxWidth: 860 }}>
          {/* Input manual + Adicionar */}
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: 260 }}
              placeholder="Digite pedidos (vírgula ou espaço)"
              value={inputManual}
              onChange={(e) => setInputManual(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
              onClick={handleAdicionarManual}
              disabled={inputManual.trim() === ''}
              title="Adicionar pedidos digitados"
            >
              <i className="bi bi-plus-circle" />
              Adicionar
            </button>
          </div>

          {/* Dropdown acumulativo */}
          <div className="dropdown">
            <button
              className="btn btn-outline-primary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Adicionar da lista
            </button>
            <ul className="dropdown-menu p-0 overflow-auto" style={{ maxHeight: 220, minWidth: 320 }}>
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

          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={confirmarVinculo}
            disabled={!selectedPixId || pedidosSelecionados.length === 0}
            title={!selectedPixId || pedidosSelecionados.length === 0
              ? 'Selecione um PIX na tabela e adicione ao menos um pedido'
              : 'Confirmar vínculo'}
          >
            <i className="bi bi-check2-circle" />
            Confirmar
          </button>

          <button className="btn btn-danger btn-sm" onClick={onSairMultiplo}>Sair</button>
        </div>

        {/* Chips dos pedidos selecionados */}
        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: 860 }}>
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

        {(!selectedPixId || pedidosSelecionados.length === 0) && (
          <small className="text-muted mt-2">
            Escolha o PIX abaixo (radio) e adicione pedidos pelo input ou dropdown para confirmar.
          </small>
        )}
      </div>
    );
  };

  // ----- seleção global
  const allIds = rows.map(r => r.id);
  const allChecked = allIds.every(id => idsSelecionados?.has?.(id));
  const someChecked = !allChecked && allIds.some(id => idsSelecionados?.has?.(id));

  return (
    <div className="bg-white rounded border p-3 table-container shadow-sm">
      {/* Barras superiores por modo */}
      {multiploMode === 'pix' && <ModoPixBar />}
      {multiploMode === 'pedidos' && <ModoPedidosBar />}

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              {multiploMode === 'pix' && (
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={allChecked}
                    ref={el => el && (el.indeterminate = someChecked)}
                    onChange={() => selecionarTodos(allIds)}
                  />
                </th>
              )}
              {multiploMode === 'pedidos' && <th style={{ width: 36 }}>PIX</th>}

              <th>Data de envio</th>
              <th>Valor</th>
              <th>CPF/CNPJ Pagador</th>
              <th>Nome Pagador</th>

              {multiploMode === 'none' && <th style={{ minWidth: 280 }}>Número do Pedido</th>}
              {multiploMode === 'none' && <th style={{ width: 120 }}>Ação</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                {multiploMode === 'pix' && (
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={idsSelecionados?.has?.(row.id)}
                      onChange={() => toggleSelecionado(row.id)}
                    />
                  </td>
                )}
                {multiploMode === 'pedidos' && (
                  <td>
                    <input
                      type="radio"
                      name="pix-unico"
                      className="form-check-input"
                      checked={selectedPixId === row.id}
                      onChange={() => setSelectedPixId(row.id)}
                    />
                  </td>
                )}

                <td>{row.data}</td>
                <td className="text-success">{row.valor}</td>
                <td>{row.cpfCnpj}</td>
                <td>{row.nome}</td>

                {multiploMode === 'none' && (
                  <>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                          onClick={() => alternarModoPedido(row.id)}
                          title={pedidoModo[row.id] === 'input' ? 'Usar lista' : 'Digitar pedido'}
                          style={{ width: 36, height: 32 }}
                        >
                          <i className={pedidoModo[row.id] === 'input' ? 'bi bi-chevron-down' : 'bi bi-type'} />
                        </button>

                        {pedidoModo[row.id] === 'input' ? (
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="Digite o nº do pedido"
                            value={pedidoDigitado[row.id] || ''}
                            onChange={(e) =>
                              setPedidoDigitado(prev => ({ ...prev, [row.id]: e.target.value }))
                            }
                          />
                        ) : (
                          <select
                            className="form-select form-select-sm"
                            value={pedidoSelecionadoPorLinha[row.id] || ''}
                            onChange={(e) =>
                              setPedidoSelecionadoPorLinha(prev => ({ ...prev, [row.id]: e.target.value }))
                            }
                          >
                            <option value="">Selecione um pedido</option>
                            {pedidosMock.map(p => (
                              <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => confirmarLinha(row.id)}
                      >
                        <i className="bi bi-check2-circle" />
                        Confirmar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
