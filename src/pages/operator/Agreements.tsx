import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Upload, CheckCircle, Clock, XCircle, AlertTriangle, Lock, Crown, Shield, Eye, X, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Agreements: React.FC = () => {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Get operator's membership payment info
  const getOperatorPaymentInfo = () => {
    try {
      const membershipPayments = JSON.parse(localStorage.getItem('operatorMembershipPayments') || '[]');
      return membershipPayments.find((payment: any) => payment.operatorEmail === user?.email);
    } catch (error) {
      return null;
    }
  };

  const operatorPayment = getOperatorPaymentInfo();

  // Get agreement status from localStorage
  const getAgreementStatus = () => {
    try {
      const agreements = JSON.parse(localStorage.getItem('operatorAgreements') || '[]');
      return agreements.find((agreement: any) => agreement.operatorEmail === user?.email);
    } catch (error) {
      return null;
    }
  };

  const agreementStatus = getAgreementStatus();

  const accessStatus = {
    hasMembership: operatorPayment?.status === 'approved',
    hasAOC: user?.hasUploadedAOC && user?.isApprovedByAdmin,
    membershipStatus: operatorPayment?.status || 'pending',
    hasCompletedRequirements: operatorPayment?.status === 'approved' && user?.hasUploadedAOC && user?.isApprovedByAdmin,
    paymentInfo: operatorPayment
  };

  // Check if operator can access agreements
  const canAccessAgreements = () => {
    return accessStatus.hasCompletedRequirements;
  };

  const hasAccess = canAccessAgreements();

  // Generate service agreement PDF
  const generateServiceAgreementPDF = () => {
    if (!hasAccess || !operatorPayment) return;

    const contractDuration = operatorPayment.planName?.includes('Monthly') ? '1 (one) month' : '1 (one) year';
    const contractEndDate = new Date();
    if (operatorPayment.planName?.includes('Monthly')) {
      contractEndDate.setMonth(contractEndDate.getMonth() + 1);
    } else {
      contractEndDate.setFullYear(contractEndDate.getFullYear() + 1);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Service Agreement - ${user?.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center;
            border-bottom: 3px solid #0B1733; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .company-title {
            font-size: 28px;
            font-weight: bold;
            color: #0B1733;
            margin-bottom: 10px;
          }
          .contract-title {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            margin: 20px 0;
          }
          .parties-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .party-info {
            margin-bottom: 20px;
            padding: 15px;
            background-color: white;
            border-radius: 6px;
            border-left: 4px solid #0B1733;
          }
          .party-title {
            font-size: 18px;
            font-weight: bold;
            color: #0B1733;
            margin-bottom: 10px;
          }
          .article {
            margin: 25px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          .article-title {
            font-size: 16px;
            font-weight: bold;
            color: #0B1733;
            margin-bottom: 15px;
            border-bottom: 2px solid #0B1733;
            padding-bottom: 5px;
          }
          .article-content {
            font-size: 14px;
            line-height: 1.7;
          }
          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            padding: 30px 0;
            border-top: 2px solid #0B1733;
          }
          .signature-box {
            text-align: center;
            width: 45%;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin-top: 50px;
            padding-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-title">JETUP LTD (UK)</div>
          <div class="contract-title">SERVICE AGREEMENT</div>
          <p><strong>Agreement Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
          <p><strong>Agreement No:</strong> JETUP-${user?.operatorId || 'OID00001'}-${new Date().getFullYear()}</p>
        </div>

        <div class="parties-section">
          <h3 style="color: #0B1733; margin-bottom: 20px;">PARTIES</h3>
          
          <div class="party-info">
            <div class="party-title">SERVICE PROVIDER (JETUP)</div>
            <p><strong>Company Name:</strong> JETUP LTD (UK)</p>
            <p><strong>Company Number:</strong> 16643231</p>
            <p><strong>Address:</strong> 27 Old Gloucester Street, London, United Kingdom, WC1N 3AX</p>
            <p><strong>Email:</strong> support@jetup.aero</p>
            <p><strong>Phone:</strong> +1 888 565 6090</p>
          </div>

          <div class="party-info">
            <div class="party-title">SERVICE RECIPIENT (OPERATOR)</div>
            <p><strong>Operator Name:</strong> ${user?.name || 'Operator Name'}</p>
            <p><strong>Operator ID:</strong> ${user?.operatorId || 'OID00001'}</p>
            <p><strong>Email:</strong> ${user?.email || 'operator@email.com'}</p>
            <p><strong>Selected Plan:</strong> ${operatorPayment?.planName || 'Plan'}</p>
            <p><strong>Amount Paid:</strong> ${operatorPayment?.amount || '$0'}</p>
          </div>
        </div>

        <div class="highlight">
          <p><strong>⚠️ IMPORTANT:</strong> This agreement is valid for ${contractDuration} and will expire on ${contractEndDate.toLocaleDateString('en-US')}.</p>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 1 - SUBJECT OF THE AGREEMENT</div>
          <div class="article-content">
            <p>This agreement covers the provision of infrastructure services necessary for the Operator to provide services and reach customers on the private aircraft reservation platform operated by JETUP LTD (UK).</p>
            <p><strong>Service Duration:</strong> ${contractDuration}</p>
            <p><strong>Plan Type:</strong> ${operatorPayment?.planName || 'Plan'}</p>
            <p><strong>Commission Rate:</strong> 0% (Zero commission)</p>
          </div>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 2 - JETUP'S OBLIGATIONS</div>
          <div class="article-content">
            <ul>
              <li>Provide digital platform access to the Operator</li>
              <li>Forward customer reservation requests</li>
              <li>Coordinate payment processes</li>
              <li>Provide 24/7 technical support</li>
              <li>Ensure platform security and data protection</li>
              <li>Provide access to customer portfolio</li>
            </ul>
          </div>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 3 - OPERATOR'S OBLIGATIONS</div>
          <div class="article-content">
            <ul>
              <li>Maintain valid AOC (Air Operator Certificate) license</li>
              <li>Keep aircraft fleet current and safe</li>
              <li>Respond to customer requests in a timely manner</li>
              <li>Comply with aviation security standards</li>
              <li>Maintain insurance coverage</li>
              <li>Comply with platform rules and policies</li>
              <li>Pay membership fees on time</li>
            </ul>
          </div>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 4 - FINANCIAL TERMS</div>
          <div class="article-content">
            <p><strong>Membership Fee:</strong> ${operatorPayment?.amount || '$0'} (${operatorPayment?.planName || 'Plan'})</p>
            <p><strong>Commission Rate:</strong> 0% (Zero commission - all revenue belongs to Operator)</p>
            <p><strong>Payment Method:</strong> ${operatorPayment?.paymentMethod || 'Not specified'}</p>
            <p><strong>Contract Duration:</strong> ${contractDuration}</p>
            <p><strong>Renewal:</strong> Automatically renews at the end of contract period (unless cancelled)</p>
          </div>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 5 - CANCELLATION AND TERMINATION CONDITIONS</div>
          <div class="article-content">
            <p><strong>Operator Cancellation Rights:</strong> 25 booking cancellation rights</p>
            <p><strong>Contract Termination:</strong> 30 days written notice required</p>
            <p><strong>Early Termination:</strong> Paid fees are non-refundable</p>
            <p><strong>Platform Rules Violation:</strong> JETUP reserves the right to unilateral termination</p>
          </div>
        </div>

        <div class="article">
          <div class="article-title">ARTICLE 6 - GENERAL PROVISIONS</div>
          <div class="article-content">
            <p><strong>Applicable Law:</strong> United Kingdom Law</p>
            <p><strong>Dispute Resolution:</strong> UK courts have jurisdiction</p>
            <p><strong>Contract Language:</strong> English (this version is legally binding)</p>
            <p><strong>Amendments:</strong> In writing and with approval of both parties</p>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <p><strong>SERVICE PROVIDER</strong></p>
            <p>JETUP LTD (UK)</p>
            <div class="signature-line">
              <p>Signature and Stamp</p>
            </div>
          </div>
          <div class="signature-box">
            <p><strong>SERVICE RECIPIENT</strong></p>
            <p>${user?.name || 'Operator Name'}</p>
            <p>${user?.operatorId || 'OID00001'}</p>
            <div class="signature-line">
              <p>Signature and Stamp</p>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>JETUP LTD (UK) - Private Flight Network</strong></p>
          <p>This agreement was created electronically on ${new Date().toLocaleDateString('en-US')}.</p>
          <p>Agreement Reference No: JETUP-${user?.operatorId || 'OID00001'}-${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasAccess) return;
    
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handleUploadSignedAgreement = async () => {
    if (!uploadedFile || !hasAccess) return;

    setIsUploading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create agreement record
      const agreementRecord = {
        id: Date.now().toString(),
        operatorId: user?.operatorId || 'OID00001',
        operatorName: user?.name || 'Unknown Operator',
        operatorEmail: user?.email || '',
        contractDuration: operatorPayment?.planName === 'Monthly Plan' ? '1 month' : '1 year',
        planName: operatorPayment?.planName || '',
        amount: operatorPayment?.amount || '',
        signedFileName: uploadedFile.name,
        signedFileSize: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        status: 'pending_admin_approval',
        contractNumber: `JETUP-${user?.operatorId || 'OID00001'}-${new Date().getFullYear()}`
      };

      // Save to localStorage for admin review
      const existingAgreements = JSON.parse(localStorage.getItem('operatorAgreements') || '[]');
      const updatedAgreements = existingAgreements.filter((agreement: any) => 
        agreement.operatorEmail !== user?.email
      );
      updatedAgreements.push(agreementRecord);
      localStorage.setItem('operatorAgreements', JSON.stringify(updatedAgreements));

      alert('Signed agreement uploaded successfully! It will be reviewed by our admin team within 24-48 hours.');
      setUploadedFile(null);

    } catch (error) {
      console.error('Error uploading agreement:', error);
      alert('Failed to upload agreement. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getAgreementStatusInfo = () => {
    if (!agreementStatus) {
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        title: 'Agreement Not Uploaded',
        message: 'Please download, sign, and upload the service agreement'
      };
    }

    switch (agreementStatus.status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Agreement Approved',
          message: 'Your service agreement has been approved by admin'
        };
      case 'pending_admin_approval':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Agreement Under Review',
          message: 'Your signed agreement is being reviewed by admin team'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Agreement Rejected',
          message: 'Please download a new agreement and resubmit'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Agreement Required',
          message: 'Service agreement signature required'
        };
    }
  };

  const statusInfo = getAgreementStatusInfo();

  return (
    <div className="p-6 space-y-6">
      {/* Access Restriction Notice */}
      {!hasAccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <Lock className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Access Restricted</h3>
              <p className="text-red-700 mt-1">
                You need approved membership and AOC license to access service agreements.
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <Crown className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    Membership Status: {accessStatus.membershipStatus === 'approved' ? '✅ Approved' : 
                                      accessStatus.membershipStatus === 'pending_admin_approval' ? '⏳ Pending' : 
                                      accessStatus.membershipStatus === 'rejected' ? '❌ Rejected' : '❌ Not Submitted'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    AOC License: {accessStatus.hasAOC ? '✅ Approved' : 
                                 user?.hasUploadedAOC ? '⏳ Pending' : '❌ Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Service Agreements</h2>
        {hasAccess && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            agreementStatus?.status === 'approved' ? 'bg-green-100 text-green-800' :
            agreementStatus?.status === 'pending_admin_approval' ? 'bg-yellow-100 text-yellow-800' :
            agreementStatus?.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {agreementStatus?.status === 'approved' ? 'Agreement Approved' :
             agreementStatus?.status === 'pending_admin_approval' ? 'Under Review' :
             agreementStatus?.status === 'rejected' ? 'Rejected' :
             'Agreement Required'}
          </span>
        )}
      </div>

      {hasAccess && (
        <>
          {/* Agreement Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-6`}
          >
            <div className="flex items-center space-x-4">
              <statusInfo.icon className={`h-8 w-8 ${statusInfo.color}`} />
              <div>
                <h3 className={`text-lg font-semibold ${statusInfo.color}`}>
                  {statusInfo.title}
                </h3>
                <p className={`${statusInfo.color} mt-1`}>
                  {statusInfo.message}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 1: Generate Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Step 1: Download Service Agreement</h3>
                <p className="text-gray-600 mt-1">
                  Generate and download your personalized service agreement
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Auto-Generated PDF</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Service Agreement Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-800"><strong>Contract Duration:</strong> {operatorPayment?.planName === 'Monthly Plan' ? '1 Month' : '1 Year'}</p>
                  <p className="text-blue-800"><strong>Plan Type:</strong> {operatorPayment?.planName || 'N/A'}</p>
                  <p className="text-blue-800"><strong>Commission Rate:</strong> 0%</p>
                </div>
                <div>
                  <p className="text-blue-800"><strong>Operator:</strong> {user?.name}</p>
                  <p className="text-blue-800"><strong>Operator ID:</strong> {user?.operatorId}</p>
                  <p className="text-blue-800"><strong>Amount:</strong> {operatorPayment?.amount}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="h-5 w-5 mr-2" />
                Preview Agreement
              </button>
              <button
                onClick={generateServiceAgreementPDF}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Agreement PDF
              </button>
            </div>
          </motion.div>

          {/* Step 2: Upload Signed Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Step 2: Upload Signed Agreement</h3>
                <p className="text-gray-600 mt-1">
                  Upload your signed and stamped service agreement
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Upload className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-600">PDF Upload Required</span>
              </div>
            </div>

            {agreementStatus?.status === 'approved' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">Agreement Approved ✅</h4>
                    <p className="text-green-700 mt-1">
                      Your service agreement has been approved by our admin team.
                    </p>
                    <div className="mt-3 text-sm text-green-600">
                      <p><strong>Contract Number:</strong> {agreementStatus.contractNumber}</p>
                      <p><strong>Uploaded:</strong> {new Date(agreementStatus.uploadedAt).toLocaleDateString()}</p>
                      <p><strong>File:</strong> {agreementStatus.signedFileName}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : agreementStatus?.status === 'pending_admin_approval' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800">Under Admin Review ⏳</h4>
                    <p className="text-yellow-700 mt-1">
                      Your signed agreement is being reviewed by our admin team.
                    </p>
                    <div className="mt-3 text-sm text-yellow-600">
                      <p><strong>Uploaded:</strong> {new Date(agreementStatus.uploadedAt).toLocaleDateString()}</p>
                      <p><strong>File:</strong> {agreementStatus.signedFileName} ({agreementStatus.signedFileSize})</p>
                      <p><strong>Status:</strong> Waiting for admin approval</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : agreementStatus?.status === 'rejected' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h4 className="text-lg font-semibold text-red-800">Agreement Rejected ❌</h4>
                    <p className="text-red-700 mt-1">
                      Your agreement was rejected. Please download a new copy and resubmit.
                    </p>
                    <div className="mt-3 text-sm text-red-600">
                      <p><strong>Rejected:</strong> {agreementStatus.rejectedAt ? new Date(agreementStatus.rejectedAt).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Reason:</strong> {agreementStatus.rejectionReason || 'Please contact admin for details'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {(!agreementStatus || agreementStatus.status === 'rejected') && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="agreement-upload"
                  />
                  <label
                    htmlFor="agreement-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-1 text-sm font-medium">
                      {uploadedFile ? 'Replace Signed Agreement' : 'Upload Signed Agreement'}
                      <span className="text-red-500 ml-1">*</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
                  </label>
                  {uploadedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-green-700 font-medium">Selected: {uploadedFile.name}</span>
                      </div>
                      <p className="text-green-600 text-xs mt-1">
                        Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium">Upload Requirements</p>
                      <p className="text-amber-700 text-sm mt-1">
                        Please ensure the agreement is properly signed and stamped before uploading. 
                        Only PDF files are accepted.
                      </p>
                    </div>
                  </div>
                </div>

                {uploadedFile && (
                  <button
                    onClick={handleUploadSignedAgreement}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Uploading Agreement...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Submit Signed Agreement
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agreement Process Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700 text-sm">Download the auto-generated service agreement</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700 text-sm">Print and sign the agreement with company stamp</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700 text-sm">Scan the signed agreement as PDF</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                  <span className="text-gray-700 text-sm">Upload the signed PDF through this page</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</div>
                  <span className="text-gray-700 text-sm">Wait for admin approval (24-48 hours)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</div>
                  <span className="text-gray-700 text-sm">Full platform access activated</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contract Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contract Duration</p>
                    <p className="font-medium text-gray-900">
                      {operatorPayment?.planName === 'Monthly Plan' ? '1 Month' : '1 Year'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Membership Plan</p>
                    <p className="font-medium text-gray-900">{operatorPayment?.planName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Commission Rate</p>
                    <p className="font-medium text-green-600">0% (Zero Commission)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Service Provider</p>
                    <p className="font-medium text-gray-900">JETUP LTD (UK)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contract Number</p>
                    <p className="font-medium text-gray-900">JETUP-{user?.operatorId}-{new Date().getFullYear()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contract Date</p>
                    <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Operator Name</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Operator ID</p>
                    <p className="font-medium text-blue-600">{user?.operatorId}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Amount</p>
                    <p className="font-medium text-gray-900">{operatorPayment?.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Preview Modal */}
      {showPreviewModal && hasAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Service Agreement Preview</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900">JETUP LTD (UK)</h4>
                  <h5 className="text-lg font-bold text-red-600 mt-2">HİZMET SÖZLEŞMESİ</h5>
                  <p className="text-sm text-gray-600 mt-2">
                    Sözleşme No: JETUP-{user?.operatorId}-{new Date().getFullYear()}
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="bg-white p-4 rounded border-l-4 border-blue-600">
                    <h6 className="font-bold text-gray-900 mb-2">SERVICE PROVIDER</h6>
                    <p>JETUP LTD (UK)</p>
                    <p>27 Old Gloucester Street, London, WC1N 3AX</p>
                    <p>support@jetup.aero</p>
                  </div>

                  <div className="bg-white p-4 rounded border-l-4 border-green-600">
                    <h6 className="font-bold text-gray-900 mb-2">SERVICE RECIPIENT</h6>
                    <p>{user?.name}</p>
                    <p>Operator ID: {user?.operatorId}</p>
                    <p>{user?.email}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded">
                    <h6 className="font-bold text-gray-900 mb-2">AGREEMENT DETAILS</h6>
                    <p><strong>Service Duration:</strong> {operatorPayment?.planName?.includes('Monthly') ? '1 (one) month' : '1 (one) year'}</p>
                    <p><strong>Plan:</strong> {operatorPayment?.planName}</p>
                    <p><strong>Amount:</strong> {operatorPayment?.amount}</p>
                    <p><strong>Commission:</strong> 0%</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    generateServiceAgreementPDF();
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Full PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Agreements;
