import { useState } from 'react';

const applicationTypes = [
  'Type A',
  'Type B',
  'Type C',
  'Other',
];

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [applicationType, setApplicationType] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, cnic, phone, email, address, applicationType, description, attachments });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Registration Form</h1>
          <p className="text-gray-600 text-lg">Please fill out all required information below</p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2"></div>
          
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* CNIC Field */}
              <div className="group">
                <label htmlFor="cnic" className="block text-sm font-semibold text-gray-700 mb-2">
                  CNIC *
                </label>
                <div className="relative">
                  <input
                    id="cnic"
                    type="text"
                    value={cnic}
                    onChange={e => setCnic(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white"
                    placeholder="00000-0000000-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white"
                    placeholder="+92 300 0000000"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white"
                    placeholder="your.email@example.com"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Address Field - Full Width */}
              <div className="md:col-span-2 group">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white"
                    placeholder="Enter your complete address"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Application Type */}
              <div className="group">
                <label htmlFor="application-type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Application Type *
                </label>
                <div className="relative">
                  <select
                    id="application-type"
                    value={applicationType}
                    onChange={e => setApplicationType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select application type</option>
                    {applicationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Description Field */}
              <div className="md:col-span-2 group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-all duration-300 outline-none bg-gray-50 focus:bg-white resize-none"
                    placeholder="Please provide a detailed description of your application..."
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="relative">
                  <label htmlFor="file-upload" className="group cursor-pointer">
                    <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">Upload Attachments</p>
                          <p className="text-sm text-gray-500">Click to browse or drag and drop files here</p>
                        </div>
                      </div>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {attachments.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-2">Selected files:</p>
                    <div className="space-y-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-green-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Register Apsssplication</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">All fields marked with * are required</p>
        </div>
      </div>
    </div>
  );
}