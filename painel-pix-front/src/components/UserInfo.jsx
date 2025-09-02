import React from 'react';
import logo from '../assets/logoRymo.svg';

const UserInfo = () => {
  const logout = () => {
    console.log('Usuário deslogado');
  };

  return (
    <div
      className="d-flex align-items-center gap-3 bg-white rounded shadow-sm px-3 py-2"
      style={{ minHeight: '60px', maxWidth: '260px' }}
    >
      <img src={logo} alt="Logo da Rymo" style={{ height: '36px' }} />

      <div className="d-flex flex-column justify-content-center">
        <span className="fw-semibold text-dark small mb-1">Anderson Moreira</span>

        <button
          onClick={logout}
          className="btn btn-sm btn-logout px-2 py-1"
        >
          <i className="bi bi-box-arrow-right me-1"></i> Sair
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
