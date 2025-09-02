// src/components/DataTableResponsive.jsx
import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import MobileDataTable from './MobileDataTable';

const DataTableResponsive = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile ? <MobileDataTable {...props} /> : <DataTable {...props} />;
};

export default DataTableResponsive;
