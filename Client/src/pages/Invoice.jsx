// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';
// import api from '../utils/api';

// const Invoice = () => {
//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const printRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

//   useEffect(() => {
//     fetchInvoice();
//   }, [id]);

//   const fetchInvoice = async () => {
//     try {
//       const response = await api.get(`/order/${id}/invoice`);
//       setInvoice(response.data);
//     } catch (error) {
//       setError('Failed to load invoice');
//       console.error('Error fetching invoice:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mt-4">
//         <div className="text-center">
//           <div className="loading-spinner"></div>
//           <p className="mt-2">Loading invoice...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !invoice) {
//     return (
//       <div className="container mt-4">
//         <div className="alert alert-danger" role="alert">
//           {error || 'Invoice not found'}
//         </div>
//         <button 
//           className="btn btn-cafe-primary"
//           onClick={() => navigate('/dashboard')}
//         >
//           <i className="fas fa-arrow-left me-2"></i>
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4 no-print">
//             <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
//               <i className="fas fa-receipt me-2"></i>
//               Invoice
//             </h2>
//             <div>
//               <button 
//                 className="btn btn-cafe-secondary me-2"
//                 onClick={handlePrint}
//               >
//                 <i className="fas fa-print me-2"></i>
//                 Print Invoice
//               </button>
//               <button 
//                 className="btn btn-outline-secondary"
//                 onClick={() => navigate('/dashboard')}
//               >
//                 <i className="fas fa-arrow-left me-2"></i>
//                 Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card-cafe invoice-container" ref={printRef}>
//             {/* Header */}
//             <div className="invoice-header text-center">
//               <h1 className="fw-bold mb-2">
//                 <i className="fas fa-coffee me-2"></i>
//                 Cafe QuickBrew
//               </h1>
//               <p className="mb-0">123 Coffee Street, Bean City, BC 12345</p>
//               <p className="mb-0">Phone: (555) 123-BREW | Email: info@cafequickbrew.com</p>
//             </div>

//             <div className="card-body p-4">
//               {/* Invoice Details */}
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>Invoice Details</h5>
//                   <p className="mb-1"><strong>Invoice #:</strong> {invoice.tokenNo || invoice._id}</p>
//                   <p className="mb-1"><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
//                   <p className="mb-1"><strong>Order Type:</strong> 
//                     {invoice.orderType === 'dine-in' 
//                       ? `Dine In (Table ${invoice.tableNo})` 
//                       : 'Takeout'
//                     }
//                   </p>
//                   <p className="mb-1"><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
//                 </div>
//                 <div className="col-md-6">
//                   <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>Customer Information</h5>
//                   <p className="mb-1"><strong>Name:</strong> {invoice.customerName}</p>
//                   <p className="mb-1"><strong>Phone:</strong> {invoice.customerPhone}</p>
//                   {invoice.customerPhoto && (
//                     <div className="mt-2">
//                       <img
//                         src={invoice.customerPhoto}
//                         alt="Customer"
//                         style={{
//                           width: '100px',
//                           height: '100px',
//                           borderRadius: '50%',
//                           objectFit: 'cover',
//                           border: '3px solid var(--cafe-primary)'
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Items Table */}
//               <div className="table-responsive mb-4">
//                 <table className="table table-striped">
//                   <thead style={{ backgroundColor: 'var(--cafe-primary)', color: 'white' }}>
//                     <tr>
//                       <th>Item</th>
//                       <th className="text-center">Quantity</th>
//                       <th className="text-end">Unit Price</th>
//                       <th className="text-end">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {invoice.items.map((item, index) => (
//                       <tr key={index}>
//                         <td>
//                           <strong>{item.itemId?.name || item.name}</strong>
//                           {item.itemId?.description && (
//                             <>
//                               <br />
//                               <small className="text-muted">{item.itemId.description}</small>
//                             </>
//                           )}
//                         </td>
//                         <td className="text-center">{item.quantity}</td>
//                         <td className="text-end">${(item.itemId?.price || item.price).toFixed(2)}</td>
//                         <td className="text-end">${((item.itemId?.price || item.price) * item.quantity).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Totals */}
//               <div className="row">
//                 <div className="col-md-6 offset-md-6">
//                   <div className="table-responsive">
//                     <table className="table table-sm">
//                       <tbody>
//                         <tr>
//                           <td><strong>Subtotal:</strong></td>
//                           <td className="text-end">${invoice.subtotal?.toFixed(2) || '0.00'}</td>
//                         </tr>
//                         {invoice.discountPercentage > 0 && (
//                           <tr className="text-success">
//                             <td><strong>Discount ({invoice.discountPercentage}%):</strong></td>
//                             <td className="text-end">-${invoice.discountAmount?.toFixed(2) || '0.00'}</td>
//                           </tr>
//                         )}
//                         <tr style={{ backgroundColor: 'var(--cafe-warm)' }}>
//                           <td><strong>Total Amount:</strong></td>
//                           <td className="text-end">
//                             <strong style={{ color: 'var(--cafe-primary)', fontSize: '1.2rem' }}>
//                               ${invoice.totalAmount?.toFixed(2) || '0.00'}
//                             </strong>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <hr className="mt-4" />
//               <div className="text-center">
//                 <p className="mb-2" style={{ color: 'var(--cafe-primary)' }}>
//                   <strong>Thank you for visiting Cafe QuickBrew!</strong>
//                 </p>
//                 <p className="text-muted mb-0">
//                   Served by: {invoice.responsibleBarista?.username || 'Staff'}
//                 </p>
//                 <small className="text-muted">
//                   Have a great day and come back soon! ☕
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import api from '../utils/api';

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      if (!printRef.current) {
        console.error('Invoice - Print Error: printRef.current is null');
        return Promise.reject('No content to print');
      }
      return Promise.resolve();
    },
    onPrintError: (errorLocation, error) => {
      console.error('Invoice - Print Error:', errorLocation, error);
    }
  });

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/order/${id}/invoice`);
      console.log('Invoice - API Response:', response.data);
      let invoiceData = response.data;

      // Fallback for createdAt
      if (!invoiceData.createdAt) {
        invoiceData.createdAt = new Date('2025-08-19T00:00:00Z');
        console.warn('Invoice - createdAt missing; using fallback date:', invoiceData.createdAt);
      }

      // Calculate amounts if missing
      const calculatedSubtotal = invoiceData.items?.reduce(
        (sum, item) => sum + (item.itemId?.price || item.price || 0) * (item.quantity || 0),
        0
      ) || 0;
      const calculatedDiscountAmount = (calculatedSubtotal * (invoiceData.discountPercentage || 0)) / 100;
      const calculatedTotalAmount = calculatedSubtotal - calculatedDiscountAmount;

      invoiceData = {
        ...invoiceData,
        subtotal: invoiceData.subtotal || calculatedSubtotal,
        discountAmount: invoiceData.discountAmount || calculatedDiscountAmount,
        totalAmount: invoiceData.totalAmount || calculatedTotalAmount
      };
      console.log('Invoice - Calculated Amounts:', {
        subtotal: invoiceData.subtotal,
        discountAmount: invoiceData.discountAmount,
        totalAmount: invoiceData.totalAmount
      });

      // Fetch barista details if responsibleBarista is an ID
      if (invoiceData.responsibleBarista && typeof invoiceData.responsibleBarista === 'string') {
        try {
          const baristaResponse = await api.get('/AllUser');
          console.log('Invoice - AllUser Response for Barista:', baristaResponse.data);
          const barista = baristaResponse.data.find(b => b._id === invoiceData.responsibleBarista);
          invoiceData.responsibleBarista = barista || { username: 'Staff' };
        } catch (baristaError) {
          console.error('Invoice - fetchBarista Error:', baristaError.response || baristaError.message);
          invoiceData.responsibleBarista = { username: 'Staff' };
        }
      }

      setInvoice(invoiceData);
    } catch (error) {
      setError('Failed to load invoice. Please check the order ID or API connection.');
      console.error('Invoice - Fetch Error:', error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt-2">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice || !invoice.items?.length) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Invoice not found or no data available'}
        </div>
        <button 
          className="btn btn-cafe-primary"
          onClick={() => navigate('/dashboard')}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.warn('Invoice - Invalid createdAt:', dateString);
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4 no-print">
            <h2 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>
              <i className="fas fa-receipt me-2"></i>
              Invoice
            </h2>
            <div>
              <button 
                className="btn btn-cafe-secondary me-2"
                onClick={handlePrint}
                disabled={!invoice || !invoice.items?.length || invoice.totalAmount === 0}
              >
                <i className="fas fa-print me-2"></i>
                Print Invoice
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button>
            </div>
          </div>
          {!invoice.items?.length || invoice.totalAmount === 0 ? (
            <div className="alert alert-warning" role="alert">
              No valid data available for printing. Please ensure the invoice contains order information.
            </div>
          ) : null}
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-cafe invoice-container" ref={printRef}>
            <div className="invoice-header text-center">
              <h1 className="fw-bold mb-2">
                <i className="fas fa-coffee me-2"></i>
                Cafe QuickBrew
              </h1>
              <p className="mb-0">123 Coffee Street, Bean City, BC 12345</p>
              <p className="mb-0">Phone: (555) 123-BREW | Email: info@cafequickbrew.com</p>
            </div>

            <div className="card-body p-4">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>Invoice Details</h5>
                  <p className="mb-1"><strong>Invoice #:</strong> {invoice.tokenNo || invoice._id || 'N/A'}</p>
                  <p className="mb-1"><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
                  <p className="mb-1"><strong>Order Type:</strong> 
                    {invoice.orderType === 'dine-in' 
                      ? `Dine In (Table ${invoice.tableNo || 'N/A'})` 
                      : 'Takeout'
                    }
                  </p>
                  <p className="mb-1"><strong>Payment Method:</strong> {invoice.paymentMethod || 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="fw-bold" style={{ color: 'var(--cafe-primary)' }}>Customer Information</h5>
                  <p className="mb-1"><strong>Name:</strong> {invoice.customerName || 'N/A'}</p>
                  <p className="mb-1"><strong>Phone:</strong> {invoice.customerPhone || 'N/A'}</p>
                  {invoice.customerPhoto && (
                    <div className="mt-2">
                      <img
                        src={invoice.customerPhoto}
                        alt="Customer"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid var(--cafe-primary)'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="table-responsive mb-4">
                <table className="table table-striped">
                  <thead style={{ backgroundColor: 'var(--cafe-primary)', color: 'white' }}>
                    <tr>
                      <th>Item</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoice.items || []).map((item, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{item.itemId?.name || item.name || 'Unknown Item'}</strong>
                          {item.itemId?.description && (
                            <>
                              <br />
                              <small className="text-muted">{item.itemId.description}</small>
                            </>
                          )}
                        </td>
                        <td className="text-center">{item.quantity || 0}</td>
                        <td className="text-end">${(item.itemId?.price || item.price || 0).toFixed(2)}</td>
                        <td className="text-end">${((item.itemId?.price || item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                    {!invoice.items?.length && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">No items available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="row">
                <div className="col-md-6 offset-md-6">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <tbody>
                        {invoice.discountPercentage > 0 && (
                          <tr className="text-success">
                            <td><strong>Discount ({invoice.discountPercentage}%):</strong></td>
                            <td className="text-end">-${invoice.discountAmount.toFixed(2)}</td>
                          </tr>
                        )}
                        <tr style={{ backgroundColor: 'var(--cafe-warm)' }}>
                          <td><strong>Total Amount:</strong></td>
                          <td className="text-end">
                            <strong style={{ color: 'var(--cafe-primary)', fontSize: '1.2rem' }}>
                              ${invoice.totalAmount.toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <hr className="mt-4" />
              <div className="text-center">
                <p className="mb-2" style={{ color: 'var(--cafe-primary)' }}>
                  <strong>Thank you for visiting Cafe QuickBrew!</strong>
                </p>
                <p className="text-muted mb-0">
                  Served by: {invoice.responsibleBarista?.username || 'Staff'}
                </p>
                <small className="text-muted">
                  Have a great day and come back soon! ☕
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;