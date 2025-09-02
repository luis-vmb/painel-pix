//Header
import React from 'react';
import UserInfo from './UserInfo';
import SearchForm from './SearchForm';


const Header = () => {
  return (
    <header className="shadow-sm py-3 px-2 px-md-4" style={{ minHeight: '80px' }}>
      <div className="container-fluid overflow-hidden">
        <div className="row align-items-center justify-content-between gx-3">
          <div className="col-auto">
            <UserInfo />
          </div>

          <div className="col flex-grow-1">
            <SearchForm />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

