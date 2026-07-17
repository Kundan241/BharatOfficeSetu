import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useToast } from '../../components/ToastContext';
import { Plus, Trash2, Download, Save } from 'lucide-react';

export default function InvoiceGenerator() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Section A: Metadata
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');

  // Section B: Client Details
  const [clientName, setClientName] = useState('');
  const [clientGSTIN, setClientGSTIN] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // Section C: Line Items
  const [lineItems, setLineItems] = useState([
    { id: Date.now(), description: '', quantity: 1, rate: 0 }
  ]);

  // Tax Selection
  const [gstType, setGstType] = useState('none'); // 'none', 'cgst_sgst_18', 'igst_18'

  // Calculations
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Auto-generate invoice number on mount
  useEffect(() => {
    const fetchLatestInvoice = async () => {
      try {
        const q = query(collection(db, 'invoices'), orderBy('created_at', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        let lastNumber = 0;
        if (!querySnapshot.empty) {
          const lastInvoice = querySnapshot.docs[0].data().invoiceNumber;
          // Example: BOSJULY06/2026-2027
          // Extract the number part: '06'
          const match = lastInvoice.match(/BOS[A-Z]+(\d+)\//);
          if (match && match[1]) {
            lastNumber = parseInt(match[1], 10);
          }
        }
        
        const nextNumber = (lastNumber + 1).toString().padStart(2, '0');
        
        const date = new Date();
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const currentMonth = monthNames[date.getMonth()];
        
        // Calculate Financial Year
        let currentYear = date.getFullYear();
        let nextYear = currentYear + 1;
        if (date.getMonth() < 3) { // Jan, Feb, Mar belong to previous FY
          currentYear -= 1;
          nextYear -= 1;
        }
        const fy = `${currentYear}-${nextYear}`;
        
        setInvoiceNumber(`BOS${currentMonth}${nextNumber}/${fy}`);
      } catch (error) {
        console.error("Error fetching latest invoice:", error);
      }
    };
    
    fetchLatestInvoice();
  }, []);

  // Update line item description when Virtual Office is selected
  useEffect(() => {
    if (serviceCategory === 'Virtual Office') {
      const prefix = 'SN/ SAC Code: 998599 - ';
      setLineItems(prevItems => prevItems.map(item => {
        if (!item.description.startsWith(prefix)) {
          return { ...item, description: prefix + item.description.replace(/^SN\/ SAC Code: 998599 - /, '') };
        }
        return item;
      }));
    }
  }, [serviceCategory]);

  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.rate)), 0);
    setSubtotal(newSubtotal);

    // Calculate tax
    let newTax = 0;
    if (gstType === 'cgst_sgst_18' || gstType === 'igst_18') {
      newTax = newSubtotal * 0.18;
    }
    setTaxAmount(newTax);

    // Calculate grand total
    setGrandTotal(newSubtotal + newTax);
  }, [lineItems, gstType]);

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now(), description: serviceCategory === 'Virtual Office' ? 'SN/ SAC Code: 998599 - ' : '', quantity: 1, rate: 0 }]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const handleLineItemChange = (id, field, value) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleSaveToDatabase = async () => {
    if (!invoiceNumber || !clientName) {
      addToast('error', 'Invoice Number and Client Name are required');
      return;
    }
    
    setLoading(true);
    try {
      const invoiceData = {
        invoiceNumber,
        issueDate,
        dueDate,
        serviceCategory,
        clientDetails: {
          clientName,
          clientGSTIN,
          contactPerson,
          email,
          billingAddress,
        },
        lineItems: lineItems.map(({ description, quantity, rate }) => ({ description, quantity, rate })),
        taxDetails: {
          gstType,
          subtotal,
          taxAmount,
          grandTotal
        },
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, 'invoices'), invoiceData);
      addToast('success', 'Invoice saved successfully!');
      
      // Auto-increment the invoice number for the next one
      const match = invoiceNumber.match(/(BOS[A-Z]+)(\d+)(\/.*)/);
      if (match) {
        const nextNum = (parseInt(match[2], 10) + 1).toString().padStart(2, '0');
        setInvoiceNumber(`${match[1]}${nextNum}${match[3]}`);
      }
      
      // Reset form
      setClientName('');
      setClientGSTIN('');
      setContactPerson('');
      setEmail('');
      setBillingAddress('');
      setLineItems([{ id: Date.now(), description: serviceCategory === 'Virtual Office' ? 'SN/ SAC Code: 998599 - ' : '', quantity: 1, rate: 0 }]);
      setServiceCategory('');
      setSubtotal(0);
      setTaxAmount(0);
      setGrandTotal(0);
      setGstType('none');

    } catch (error) {
      console.error('Error saving invoice:', error);
      addToast('error', 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!invoiceNumber) {
      addToast('error', 'Invoice Number is required to export');
      return;
    }

    // Header: [Invoice_Number, Date, Due_Date, Client_Name, Client_GSTIN, Item_Description, Item_Qty, Item_Rate, Subtotal, Tax_Amount, Grand_Total]
    const headers = [
      'Invoice_Number', 'Date', 'Due_Date', 'Client_Name', 'Client_GSTIN',
      'Item_Description', 'Item_Qty', 'Item_Rate', 'Subtotal', 'Tax_Amount', 'Grand_Total'
    ];

    let csvContent = headers.join(',') + '\n';

    lineItems.forEach((item, index) => {
      // Escape commas in strings
      const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;

      const row = [
        escape(invoiceNumber),
        escape(issueDate),
        escape(dueDate),
        escape(clientName),
        escape(clientGSTIN),
        escape(item.description),
        item.quantity,
        item.rate,
        index === 0 ? subtotal.toFixed(2) : '', // Only put totals on the first row of the invoice in CSV
        index === 0 ? taxAmount.toFixed(2) : '',
        index === 0 ? grandTotal.toFixed(2) : ''
      ];

      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Invoice_${invoiceNumber}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fade-up-enter max-w-[1000px] mx-auto pb-20 font-sans">
      <div className="mb-7 flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-[800] text-[#111110]">Invoice Generator</h1>
          <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Create and log new invoices</p>
        </div>
      </div>

      <div className="bg-white border border-[rgba(17,17,16,0.08)] rounded-[16px] shadow-sm overflow-hidden mb-6">
        {/* Section A: Metadata */}
        <div className="p-6 border-b border-[rgba(17,17,16,0.08)]">
          <h2 className="text-[14px] font-[700] text-[#111110] mb-4">Section A: Invoice Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Invoice Number *</label>
              <input required type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} placeholder="e.g. INV-2026-001" className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Issue Date</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Service Category</label>
              <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="h-[44px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all">
                <option value="">Select Category</option>
                <option value="Virtual Office">Virtual Office</option>
                <option value="Gazette Publication">Gazette Publication</option>
                <option value="GST Registration">GST Registration</option>
                <option value="Company Incorporation">Company Incorporation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Client Details */}
        <div className="p-6 border-b border-[rgba(17,17,16,0.08)] bg-[#FAFAFA]">
          <h2 className="text-[14px] font-[700] text-[#111110] mb-4">Section B: Client Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Client Business Name *</label>
              <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Business Name" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Client PAN/GSTIN</label>
              <input type="text" value={clientGSTIN} onChange={e => setClientGSTIN(e.target.value)} placeholder="GSTIN / PAN" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Contact Person</label>
              <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Name" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-[600] text-[#111110]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="h-[44px] bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-[600] text-[#111110]">Billing Address</label>
            <textarea rows={2} value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="Full Address" className="p-3 bg-white border border-[rgba(17,17,16,0.1)] rounded-[10px] text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)] focus:shadow-[0_0_0_3px_rgba(27,107,47,0.08)] transition-all resize-none"></textarea>
          </div>
        </div>

        {/* Section C: Line Items */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-[700] text-[#111110]">Section C: Line Items</h2>
            <button onClick={addLineItem} className="px-3 h-[36px] border border-[rgba(27,107,47,0.3)] text-[#1B6B2F] rounded-[8px] text-[13px] font-[600] flex items-center gap-1.5 hover:bg-[rgba(27,107,47,0.05)] transition-colors">
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(17,17,16,0.1)]">
                  <th className="pb-2 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[50%]">Item Description</th>
                  <th className="pb-2 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%]">Quantity</th>
                  <th className="pb-2 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%]">Rate (₹)</th>
                  <th className="pb-2 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[15%] text-right">Amount (₹)</th>
                  <th className="pb-2 text-[12px] font-[600] text-[rgba(17,17,16,0.5)] w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="border-b border-[rgba(17,17,16,0.05)] last:border-0">
                    <td className="py-3 pr-2">
                      <input type="text" value={item.description} onChange={e => handleLineItemChange(item.id, 'description', e.target.value)} placeholder="Description" className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)]" />
                    </td>
                    <td className="py-3 pr-2">
                      <input type="number" min="1" value={item.quantity} onChange={e => handleLineItemChange(item.id, 'quantity', e.target.value)} className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)]" />
                    </td>
                    <td className="py-3 pr-2">
                      <input type="number" min="0" value={item.rate} onChange={e => handleLineItemChange(item.id, 'rate', e.target.value)} className="w-full h-[40px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[14px] outline-none focus:border-[rgba(27,107,47,0.5)]" />
                    </td>
                    <td className="py-3 pr-2 text-right text-[14px] font-[600] text-[#111110]">
                      {formatCurrency(item.quantity * item.rate)}
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => removeLineItem(item.id)} className="text-[rgba(17,17,16,0.3)] hover:text-[#DC2626] transition-colors p-2" disabled={lineItems.length === 1}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col items-end gap-3 w-full sm:w-1/2 ml-auto">
            <div className="flex justify-between w-full text-[14px]">
              <span className="font-[500] text-[rgba(17,17,16,0.6)]">Subtotal:</span>
              <span className="font-[600] text-[#111110]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-full items-center">
              <span className="font-[500] text-[rgba(17,17,16,0.6)] text-[14px]">GST Selection:</span>
              <select value={gstType} onChange={e => setGstType(e.target.value)} className="h-[36px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-3 text-[13px] outline-none focus:border-[rgba(27,107,47,0.5)]">
                <option value="none">None (0%)</option>
                <option value="cgst_sgst_18">CGST 9% + SGST 9%</option>
                <option value="igst_18">IGST 18%</option>
              </select>
            </div>
            {gstType !== 'none' && (
              <div className="flex justify-between w-full text-[14px]">
                <span className="font-[500] text-[rgba(17,17,16,0.6)]">Tax Amount (18%):</span>
                <span className="font-[600] text-[#111110]">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="w-full h-[1px] bg-[rgba(17,17,16,0.1)] my-1"></div>
            <div className="flex justify-between w-full text-[18px]">
              <span className="font-[700] text-[#111110]">Grand Total:</span>
              <span className="font-[800] text-[#1B6B2F]">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button onClick={handleExportCSV} className="h-[48px] px-6 rounded-[100px] bg-transparent border-2 border-[rgba(17,17,16,0.1)] text-[#111110] font-[600] text-[15px] flex items-center justify-center gap-2 hover:bg-[#F9F8F5] transition-all">
          <Download size={18} />
          Export for Zoho CRM / Excel
        </button>
        <button onClick={handleSaveToDatabase} disabled={loading} className="h-[48px] px-6 rounded-[100px] bg-[#1B6B2F] text-white font-[600] text-[15px] flex items-center justify-center gap-2 hover:bg-[#145324] transition-all disabled:opacity-50">
          <Save size={18} />
          {loading ? 'Saving...' : 'Save to Database'}
        </button>
      </div>

    </div>
  );
}
