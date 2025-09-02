import React, { useState } from 'react';
import ActionButtons from './ActionButtons'; // 👈 importado aqui

const SearchForm = () => {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const atualizarLancamentos = (e) => {
    e.preventDefault();
    console.log('Atualizando com:', { cpfCnpj, dataInicio, dataFim });
  };

  return (
    <div className="d-flex flex-column align-items-center w-100 px-2">
      <form
        className="row gy-2 gx-2 align-items-end justify-content-center text-center"
        style={{ maxWidth: '900px', width: '100%' }}
        onSubmit={atualizarLancamentos}
      >
        <div className="col-12 col-sm-6 col-md-4">
          <label className="form-label mb-1">CPF/CNPJ</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Digite o CPF ou CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
          />
        </div>

        <div className="col-sm-2 col-6">
          <label className="form-label mb-1">Início</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="col-sm-2 col-6">
          <label className="form-label mb-1">Fim</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-2 d-grid">
          <button
            type="submit"
            className="btn btn-rymo d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-search"></i>
            <span>Pesquisar</span>
          </button>
        </div>

      </form>

      {/* ✅ Botões centralizados abaixo */}
      <div className="mt-3">
        <ActionButtons />
      </div>
    </div>
  );
};

export default SearchForm;
