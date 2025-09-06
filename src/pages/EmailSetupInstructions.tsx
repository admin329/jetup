import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Settings, Copy, ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailSetupInstructions: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const setupSteps = [
    {
      title: "EmailJS Hesabı Oluştur",
      description: "EmailJS'e ücretsiz kayıt ol",
      action: "https://www.emailjs.com/",
      actionText: "EmailJS'e Git"
    },
    {
      title: "Email Service Ekle",
      description: "Gmail, Outlook veya başka email servisinizi bağlayın",
      code: "Service ID: service_jetup"
    },
    {
      title: "Email Template Oluştur",
      description: "Onay email şablonunu oluşturun",
      code: `Template ID: template_confirmation

Şablon İçeriği:
Subject: Confirm your JETUP account

Hello {{to_name}},

Welcome to JETUP! Please click the link below to confirm your email address and activate your {{user_role}} account:

{{confirmation_link}}

If you didn't create this account, please ignore this email.

Best regards,
JETUP Team`
    },
    {
      title: "Public Key Al",
      description: "EmailJS dashboard'dan public key'inizi kopyalayın"
    },
    {
      title: "Konfigürasyonu Güncelle",
      description: "src/services/emailService.ts dosyasındaki değerleri güncelleyin",
      code: `const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id'; 
const EMAILJS_PUBLIC_KEY = 'your_public_key';`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            EmailJS Setup Instructions
          </h1>
          <p className="text-xl text-gray-600">
            Follow these steps to enable email confirmation system
          </p>
        </motion.div>

        <div className="space-y-8">
          {setupSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  {step.action && (
                    <a
                      href={step.action}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {step.actionText}
                    </a>
                  )}
                  
                  {step.code && (
                    <div className="mt-4">
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                          {step.code}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(step.code, index)}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedStep === index ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">Setup Complete!</h3>
              <p className="text-green-700 mt-1">
                Once you've completed these steps, the email confirmation system will be fully functional.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailSetupInstructions;