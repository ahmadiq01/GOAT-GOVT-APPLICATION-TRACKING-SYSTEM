import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Government logo and styling constants
const GOV_COLORS = {
  primary: '#00ce5a',
  secondary: '#00a047',
  dark: '#013f1b',
  light: '#e8f8f0',
  text: '#424242',
  border: '#bdbdbd'
};

// Helper function to add government header
const addGovernmentHeader = (doc, title) => {
  try {
    // Add government logo/icon placeholder
    doc.setFillColor(parseInt(GOV_COLORS.primary.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.primary.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.primary.slice(5, 7), 16));
    doc.circle(20, 20, 8, 'F');
    
    // Add government title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(parseInt(GOV_COLORS.dark.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.dark.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.dark.slice(5, 7), 16));
    doc.text('Government of Pakistan', 40, 25);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Government Application Submission System', 40, 35);
    
    // Add application title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(parseInt(GOV_COLORS.primary.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.primary.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.primary.slice(5, 7), 16));
    doc.text(title, 40, 50);
    
    // Add line separator
    doc.setDrawColor(parseInt(GOV_COLORS.primary.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.primary.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.primary.slice(5, 7), 16));
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    
    return 70; // Return Y position for next content
  } catch (error) {
    console.error('Error adding government header:', error);
    return 70;
  }
};

// Helper function to add section header
const addSectionHeader = (doc, title, y) => {
  try {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(parseInt(GOV_COLORS.text.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.text.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.text.slice(5, 7), 16));
    doc.text(title, 20, y);
    
    // Add underline
    doc.setDrawColor(parseInt(GOV_COLORS.border.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.border.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.border.slice(5, 7), 16));
    doc.setLineWidth(0.2);
    doc.line(20, y + 2, 190, y + 2);
    
    return y + 10;
  } catch (error) {
    console.error('Error adding section header:', error);
    return y + 10;
  }
};

// Helper function to add field with label
const addField = (doc, label, value, x, y, maxWidth = 85) => {
  try {
    // Add label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(parseInt(GOV_COLORS.text.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.text.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.text.slice(5, 7), 16));
    doc.text(label + ':', x, y);
    
    // Add value
    doc.setFont('helvetica', 'normal');
    const displayValue = value || 'Not provided';
    
    // Handle long text with word wrapping
    const words = displayValue.split(' ');
    let line = '';
    let currentY = y + 5;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && i > 0) {
        doc.text(line, x + 5, currentY);
        line = words[i] + ' ';
        currentY += 5;
      } else {
        line = testLine;
      }
    }
    doc.text(line, x + 5, currentY);
    
    return currentY + 8;
  } catch (error) {
    console.error('Error adding field:', error);
    return y + 15;
  }
};

// Helper function to add attachments list
const addAttachmentsList = (doc, attachments, y) => {
  try {
    if (!attachments || attachments.length === 0) {
      return addField(doc, 'Attached Documents', 'No documents attached', 20, y);
    }
    
    // Add section header
    let currentY = addSectionHeader(doc, 'Attached Documents', y);
    
    // Add table for attachments
    const tableData = attachments.map((file, index) => [
      index + 1,
      file.originalName || 'Document',
      file.mimeType || 'Unknown',
      formatFileSize(file.size) || 'Unknown'
    ]);
    
    doc.autoTable({
      startY: currentY,
      head: [['#', 'Document Name', 'Type', 'Size']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [parseInt(GOV_COLORS.primary.slice(1, 3), 16), 
                    parseInt(GOV_COLORS.primary.slice(3, 5), 16), 
                    parseInt(GOV_COLORS.primary.slice(5, 7), 16)],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 }
      }
    });
    
    return doc.lastAutoTable.finalY + 10;
  } catch (error) {
    console.error('Error adding attachments list:', error);
    return y + 20;
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main function to generate application PDF
export const generateApplicationPDF = (applicationData, officers, applicationTypes) => {
  try {
    console.log('Starting PDF generation with data:', applicationData);
    console.log('Officers data:', officers);
    console.log('Application types data:', applicationTypes);
    
    const doc = new jsPDF();
    
    // Validate input data
    if (!applicationData) {
      throw new Error('Application data is required');
    }
    
    if (!officers || !Array.isArray(officers)) {
      console.warn('Officers data is missing or invalid');
    }
    
    if (!applicationTypes || !Array.isArray(applicationTypes)) {
      console.warn('Application types data is missing or invalid');
    }
    
    // Get application type and officer names
    const applicationType = applicationTypes ? applicationTypes.find(t => t._id === applicationData.applicationType) : null;
    const officer = officers ? officers.find(o => o._id === applicationData.officer) : null;
    
    console.log('Found application type:', applicationType);
    console.log('Found officer:', officer);
    
    // Add government header
    let currentY = addGovernmentHeader(doc, 'Application Submission Receipt');
    
    // Add application ID, tracking number and date
    currentY = addSectionHeader(doc, 'Application Information', currentY);
    currentY = addField(doc, 'Application ID', applicationData._id || 'Pending', 20, currentY);
    currentY = addField(doc, 'Tracking Number', applicationData.trackingNumber || 'Pending', 20, currentY);
    currentY = addField(doc, 'Submission Date', new Date().toLocaleDateString('en-GB'), 20, currentY);
    currentY = addField(doc, 'Application Type', applicationType?.name || 'Not selected', 20, currentY);
    currentY = addField(doc, 'Assigned Officer', officer ? `${officer.name} - ${officer.designation}` : 'Not assigned', 20, currentY);
    
    // Add personal information
    currentY = addSectionHeader(doc, 'Applicant Information', currentY);
    currentY = addField(doc, 'Full Name', applicationData.name, 20, currentY);
    currentY = addField(doc, 'CNIC Number', applicationData.cnic, 20, currentY);
    currentY = addField(doc, 'Mobile Number', applicationData.phone, 20, currentY);
    currentY = addField(doc, 'Email Address', applicationData.email, 20, currentY);
    currentY = addField(doc, 'Complete Address', applicationData.address, 20, currentY);
    
    // Add application description
    currentY = addSectionHeader(doc, 'Application Details', currentY);
    currentY = addField(doc, 'Description', applicationData.description, 20, currentY, 170);
    
    // Add attachments
    currentY = addAttachmentsList(doc, applicationData.attachments, currentY);
    
    // Add footer with government stamp
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(parseInt(GOV_COLORS.text.slice(1, 3), 16), 
                     parseInt(GOV_COLORS.text.slice(3, 5), 16), 
                     parseInt(GOV_COLORS.text.slice(5, 7), 16));
    doc.text('This is an official government document generated by the Government Application Submission System.', 20, pageHeight - 30);
    doc.text('For verification, please contact the relevant government department.', 20, pageHeight - 25);
    
    // Add timestamp
    doc.text(`Generated on: ${new Date().toLocaleString('en-GB')}`, 20, pageHeight - 20);
    
    console.log('PDF generation completed successfully');
    return doc;
  } catch (error) {
    console.error('Error in generateApplicationPDF:', error);
    throw error;
  }
};

// Function to generate and download PDF (Original method)
export const generateAndDownloadPDF = (applicationData, officers, applicationTypes) => {
  try {
    console.log('generateAndDownloadPDF called with original method');
    const doc = generateApplicationPDF(applicationData, officers, applicationTypes);
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const applicantName = applicationData.name ? applicationData.name.replace(/\s+/g, '_') : 'Application';
    const trackingNumber = applicationData.trackingNumber ? applicationData.trackingNumber.replace(/\s+/g, '_') : timestamp;
    const filename = `Government_Application_${applicantName}_${trackingNumber}.pdf`;
    
    console.log('Attempting to download PDF with filename:', filename);
    
    // Download the PDF using jsPDF's save method
    doc.save(filename);
    
    console.log('PDF download initiated successfully (original method)');
    return {
      success: true,
      filename: filename,
      message: 'PDF generated and downloaded successfully (original method)'
    };
  } catch (error) {
    console.error('Error in generateAndDownloadPDF (original method):', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF (original method)'
    };
  }
};

// Function to generate and download PDF (Alternative method - more reliable)
export const generateAndDownloadPDFAlternative = (applicationData, officers, applicationTypes) => {
  try {
    console.log('generateAndDownloadPDFAlternative called with alternative method');
    const doc = generateApplicationPDF(applicationData, officers, applicationTypes);
    
    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const applicantName = applicationData.name ? applicationData.name.replace(/\s+/g, '_') : 'Application';
    const trackingNumber = applicationData.trackingNumber ? applicationData.trackingNumber.replace(/\s+/g, '_') : timestamp;
    const filename = `Government_Application_${applicantName}_${trackingNumber}.pdf`;
    
    console.log('Attempting to download PDF with filename (alternative method):', filename);
    
    // Alternative method: Using blob and URL.createObjectURL
    const pdfBlob = doc.output('blob');
    console.log('PDF blob created:', pdfBlob);
    
    const url = window.URL.createObjectURL(pdfBlob);
    console.log('Blob URL created:', url);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    console.log('Download link added to DOM and clicking...');
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('Download link cleaned up');
    }, 100);
    
    console.log('PDF download initiated successfully (alternative method)');
    return {
      success: true,
      filename: filename,
      message: 'PDF generated and downloaded successfully (alternative method)'
    };
  } catch (error) {
    console.error('Error in generateAndDownloadPDFAlternative:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF (alternative method)'
    };
  }
};

// Function to generate PDF as blob (for preview or other uses)
export const generatePDFBlob = (applicationData, officers, applicationTypes) => {
  try {
    console.log('generatePDFBlob called');
    const doc = generateApplicationPDF(applicationData, officers, applicationTypes);
    const pdfBlob = doc.output('blob');
    
    console.log('PDF blob generated successfully');
    return {
      success: true,
      blob: pdfBlob,
      message: 'PDF generated successfully'
    };
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF'
    };
  }
};

// Function to generate PDF as data URL (for embedding or preview)
export const generatePDFDataURL = (applicationData, officers, applicationTypes) => {
  try {
    console.log('generatePDFDataURL called');
    const doc = generateApplicationPDF(applicationData, officers, applicationTypes);
    const pdfDataUrl = doc.output('dataurlstring');
    
    console.log('PDF data URL generated successfully');
    return {
      success: true,
      dataUrl: pdfDataUrl,
      message: 'PDF data URL generated successfully'
    };
  } catch (error) {
    console.error('Error generating PDF data URL:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to generate PDF data URL'
    };
  }
};

// Function to force download with user interaction
export const forceDownloadWithUserInteraction = (applicationData, officers, applicationTypes) => {
  try {
    console.log('forceDownloadWithUserInteraction called');
    
    // This function should be called from a user interaction event (click, etc.)
    const userInteracted = document.hasFocus() || document.visibilityState === 'visible';
    console.log('User interaction detected:', userInteracted);
    
    if (!userInteracted) {
      console.warn('No user interaction detected, download may be blocked');
    }
    
    // Try alternative method first, as it's more reliable
    let result = generateAndDownloadPDFAlternative(applicationData, officers, applicationTypes);
    
    if (!result.success) {
      console.log('Alternative method failed, trying original method...');
      result = generateAndDownloadPDF(applicationData, officers, applicationTypes);
    }
    
    return result;
  } catch (error) {
    console.error('Error in forceDownloadWithUserInteraction:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to force download with user interaction'
    };
  }
};