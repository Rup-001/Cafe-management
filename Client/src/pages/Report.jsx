import { useState, useEffect } from 'react';
import api from '../utils/api';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set current month as default
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    setSelectedMonth(currentMonth);
    fetchReport(currentMonth);
  }, []);

  const fetchReport = async (month) => {
    if (!month) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/sales/report?type=month&month=${month}`);
      setReportData(response.data);
    } catch (error) {
      setError('Failed to load sales report');
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchReport(month);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-chart-line me-2"></i>
                Sales Report
              </h2>
              <p className="text-muted">View monthly sales performance and analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card-cafe">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3" style={{ color: 'var(--cafe-primary)' }}>
                <i className="fas fa-calendar me-2"></i>
                Select Month
              </h5>
              <input
                type="month"
                className="form-control form-control-cafe"
                value={selectedMonth}
                onChange={handleMonthChange}
                max={new Date().toISOString().slice(0, 7)}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading report...</p>
        </div>
      ) : reportData ? (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card-cafe h-100">
                <div className="card-body text-center">
                  <i 
                    className="fas fa-dollar-sign mb-3" 
                    style={{ fontSize: '3rem', color: 'var(--cafe-success)' }}
                  ></i>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--cafe-success)' }}>
                    {formatCurrency(reportData.totalSales)}
                  </h5>
                  <p className="text-muted mb-0">Total Sales</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card-cafe h-100">
                <div className="card-body text-center">
                  <i 
                    className="fas fa-shopping-cart mb-3" 
                    style={{ fontSize: '3rem', color: 'var(--cafe-primary)' }}
                  ></i>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--cafe-primary)' }}>
                    {reportData.totalOrders || 0}
                  </h5>
                  <p className="text-muted mb-0">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card-cafe h-100">
                <div className="card-body text-center">
                  <i 
                    className="fas fa-chart-line mb-3" 
                    style={{ fontSize: '3rem', color: 'var(--cafe-secondary)' }}
                  ></i>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--cafe-secondary)' }}>
                    {reportData.totalOrders > 0 
                      ? formatCurrency(reportData.totalSales / reportData.totalOrders)
                      : formatCurrency(0)
                    }
                  </h5>
                  <p className="text-muted mb-0">Average Order</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card-cafe h-100">
                <div className="card-body text-center">
                  <i 
                    className="fas fa-calendar-alt mb-3" 
                    style={{ fontSize: '3rem', color: 'var(--cafe-info)' }}
                  ></i>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--cafe-info)' }}>
                    {formatDate(selectedMonth + '-01')}
                  </h5>
                  <p className="text-muted mb-0">Report Period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Report */}
          <div className="row">
            <div className="col-lg-8">
              <div className="card-cafe">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4" style={{ color: 'var(--cafe-primary)' }}>
                    <i className="fas fa-table me-2"></i>
                    Monthly Performance
                  </h5>
                  
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead style={{ backgroundColor: 'var(--cafe-primary)', color: 'white' }}>
                        <tr>
                          <th>Metric</th>
                          <th className="text-end">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Total Revenue</strong></td>
                          <td className="text-end fw-bold text-success">
                            {formatCurrency(reportData.totalSales)}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Number of Orders</strong></td>
                          <td className="text-end">{reportData.totalOrders || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Average Order Value</strong></td>
                          <td className="text-end">
                            {reportData.totalOrders > 0 
                              ? formatCurrency(reportData.totalSales / reportData.totalOrders)
                              : formatCurrency(0)
                            }
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Dine-in Orders</strong></td>
                          <td className="text-end">{reportData.dineInOrders || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Takeout Orders</strong></td>
                          <td className="text-end">{reportData.takeoutOrders || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Total Discounts Given</strong></td>
                          <td className="text-end text-danger">
                            {formatCurrency(reportData.totalDiscounts || 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card-cafe">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4" style={{ color: 'var(--cafe-primary)' }}>
                    <i className="fas fa-info-circle me-2"></i>
                    Report Summary
                  </h5>
                  
                  <div className="mb-3">
                    <h6 className="fw-bold">Period</h6>
                    <p className="text-muted mb-0">{formatDate(selectedMonth + '-01')}</p>
                  </div>

                  <div className="mb-3">
                    <h6 className="fw-bold">Status</h6>
                    <span className="badge bg-success">Report Generated</span>
                  </div>

                  <div className="mb-3">
                    <h6 className="fw-bold">Generated On</h6>
                    <p className="text-muted mb-0">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <hr />

                  <div className="text-center">
                    <button 
                      className="btn btn-cafe-primary w-100"
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-print me-2"></i>
                      Print Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        selectedMonth && !loading && (
          <div className="text-center py-5">
            <i className="fas fa-chart-line" style={{ fontSize: '4rem', color: 'var(--cafe-primary)' }}></i>
            <h4 className="mt-3" style={{ color: 'var(--cafe-primary)' }}>No Data Available</h4>
            <p className="text-muted">No sales data found for the selected month.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Report;