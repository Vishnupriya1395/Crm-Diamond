import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/dc.png';
import '../styles/PayslipForm.css';
import '../styles/PayslipPDF.css';

const PayslipForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [uan, setUan] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [lopDays, setLopDays] = useState('');
  const [basic, setBasic] = useState('');
  const [allowance, setAllowance] = useState('');
  const [incentives, setIncentives] = useState('');
  const [bonus, setBonus] = useState('');
  const [salaryAdvance, setSalaryAdvance] = useState('');
  const [date]=('');

  const payPeriod = new Date().toLocaleString('en-us', { month: 'long', year: 'numeric' });

  const oneDaySalary = basic ? parseFloat(basic) / workingDays : 0;
  const lopDeduction = oneDaySalary * lopDays;

  const providentFund = basic ? (parseFloat(basic) * 0.12).toFixed(2) : 0;
  const esi = 200;

  const salaryPerYear = basic ? parseFloat(basic) * 12 : 0;

  let incomeTax = 0;
  if (salaryPerYear <= 300000) {
    incomeTax = 0;
  } else if (salaryPerYear > 300000 && salaryPerYear <= 600000) {
    incomeTax = ((salaryPerYear - 300000) * 0.05).toFixed(2);
  } else if (salaryPerYear > 600000 && salaryPerYear <= 900000) {
    incomeTax = ((salaryPerYear - 600000) * 0.10 + 10000).toFixed(2);
  } else if (salaryPerYear > 900000 && salaryPerYear <= 1200000) {
    incomeTax = ((salaryPerYear - 900000) * 0.15 + 1).toFixed(2);
  } else if (salaryPerYear > 1200000 && salaryPerYear <= 100) {
    incomeTax = ((salaryPerYear - 1200000) * 0.20 + 20000).toFixed(2);
  }

  const totalEarnings = parseFloat(basic || 0) + parseFloat(allowance || 0) + parseFloat(incentives || 0) + parseFloat(bonus || 0);
  const totalDeductions = parseFloat(incomeTax || 0) + parseFloat(providentFund || 0) + parseFloat(esi || 0) + parseFloat(lopDeduction || 0) + parseFloat(salaryAdvance || 0);
  const netPay = totalEarnings - totalDeductions;

  const convertNumberToWords = (amount) => {
    const units = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const scales = ["", "Thousand", "Lakh", "Crore"];

    function numberToWords(num) {
      if (num === 0) return "Zero";
      if (num < 20) return units[num];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "");

      if (num < 1000) {
        return units[Math.floor(num / 100)] + " Hundred " + (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "");
      }

      for (let i = 0; i < scales.length; i++) {
        const unitValue = Math.pow(1000, i + 1);
        if (num < unitValue * 1000) {
          return numberToWords(Math.floor(num / unitValue)) + " " + scales[i] + (num % unitValue !== 0 ? " " + numberToWords(num % unitValue) : "");
        }
      }

      return "";
    }

    return numberToWords(amount) + " Rupees";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pdfElement = document.getElementById("payslip-pdf");
  
    html2canvas(pdfElement, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;
  
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save(`payslip_${employeeId}.pdf`);
    });
  };
  


  return (
    <div className="payslip-form-container">
      <div id="payslip-pdf">
        <div className="header">
          <img src={logo} alt="Company Logo" className="company-logo" height={150} width={110}/>
          <div className="company-details">
            <h2>DIAMOND CROWN</h2>
            <p>No.330/1, 2nd Floor Royal Crowne,<br/> 
            CQAL Layout, Kothihosahalli,<br/>
            Sahakarnagar, Bangalore - 560092.</p>
            <div className="pay-period">
             <p> Payslip of {payPeriod}</p><br/>
            <label> Pay Date :</label>
            <input type="date" value={date} onChange={handleChange} required />
          </div>
          </div>
        </div>

        <div className="summary-section">
        <h3>Employee Details</h3>
          <div className="employee-summary">
           
            <div className="left-section">
              <div>
                <label>Employee Name :</label>
                <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
              </div>
              <div>
                <label>Employee ID :</label>
                <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
              </div>
              <div>
                <label>Email ID :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label>Contact No :</label>
                <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
              </div>
              <div>
                <label>Working Days:</label>
                <input type="text" value={workingDays} onChange={(e) => setWorkingDays(e.target.value)} />
              </div>
            </div>
            <div className="right-section">
              <div>
                <label>Bank A/c No :</label>
                <input type="text" value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} />
              </div>
              <div>
                <label>Designation :</label>
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>
              <div>
                <label>Department :</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div>
                <label>UAN No(PF) :</label>
                <input type="text" value={uan} onChange={(e) => setUan(e.target.value)} />
              </div>
              <div>
                <label>Lop Days :</label>
                <input type="text" value={lopDays} onChange={(e) => setLopDays(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="earnings-deductions-container">
          <div className="earnings-section">
            <h2>Gross Earnings</h2>
        
            <div>
              <label>Basic Salary : </label>
              <input type="text" value={basic} onChange={(e) => setBasic(e.target.value)} />
            </div>
            <div>
              <label>Allowance : </label>
              <input type="text" value={allowance} onChange={(e) => setAllowance(e.target.value)} />
            </div>
            <div>
              <label>Incentives : </label>
              <input type="text" value={incentives} onChange={(e) => setIncentives(e.target.value)} />
            </div>
            <div>
              <label>Bonus : </label>
              <input type="text" value={bonus} onChange={(e) => setBonus(e.target.value)} />
            </div>
            <div className="total-earnings">
              
              <p> Gross  Earnings  : ₹{totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          <div className="deductions-section">
            <h2>Gross Deductions</h2>
            <div>
              <label>Income Tax (TDS) : </label>
              <input type="text" value={incomeTax} readOnly />
            </div>
            <div>
              <label>Provident Fund : </label>
              <input type="text" value={providentFund} readOnly />
            </div>
            <div>
              <label>ESI : </label>
              <input type="text" value={esi} readOnly />
            </div>
            <div>
              <label>Salary Advance : </label>
              <input type="text" value={salaryAdvance} onChange={(e) => setSalaryAdvance(e.target.value)} />
            </div>
            <div>
              <label>LOP Deduction : </label>
              <input type="text" value={lopDeduction.toFixed(2)} readOnly />
            </div>
            <div className="total-deductions">
              <p>Gross  Deduction  :  ₹{totalDeductions.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="total-netpay-section">
          <h3>Total Net Payable</h3>
          <h2>₹{netPay.toFixed(2)}</h2>
          <p>Amount In Words  :  {convertNumberToWords(netPay)}</p>
        </div>
      </div>
      <button type="button" onClick={handleDownload}>Download Payslip as PDF</button>
    </div>
  );
};

export default PayslipForm;
