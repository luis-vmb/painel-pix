// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import DataTableResponsive from '../components/DataTableResponsive';
import ModalMultiplos from '../widgets/ModalMultiplos';
import ModalDetalhes from '../widgets/ModalDetalhes';
import ModalMeusPedidos from '../widgets/ModalMeusPedidos';
import ModalPedidosEntrega from '../widgets/ModalPedidosEntrega';
import ModalPedidosRetira from '../widgets/ModalPedidosRetira';
import ModalPedidoDetalheEntrega from '../widgets/ModalPedidoDetalheEntrega';
import ModalPedidoDetalheRetira from '../widgets/ModalPedidoDetalheRetira'; 

const pedidosMock = [
  { id: '1234', label: '#1234 - Pedido João Silva' },
  { id: '5678', label: '#5678 - Pedido Maria Souza' },
  { id: '9876', label: '#9876 - Pedido Carlos Lima' },
];

const Home = () => {
  const [multiploMode, setMultiploMode] = useState('none');

  // Múltiplos Pix
  const [pedidoSelecionado, setPedidoSelecionado] = useState('');
  const [idsSelecionados, setIdsSelecionados] = useState(new Set());

  // Múltiplos pedidos
  const [selectedPixId, setSelectedPixId] = useState(null);
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);

  // Modal de detalhes (mobile)
  const [dadosDetalhe, setDadosDetalhe] = useState(null);

  // Detalhes de pedidos
  const [pedidoEntregaDetalhe, setPedidoEntregaDetalhe] = useState(null);
  const [pedidoRetiraDetalhe, setPedidoRetiraDetalhe] = useState(null);

  useEffect(() => {
    const el = document.getElementById('modalDetalhes');
    if (!el) return;
    const onHidden = () => setDadosDetalhe(null);
    el.addEventListener('hidden.bs.modal', onHidden);
    return () => el.removeEventListener('hidden.bs.modal', onHidden);
  }, []);

  const fecharModalMultiplos = () => {
    const el = document.getElementById('modalMultiplos');
    if (el) (window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el)).hide();
  };

  const handleAtivarMultiploPix = () => {
    setMultiploMode('pix');
    fecharModalMultiplos();
  };

  const handleAtivarMultiploPedidos = () => {
    setMultiploMode('pedidos');
    fecharModalMultiplos();
  };

  const resetModes = () => {
    setMultiploMode('none');
    setPedidoSelecionado('');
    setIdsSelecionados(new Set());
    setSelectedPixId(null);
    setPedidosSelecionados([]);
  };

  // seleção comum
  const toggleSelecionado = (id) => {
    setIdsSelecionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selecionarTodos = (ids) => {
    setIdsSelecionados(prev => {
      const all = ids.every(id => prev.has(id));
      return all ? new Set() : new Set(ids);
    });
  };

  // confirmar
  const confirmarVinculo = () => {
    if (multiploMode === 'pix') {
      if (!pedidoSelecionado || idsSelecionados.size === 0) {
        alert('Selecione/Informe um pedido e ao menos um pagamento.');
        return;
      }
      console.log('[MODO PIX] Vincular PIX IDs:', Array.from(idsSelecionados), '→ Pedido:', pedidoSelecionado);
      resetModes();
    } else if (multiploMode === 'pedidos') {
      if (!selectedPixId || pedidosSelecionados.length === 0) {
        alert('Selecione um PIX e ao menos um pedido.');
        return;
      }
      console.log('[MODO PEDIDOS] Vincular PIX ID:', selectedPixId, '→ Pedidos:', pedidosSelecionados);
      resetModes();
    }
  };

  // mobile continuar
  const handleContinuar = (item) => {
    setDadosDetalhe(item);
    const el = document.getElementById('modalDetalhes');
    if (el) (new window.bootstrap.Modal(el)).show();
  };
  const handleCloseDetalhes = () => {
    const el = document.getElementById('modalDetalhes');
    if (el) (window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el)).hide();
  };
  const handleConfirmDetalhes = ({ dados, pedido, modo }) => {
    console.log('Confirmado no ModalDetalhes =>', { dados, pedido, modo });
    handleCloseDetalhes();
  };

  // ---- MOCKS para os modais de pedidos
  const pedidosEntregaMock = [
    { id: 1, emissao: '10/08/2025', numero: '1001', cliente: 'João Silva', posicao: 'L' },
    { id: 2, emissao: '09/08/2025', numero: '1002', cliente: 'Maria Souza', posicao: 'B' },
    { id: 3, emissao: '08/08/2025', numero: '1003', cliente: 'Carlos Lima', posicao: 'F' },
  ];

  const pedidosRetiraMock = [
    { id: 4, emissao: '10/08/2025', numero: '2001', cliente: 'Ana Pereira', posicao: 'C' },
    { id: 5, emissao: '09/08/2025', numero: '2002', cliente: 'Pedro Rocha', posicao: 'B' },
    { id: 6, emissao: '08/08/2025', numero: '2003', cliente: 'Fernanda Costa', posicao: 'L' },
  ];

  // abrir modal de detalhe (Entrega)
  const abrirDetalheEntrega = (registro) => {
    const detalhado = {
      numero: registro.numero,
      romaneio: 'R-7788',
      cliente: registro.cliente,
      rca: 'RCA-09',
      emitente: 'Matriz',
      totalItens: 3,
      itens: [
        { codigo: 'P001', descricao: 'Produto A super', filial: '01', qt: 2 },
        { codigo: 'P002', descricao: 'Produto B plus', filial: '01', qt: 1 },
        { codigo: 'P010', descricao: 'Produto C kit', filial: '02', qt: 5 },
      ],
    };
    setPedidoEntregaDetalhe(detalhado);
    const el = document.getElementById('modalPedidoDetalheEntrega');
    if (el) (new window.bootstrap.Modal(el)).show();
  };

  // abrir modal de detalhe (Retira)
  const abrirDetalheRetira = (registro) => {
    const detalhado = {
      numero: registro.numero,
      cliente: registro.cliente,
      rca: 'RCA-05',
      emitente: 'Filial 02',
      totalItens: 4,
      itens: [
        { codigo: 'R001', descricao: 'Produto X', filial: '02', qt: 2 },
        { codigo: 'R002', descricao: 'Produto Y', filial: '02', qt: 1 },
        { codigo: 'R005', descricao: 'Produto Z', filial: '02', qt: 1 },
        { codigo: 'R010', descricao: 'Produto W', filial: '03', qt: 5 },
      ],
    };
    setPedidoRetiraDetalhe(detalhado);
    const el = document.getElementById('modalPedidoDetalheRetira');
    if (el) (new window.bootstrap.Modal(el)).show();
  };

  return (
    <>
      <main className="container py-4">
        <DataTableResponsive
          multiploMode={multiploMode}
          onSairMultiplo={resetModes}
          pedidoSelecionado={pedidoSelecionado}
          setPedidoSelecionado={setPedidoSelecionado}
          idsSelecionados={idsSelecionados}
          toggleSelecionado={toggleSelecionado}
          selecionarTodos={selecionarTodos}
          pedidosSelecionados={pedidosSelecionados}
          setPedidosSelecionados={setPedidosSelecionados}
          selectedPixId={selectedPixId}
          setSelectedPixId={setSelectedPixId}
          confirmarVinculo={confirmarVinculo}
          onContinuar={handleContinuar}
        />
      </main>

      {/* Múltiplos Pagamentos */}
      <ModalMultiplos
        onClickMultiploPix={handleAtivarMultiploPix}
        onClickMultiploPedidos={handleAtivarMultiploPedidos}
      />

      {/* Modal mobile antigo (detalhes do pagamento) */}
      <ModalDetalhes
        dados={dadosDetalhe}
        pedidos={pedidosMock}
        onClose={handleCloseDetalhes}
        onConfirm={handleConfirmDetalhes}
      />

      {/* Meus pedidos (escolha) */}
      <ModalMeusPedidos />

      {/* Listas de pedidos */}
      <ModalPedidosEntrega
        pedidos={pedidosEntregaMock}
        onDetalhes={abrirDetalheEntrega}
      />

      <ModalPedidosRetira
        pedidos={pedidosRetiraMock}
        onDetalhes={abrirDetalheRetira} // ✅ usar o handler correto
      />

      {/* Detalhes */}
      <ModalPedidoDetalheEntrega pedido={pedidoEntregaDetalhe} />
      <ModalPedidoDetalheRetira pedido={pedidoRetiraDetalhe} />
    </>
  );
};

export default Home;
