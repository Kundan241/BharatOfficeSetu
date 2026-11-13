import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Building2, 
  FileCheck2, 
  FileText, 
  IndianRupee, 
  Filter, 
  X,
  UserCheck,
  Layers,
  ListFilter
} from 'lucide-react';
import { 
  INDIA_FILINGS_DEDUPED_DATA, 
  INDIA_FILINGS_RAW_DATA 
} from '../data/indiaFilingsSalesData';

const AdminSalesLedger = ({ isAdmin = true }) => {
  // 'deduped' (114 unique client cases) or 'raw' (187 line items)
  const [viewMode, setViewMode] = useState('deduped');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('id'); // default by #
  const [sortOrder, setSortOrder] = useState('asc'); // asc 1..N

  // Select dataset based on view mode
  const activeDataset = useMemo(() => {
    return viewMode === 'deduped' ? INDIA_FILINGS_DEDUPED_DATA : INDIA_FILINGS_RAW_DATA;
  }, [viewMode]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Distinct service types & locations for filter dropdowns
  const serviceOptions = useMemo(() => {
    const set = new Set();
    activeDataset.forEach(item => {
      if (item.serviceType) set.add(item.serviceType);
    });
    return Array.from(set).sort();
  }, [activeDataset]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    activeDataset.forEach(item => {
      if (item.location) set.add(item.location);
    });
    return Array.from(set).sort();
  }, [activeDataset]);

  // Overall dataset summary statistics
  const stats = useMemo(() => {
    const totalCount = activeDataset.length;
    const totalAmount = activeDataset.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const voCount = activeDataset.filter(item => (item.serviceType || '').includes('Virtual Office')).length;
    const gstCount = activeDataset.filter(item => (item.serviceType || '').includes('GST')).length;
    return { totalCount, totalAmount, voCount, gstCount };
  }, [activeDataset]);

  // Filtering & Sorting
  const filteredData = useMemo(() => {
    let result = [...activeDataset];

    if (serviceFilter !== 'ALL') {
      result = result.filter(item => item.serviceType === serviceFilter);
    }

    if (locationFilter !== 'ALL') {
      result = result.filter(item => item.location === locationFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(item => {
        const idStr = String(item.id || '');
        const name = (item.salesName || '').toLowerCase();
        const comp = (item.company || '').toLowerCase();
        const serv = (item.serviceType || '').toLowerCase();
        const loc = (item.location || '').toLowerCase();
        const rm = (item.relationshipManager || '').toLowerCase();
        const am = (item.accountManager || '').toLowerCase();
        const gstin = (item.gstin || '').toLowerCase();

        return idStr.includes(q) ||
          name.includes(q) ||
          comp.includes(q) ||
          serv.includes(q) ||
          loc.includes(q) ||
          rm.includes(q) ||
          am.includes(q) ||
          gstin.includes(q);
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'id' || sortField === 'amount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [activeDataset, searchTerm, serviceFilter, locationFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = filteredData.length;
  const effectivePageSize = pageSize === 'ALL' ? totalItems : Number(pageSize);
  const totalPages = effectivePageSize > 0 ? Math.ceil(totalItems / effectivePageSize) : 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  const paginatedData = useMemo(() => {
    if (pageSize === 'ALL') return filteredData;
    const startIndex = (safeCurrentPage - 1) * effectivePageSize;
    return filteredData.slice(startIndex, startIndex + effectivePageSize);
  }, [filteredData, safeCurrentPage, effectivePageSize, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setServiceFilter('ALL');
    setLocationFilter('ALL');
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = ['Sr No', 'Sales Name', 'Company/Entity', 'Service Type', 'Location', 'Relationship Manager', 'Account Manager', 'GSTIN', 'Amount (INR)'];
    const rows = filteredData.map(item => [
      item.id,
      `"${(item.salesName || '').replace(/"/g, '""')}"`,
      `"${(item.company || '').replace(/"/g, '""')}"`,
      `"${(item.serviceType || '').replace(/"/g, '""')}"`,
      `"${(item.location || '').replace(/"/g, '""')}"`,
      `"${(item.relationshipManager || '').replace(/"/g, '""')}"`,
      `"${(item.accountManager || '').replace(/"/g, '""')}"`,
      `"${(item.gstin || '').replace(/"/g, '""')}"`,
      item.amount || 0
    ]);

    const filename = viewMode === 'deduped'
      ? `India_Filings_Unique_Cases_${filteredData.length}.csv`
      : `India_Filings_All_Line_Items_${filteredData.length}.csv`;

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderServiceBadges = (row) => {
    // If we have servicesList (deduplicated combo)
    if (row.servicesList && row.servicesList.length > 1) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <div className="flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
              Combo ({row.servicesList.length})
            </span>
            {row.servicesList.map((srv, idx) => {
              if (srv.includes('PPOB')) {
                return (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    GST PPOB
                  </span>
                );
              }
              if (srv.includes('APOB')) {
                return (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
                    GST APOB
                  </span>
                );
              }
              if (srv.includes('Renewal')) {
                return (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                    VO Renewal
                  </span>
                );
              }
              if (srv.includes('Virtual Office')) {
                return (
                  <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                    Virtual Office
                  </span>
                );
              }
              return (
                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  {srv}
                </span>
              );
            })}
          </div>
          <span className="text-xs text-gray-600 font-medium">{row.serviceType}</span>
        </div>
      );
    }

    // Single service badge
    const service = row.serviceType || '';
    let badge = null;
    if (service.includes('Renewal')) {
      badge = (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          VO Renewal
        </span>
      );
    } else if (service.includes('Virtual Office')) {
      badge = (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
          Virtual Office
        </span>
      );
    } else if (service.includes('PPOB')) {
      badge = (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          GST (PPOB)
        </span>
      );
    } else if (service.includes('APOB')) {
      badge = (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
          GST (APOB)
        </span>
      );
    } else {
      badge = (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
          {service}
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        {badge}
        <span className="text-xs text-gray-700 font-medium">{service}</span>
      </div>
    );
  };

  const getGstinBadge = (gstin) => {
    if (!gstin || gstin === 'N/A') {
      return <span className="text-xs text-gray-400 font-mono">N/A</span>;
    }
    if (gstin === 'Add GSTIN') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          Add GSTIN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {gstin}
      </span>
    );
  };

  // Access Control (Admin Only)
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">403 Unauthorized</h2>
        <p className="text-gray-600 text-center max-w-md">
          Access Denied. You do not have the necessary permissions to view the Sales Ledger. This area is restricted to administrators only.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Title & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900">India Filings Sales Ledger</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {viewMode === 'deduped' ? `${INDIA_FILINGS_DEDUPED_DATA.length} Unique Cases` : `${INDIA_FILINGS_RAW_DATA.length} Line Items`}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === 'deduped' 
              ? 'Deduplicated registry — each client deal listed once with combined services and proper sequential numbering.'
              : 'Complete raw registry — individual service order line items as listed in LEDGERS PRO Marketplace.'}
          </p>
        </div>

        {/* View Mode Toggle & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              onClick={() => {
                setViewMode('deduped');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'deduped'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListFilter size={14} />
              <span>Deduplicated Cases ({INDIA_FILINGS_DEDUPED_DATA.length})</span>
            </button>
            <button
              onClick={() => {
                setViewMode('raw');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'raw'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers size={14} />
              <span>All Line Items ({INDIA_FILINGS_RAW_DATA.length})</span>
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Export CSV ({totalItems})
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {viewMode === 'deduped' ? 'Unique Client Cases' : 'Total Service Rows'}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">Numbered #1 to #{stats.totalCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">
              {viewMode === 'deduped' ? 'Accurate Order Revenue' : 'Raw Sum of Line Items'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Virtual Office</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{stats.voCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {viewMode === 'deduped' ? 'Unique VO clients' : 'New & Renewal items'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck2 size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">GST Registrations</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{stats.gstCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {viewMode === 'deduped' ? 'Clients with GST' : 'PPOB & APOB filings'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition"
                placeholder="Search case #, client, company, RM, GSTIN..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter size={14} />
                <span>Filters:</span>
              </div>

              {/* Service filter */}
              <select
                className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[220px]"
                value={serviceFilter}
                onChange={(e) => {
                  setServiceFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Services ({activeDataset.length})</option>
                {serviceOptions.map(srv => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>

              {/* Location filter */}
              <select
                className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Locations</option>
                {locationOptions.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {(searchTerm || serviceFilter !== 'ALL' || locationFilter !== 'ALL') && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition font-medium"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table with Prominent Row Numbering */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                {/* Sr. No. / Case Number Column */}
                <th 
                  scope="col" 
                  onClick={() => handleSort('id')}
                  className="px-4 py-3.5 text-center w-16 cursor-pointer hover:bg-gray-100 transition select-none"
                  title="Click to sort by Case Number"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>#</span>
                    {sortField === 'id' ? (
                      sortOrder === 'asc' ? <ArrowUp size={12} className="text-emerald-600" /> : <ArrowDown size={12} className="text-emerald-600" />
                    ) : (
                      <ArrowUpDown size={12} className="text-gray-400" />
                    )}
                  </div>
                </th>

                <th 
                  scope="col" 
                  onClick={() => handleSort('salesName')}
                  className="px-5 py-3.5 text-left cursor-pointer hover:bg-gray-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Client / Company</span>
                    {sortField === 'salesName' && (
                      sortOrder === 'asc' ? <ArrowUp size={12} className="text-emerald-600" /> : <ArrowDown size={12} className="text-emerald-600" />
                    )}
                  </div>
                </th>

                <th 
                  scope="col" 
                  onClick={() => handleSort('serviceType')}
                  className="px-4 py-3.5 text-left cursor-pointer hover:bg-gray-100 transition select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Service Details</span>
                    {sortField === 'serviceType' && (
                      sortOrder === 'asc' ? <ArrowUp size={12} className="text-emerald-600" /> : <ArrowDown size={12} className="text-emerald-600" />
                    )}
                  </div>
                </th>

                <th scope="col" className="px-4 py-3.5 text-left">
                  Location
                </th>

                <th scope="col" className="px-4 py-3.5 text-left">
                  Managers (RM / AM)
                </th>

                <th scope="col" className="px-4 py-3.5 text-left">
                  GSTIN
                </th>

                <th 
                  scope="col" 
                  onClick={() => handleSort('amount')}
                  className="px-5 py-3.5 text-right cursor-pointer hover:bg-gray-100 transition select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    {sortField === 'amount' && (
                      sortOrder === 'asc' ? <ArrowUp size={12} className="text-emerald-600" /> : <ArrowDown size={12} className="text-emerald-600" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-emerald-50/40 transition-colors duration-150"
                  >
                    {/* Row Sequential Numbering (#1 to #114) */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded bg-gray-100 text-gray-700 font-mono text-xs font-semibold">
                        {row.id}
                      </span>
                    </td>

                    {/* Client & Legal Company Name */}
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-900 leading-tight">
                        {row.salesName}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 font-mono">
                        <span className="text-[10px] text-gray-400 font-sans">GID:</span>
                        <span className="truncate max-w-[220px]" title={row.company}>
                          {row.company}
                        </span>
                      </div>
                    </td>

                    {/* Service Type with Color Badges */}
                    <td className="px-4 py-3">
                      {renderServiceBadges(row)}
                    </td>

                    {/* Location / State */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 font-medium">
                      {row.location}
                    </td>

                    {/* Relationship Manager & Account Manager */}
                    <td className="px-4 py-3 text-xs text-gray-700">
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        <UserCheck size={13} className="text-emerald-600 flex-shrink-0" />
                        <span>{row.relationshipManager}</span>
                      </div>
                      {row.accountManager && (
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                          {row.accountManager}
                        </div>
                      )}
                    </td>

                    {/* GSTIN / Add GSTIN status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getGstinBadge(row.gstin)}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3 whitespace-nowrap text-right font-semibold text-gray-900 font-mono">
                      {row.amount > 0 ? formatCurrency(row.amount) : (
                        <span className="text-gray-400 text-xs">Included</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-gray-300 mb-2" />
                      <p className="font-medium text-gray-700">No cases found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms or filters</p>
                      <button
                        onClick={clearFilters}
                        className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Ledger Stats Bar */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {totalItems === 0 ? 0 : (safeCurrentPage - 1) * effectivePageSize + 1}
              </span>
              {' '}-{' '}
              <span className="font-semibold text-gray-900">
                {pageSize === 'ALL' ? totalItems : Math.min(safeCurrentPage * effectivePageSize, totalItems)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-gray-900">{totalItems}</span>
              {' '}{viewMode === 'deduped' ? 'cases' : 'line items'}
            </div>

            <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
              <span>Rows per page:</span>
              <select
                className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={pageSize}
                onChange={(e) => {
                  const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                  setPageSize(val);
                  setCurrentPage(1);
                }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value="ALL">All ({activeDataset.length})</option>
              </select>
            </div>
          </div>

          {/* Page Controls */}
          {pageSize !== 'ALL' && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= safeCurrentPage - 1 && pageNum <= safeCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[28px] h-7 px-1.5 rounded border text-xs font-medium transition ${
                        pageNum === safeCurrentPage
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === safeCurrentPage - 2 ||
                  pageNum === safeCurrentPage + 2
                ) {
                  return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSalesLedger;
