// src/pages/AgreementPage.js
import React, { useState, useRef } from "react";
import {
  FileText,
  Calendar,
  User,
  Package,
  IndianRupee,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Pen,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function AgreementPage() {
  const [renterSigned, setRenterSigned] = useState(false);
  const [farmerSigned, setFarmerSigned] = useState(false);
  const [renterSignature, setRenterSignature] = useState("");
  const [farmerSignature, setFarmerSignature] = useState("");
  const [showRenterSignModal, setShowRenterSignModal] = useState(false);
  const [showFarmerSignModal, setShowFarmerSignModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const pdfRef = useRef(null);

  const agreementData = {
    agreementId: "AGR-2025-001",
    generatedDate: "2025-10-11",
    renterName: "Suresh Patel",
    renterAddress: "Plot No. 45, Agriculture Equipment Hub, Sector 12, Rampur, UP - 244901",
    renterContact: "+91 98765 00000",
    farmerName: "Rajesh Kumar",
    farmerAddress: "Village Rampur, Near Primary School, Tehsil Bilaspur, District Rampur, UP - 244901",
    farmerContact: "+91 98765 43210",
    equipmentName: "John Deere 5310 Tractor",
    equipmentBrand: "John Deere",
    equipmentCondition: "Excellent - Fully serviced, no visible damage",
    startDate: "2025-10-15",
    endDate: "2025-10-22",
    dailyRate: 4000,
    totalAmount: 28500,
    securityDeposit: 10000,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleRenterSign = () => {
    if (renterSignature.trim()) {
      setRenterSigned(true);
      setShowRenterSignModal(false);
    }
  };

  const handleFarmerSign = () => {
    if (farmerSignature.trim()) {
      setFarmerSigned(true);
      setShowFarmerSignModal(false);
    }
  };

  const isAgreementComplete = renterSigned && farmerSigned;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    setIsGeneratingPDF(true);

    try {
      const element = pdfRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Calculate number of pages needed
      const pageHeight = pdfHeight;
      const heightLeft = (imgHeight * ratio);
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, heightLeft);
      let remainingHeight = heightLeft - pageHeight;

      while (remainingHeight > 0) {
        position = remainingHeight - heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, heightLeft);
        remainingHeight -= pageHeight;
      }

      pdf.save(`${agreementData.agreementId}_Rental_Agreement.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Screen View */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Rental Agreement</h1>
                <p className="text-slate-300">Digital Equipment Rental Contract</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <p className="text-slate-300 text-sm">Agreement ID</p>
                <p className="text-white font-bold">{agreementData.agreementId}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Legal Agreement Notice</p>
                  <p className="text-sm text-blue-800">
                    This is a legally binding agreement between the Renter (Equipment Owner) and
                    the Farmer (Equipment User). Both parties must read and understand all terms
                    before signing.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 rounded-xl p-3">
                    <User className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Renter (Owner)</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{agreementData.renterName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-sm text-gray-900">{agreementData.renterAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Contact</p>
                    <p className="text-sm text-gray-900">{agreementData.renterContact}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-xl p-3">
                    <User className="w-6 h-6 text-blue-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Farmer (User)</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{agreementData.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-sm text-gray-900">{agreementData.farmerAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Contact</p>
                    <p className="text-sm text-gray-900">{agreementData.farmerContact}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Equipment Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Equipment Name</p>
                  <p className="font-semibold text-gray-900">{agreementData.equipmentName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Brand</p>
                  <p className="font-semibold text-gray-900">{agreementData.equipmentBrand}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs text-gray-600 mb-1">Condition at Handover</p>
                  <p className="font-semibold text-gray-900">{agreementData.equipmentCondition}</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Rental Period</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreementData.startDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(agreementData.endDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="font-semibold text-green-600">
                    {calculateDays(agreementData.startDate, agreementData.endDate)} Days
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <IndianRupee className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Pricing Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Daily Rate</p>
                  <p className="font-semibold text-gray-900">₹{agreementData.dailyRate.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-1">Security Deposit</p>
                  <p className="font-semibold text-gray-900">₹{agreementData.securityDeposit.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <p className="text-xs text-green-700 mb-1">Total Amount</p>
                  <p className="font-bold text-green-700 text-lg">₹{agreementData.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Terms & Conditions</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">1. Damage Liability</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Farmer shall be fully responsible for any damage to the equipment during the
                    rental period. Any repairs or replacement costs shall be borne by the Farmer.
                    Normal wear and tear is acceptable. The Renter will inspect the equipment upon
                    return.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">2. Late Return Penalties</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    If the equipment is not returned by the agreed end date, a penalty of 150% of
                    the daily rate (₹{(agreementData.dailyRate * 1.5).toLocaleString()} per day) will be
                    charged for each day of delay. The Farmer must inform the Renter at least 24
                    hours in advance if an extension is needed.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">3. Cancellation Policy</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Cancellations made more than 48 hours before the start date will receive a full
                    refund minus 10% processing fee. Cancellations made within 48 hours will forfeit
                    25% of the total amount. No refund for cancellations after the rental period has
                    started.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">4. Usage Restrictions</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The equipment must only be used for agricultural purposes as agreed. The Farmer
                    shall not sub-rent, lend, or allow unauthorized persons to operate the equipment.
                    Operating hours should be reasonable (6 AM to 8 PM). The equipment must not be
                    used in extreme weather conditions without proper precautions.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">5. Maintenance Responsibility</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Renter shall provide the equipment in good working condition with necessary
                    fuel/charge. The Farmer is responsible for daily maintenance including cleaning,
                    checking oil levels, and basic upkeep. Major repairs or breakdowns must be
                    reported to the Renter immediately. Unauthorized repairs are not permitted.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">6. Security Deposit</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    A security deposit of ₹{agreementData.securityDeposit.toLocaleString()} shall be paid
                    before equipment handover. This will be refunded within 7 business days after the
                    equipment is returned in good condition. Any damages or penalties will be deducted
                    from this deposit.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">7. Insurance & Liability</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The Farmer shall be liable for any accidents, injuries, or third-party damages
                    caused during the use of the equipment. The Renter is not responsible for any
                    injuries or losses incurred by the Farmer or third parties during the rental period.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <Pen className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Digital Signatures</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Renter Signature</h4>
                  {renterSigned ? (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-500">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <p className="text-green-700 font-semibold">Signed</p>
                      </div>
                      <p className="font-bold text-2xl text-gray-900 mb-2" style={{ fontFamily: 'cursive' }}>
                        {renterSignature}
                      </p>
                      <p className="text-xs text-gray-600">Signed on: {formatDate(agreementData.generatedDate)}</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.100</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRenterSignModal(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Pen className="w-5 h-5" />
                      Sign as Renter
                    </button>
                  )}
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Farmer Signature</h4>
                  {farmerSigned ? (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-500">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <p className="text-green-700 font-semibold">Signed</p>
                      </div>
                      <p className="font-bold text-2xl text-gray-900 mb-2" style={{ fontFamily: 'cursive' }}>
                        {farmerSignature}
                      </p>
                      <p className="text-xs text-gray-600">Signed on: {formatDate(agreementData.generatedDate)}</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.105</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFarmerSignModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Pen className="w-5 h-5" />
                      Sign as Farmer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isAgreementComplete && (
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-bold text-green-900 text-lg">Agreement Completed!</h4>
                    <p className="text-sm text-green-700">
                      Both parties have signed. The rental agreement is now legally binding.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {isGeneratingPDF ? "Generating PDF..." : "Download Agreement PDF"}
                </button>
              </div>
            )}

            {!isAgreementComplete && (
              <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Pending Signatures</p>
                    <p className="text-sm text-amber-800">
                      {!renterSigned && !farmerSigned && "Both parties need to sign this agreement."}
                      {renterSigned && !farmerSigned && "Waiting for Farmer's signature."}
                      {!renterSigned && farmerSigned && "Waiting for Renter's signature."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
              <p>Agreement generated on {formatDate(agreementData.generatedDate)}</p>
              <p className="mt-1">
                This is a digitally generated agreement. No physical signature is required.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden PDF Template */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <div ref={pdfRef} style={{ width: '210mm', backgroundColor: '#ffffff', padding: '20mm' }}>
            <PDFTemplate
              agreementData={agreementData}
              renterSignature={renterSignature}
              farmerSignature={farmerSignature}
              formatDate={formatDate}
              calculateDays={calculateDays}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRenterSignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-xl p-3">
                <Pen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Renter Signature</h3>
            </div>

            <p className="text-gray-600 mb-4">
              By signing, you confirm that you have read and agree to all terms and conditions of
              this rental agreement.
            </p>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Type your full name as signature
              </label>
              <input
                type="text"
                value={renterSignature}
                onChange={(e) => setRenterSignature(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                style={{ fontFamily: 'cursive', fontSize: '1.25rem' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRenterSignModal(false);
                  setRenterSignature("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRenterSign}
                disabled={!renterSignature.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {showFarmerSignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <Pen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Farmer Signature</h3>
            </div>

            <p className="text-gray-600 mb-4">
              By signing, you confirm that you have read and agree to all terms and conditions of
              this rental agreement.
            </p>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Type your full name as signature
              </label>
              <input
                type="text"
                value={farmerSignature}
                onChange={(e) => setFarmerSignature(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                style={{ fontFamily: 'cursive', fontSize: '1.25rem' }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFarmerSignModal(false);
                  setFarmerSignature("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleFarmerSign}
                disabled={!farmerSignature.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PDF Template Component
interface PDFTemplateProps {
  agreementData: any;
  renterSignature: string;
  farmerSignature: string;
  formatDate: (date: string) => string;
  calculateDays: (start: string, end: string) => number;
}

function PDFTemplate({ agreementData, renterSignature, farmerSignature, formatDate, calculateDays }: PDFTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.6', color: '#000' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '3px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 5px 0' }}>EQUIPMENT RENTAL AGREEMENT</h1>
        <p style={{ fontSize: '10pt', margin: '0', color: '#666' }}>Legally Binding Contract</p>
        <p style={{ fontSize: '9pt', margin: '5px 0 0 0', color: '#666' }}>Agreement ID: {agreementData.agreementId}</p>
      </div>

      {/* Agreement Date */}
      <p style={{ textAlign: 'right', fontSize: '10pt', marginBottom: '20px' }}>
        <strong>Date:</strong> {formatDate(agreementData.generatedDate)}
      </p>

      {/* Parties Section */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>
          PARTIES TO THIS AGREEMENT
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '8px' }}>1. RENTER (Equipment Owner)</h3>
          <table style={{ width: '100%', fontSize: '10pt' }}>
            <tbody>
              <tr>
                <td style={{ width: '20%', fontWeight: 'bold' }}>Name:</td>
                <td>{agreementData.renterName}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Address:</td>
                <td>{agreementData.renterAddress}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Contact:</td>
                <td>{agreementData.renterContact}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '8px' }}>2. FARMER (Equipment User)</h3>
          <table style={{ width: '100%', fontSize: '10pt' }}>
            <tbody>
              <tr>
                <td style={{ width: '20%', fontWeight: 'bold' }}>Name:</td>
                <td>{agreementData.farmerName}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Address:</td>
                <td>{agreementData.farmerAddress}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Contact:</td>
                <td>{agreementData.farmerContact}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Details */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>
          EQUIPMENT DETAILS
        </h2>
        <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '30%', fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Equipment Name:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{agreementData.equipmentName}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Brand/Model:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{agreementData.equipmentBrand}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Condition at Handover:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{agreementData.equipmentCondition}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rental Period */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>
          RENTAL PERIOD
        </h2>
        <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '30%', fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Start Date:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{formatDate(agreementData.startDate)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>End Date:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{formatDate(agreementData.endDate)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Total Duration:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                {calculateDays(agreementData.startDate, agreementData.endDate)} Days
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Financial Terms */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>
          FINANCIAL TERMS
        </h2>
        <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '30%', fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Daily Rental Rate:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>₹{agreementData.dailyRate.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '1px solid #ddd' }}>Security Deposit:</td>
              <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>₹{agreementData.securityDeposit.toLocaleString()}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', padding: '5px', borderBottom: '2px solid #333', backgroundColor: '#f0f0f0' }}>Total Amount:</td>
              <td style={{ padding: '5px', borderBottom: '2px solid #333', fontWeight: 'bold', fontSize: '12pt', backgroundColor: '#f0f0f0' }}>
                ₹{agreementData.totalAmount.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terms and Conditions */}
      <div style={{ marginBottom: '25px', pageBreakBefore: 'auto' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>
          TERMS AND CONDITIONS
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>1. Damage Liability</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            The Farmer shall be fully responsible for any damage to the equipment during the rental period.
            Any repairs or replacement costs shall be borne by the Farmer. Normal wear and tear is acceptable.
            The Renter will inspect the equipment upon return.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>2. Late Return Penalties</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            If the equipment is not returned by the agreed end date, a penalty of 150% of the daily rate
            (₹{(agreementData.dailyRate * 1.5).toLocaleString()} per day) will be charged for each day of delay.
            The Farmer must inform the Renter at least 24 hours in advance if an extension is needed.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>3. Cancellation Policy</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            Cancellations made more than 48 hours before the start date will receive a full refund minus 10%
            processing fee. Cancellations made within 48 hours will forfeit 25% of the total amount. No refund
            for cancellations after the rental period has started.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>4. Usage Restrictions</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            The equipment must only be used for agricultural purposes as agreed. The Farmer shall not sub-rent,
            lend, or allow unauthorized persons to operate the equipment. Operating hours should be reasonable
            (6 AM to 8 PM). The equipment must not be used in extreme weather conditions without proper precautions.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>5. Maintenance Responsibility</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            The Renter shall provide the equipment in good working condition with necessary fuel/charge. The Farmer
            is responsible for daily maintenance including cleaning, checking oil levels, and basic upkeep. Major
            repairs or breakdowns must be reported to the Renter immediately. Unauthorized repairs are not permitted.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>6. Security Deposit</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            A security deposit of ₹{agreementData.securityDeposit.toLocaleString()} shall be paid before equipment
            handover. This will be refunded within 7 business days after the equipment is returned in good condition.
            Any damages or penalties will be deducted from this deposit.
          </p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>7. Insurance & Liability</h3>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginLeft: '15px' }}>
            The Farmer shall be liable for any accidents, injuries, or third-party damages caused during the use of
            the equipment. The Renter is not responsible for any injuries or losses incurred by the Farmer or third
            parties during the rental period.
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '40px', pageBreakInside: 'avoid' }}>
        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '20px' }}>
          SIGNATURES
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '2px solid #000', paddingBottom: '40px', minHeight: '60px' }}>
              <p style={{ fontFamily: 'cursive', fontSize: '18pt', fontWeight: 'bold', margin: '10px 0' }}>
                {renterSignature}
              </p>
            </div>
            <p style={{ fontSize: '10pt', fontWeight: 'bold', marginTop: '8px' }}>RENTER (Owner)</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>Name: {agreementData.renterName}</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>Date: {formatDate(agreementData.generatedDate)}</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>IP: 192.168.1.100</p>
          </div>

          <div style={{ width: '45%' }}>
            <div style={{ borderBottom: '2px solid #000', paddingBottom: '40px', minHeight: '60px' }}>
              <p style={{ fontFamily: 'cursive', fontSize: '18pt', fontWeight: 'bold', margin: '10px 0' }}>
                {farmerSignature}
              </p>
            </div>
            <p style={{ fontSize: '10pt', fontWeight: 'bold', marginTop: '8px' }}>FARMER (User)</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>Name: {agreementData.farmerName}</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>Date: {formatDate(agreementData.generatedDate)}</p>
            <p style={{ fontSize: '9pt', margin: '3px 0' }}>IP: 192.168.1.105</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p style={{ fontSize: '8pt', color: '#666', margin: '3px 0' }}>
          This is a digitally generated agreement. No physical signature is required.
        </p>
        <p style={{ fontSize: '8pt', color: '#666', margin: '3px 0' }}>
          Agreement ID: {agreementData.agreementId} | Generated: {formatDate(agreementData.generatedDate)}
        </p>
      </div>
    </div>
  );
}

export default AgreementPage;
