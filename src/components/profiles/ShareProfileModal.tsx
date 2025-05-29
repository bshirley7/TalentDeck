import { TalentProfile } from '@/types';
import { useState } from 'react';
import { EnvelopeIcon, DocumentArrowDownIcon, PrinterIcon, ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ShareProfileModalProps {
  profile: TalentProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareProfileModal({ profile, isOpen, onClose }: ShareProfileModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Convert image to base64 for embedding in HTML
  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      return '';
    }
  };

  // Generate initials as SVG for fallback
  const generateInitialsImage = (name: string): string => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const svg = `
      <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="60" fill="url(#gradient)" />
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const generateEmailHTML = async (profile: TalentProfile): Promise<string> => {
    const skillsByCategory = profile.skills?.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof profile.skills>) || {};

    // Get profile image as base64 or generate initials
    let profileImageData = '';
    if (profile.image) {
      profileImageData = await convertImageToBase64(profile.image);
    }
    if (!profileImageData) {
      profileImageData = generateInitialsImage(profile.name);
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - Professional Profile</title>
    <style>
        /* Email-safe CSS - inline styles preferred for better compatibility */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
            margin: 0;
            padding: 20px;
            max-width: 600px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%);
            color: white;
            text-align: center;
            padding: 30px 20px;
            position: relative;
        }
        
        .profile-image {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 20px auto;
            display: block;
            border: 3px solid rgba(255, 255, 255, 0.3);
        }
        
        .name {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
        }
        
        .title {
            font-size: 18px;
            margin: 0 0 4px 0;
            opacity: 0.9;
        }
        
        .department {
            font-size: 14px;
            opacity: 0.8;
            margin: 0;
        }
        
        .content {
            padding: 30px 20px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section:last-child {
            margin-bottom: 0;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .contact-grid {
            display: table;
            width: 100%;
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        
        .contact-row {
            display: table-row;
        }
        
        .contact-label {
            display: table-cell;
            font-weight: 600;
            color: #374151;
            padding: 4px 15px 4px 0;
            vertical-align: top;
            width: 80px;
        }
        
        .contact-value {
            display: table-cell;
            color: #6b7280;
            padding: 4px 0;
            vertical-align: top;
        }
        
        .bio {
            background: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #6366f1;
            margin: 0;
            color: #374151;
        }
        
        .skills-category {
            margin-bottom: 20px;
        }
        
        .skills-category:last-child {
            margin-bottom: 0;
        }
        
        .category-name {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 10px 0;
        }
        
        .skills-container {
            display: block;
        }
        
        .skill-tag {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            margin: 0 6px 6px 0;
            text-decoration: none;
        }
        
        .proficiency {
            background: rgba(255, 255, 255, 0.25);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            margin-left: 6px;
        }
        
        .rates-grid {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px;
        }
        
        .rates-row {
            display: table-row;
        }
        
        .rate-card {
            display: table-cell;
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            text-align: center;
            width: 33.33%;
        }
        
        .rate-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 4px 0;
        }
        
        .rate-value {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }
        
        .availability-status {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            text-decoration: none;
        }
        
        .footer {
            background: #f9fafb;
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }
        
        /* Dark mode support for email clients that support it */
        @media (prefers-color-scheme: dark) {
            .container {
                background: #1f2937 !important;
                color: #f9fafb !important;
            }
        }
        
        /* Print styles */
        @media print {
            body { padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${profileImageData}" alt="${profile.name}" class="profile-image" />
            <h1 class="name">${profile.name}</h1>
            <p class="title">${profile.title}</p>
            <p class="department">${profile.department}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">Contact Information</h2>
                <div class="contact-grid">
                    <div class="contact-row">
                        <div class="contact-label">Email:</div>
                        <div class="contact-value">${profile.contact.email}</div>
                    </div>
                    ${profile.contact.phone ? `
                    <div class="contact-row">
                        <div class="contact-label">Phone:</div>
                        <div class="contact-value">${profile.contact.phone}</div>
                    </div>
                    ` : ''}
                    ${profile.contact.location ? `
                    <div class="contact-row">
                        <div class="contact-label">Location:</div>
                        <div class="contact-value">${profile.contact.location}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${profile.bio ? `
            <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <p class="bio">${profile.bio}</p>
            </div>
            ` : ''}
            
            ${profile.skills && profile.skills.length > 0 ? `
            <div class="section">
                <h2 class="section-title">Skills & Expertise</h2>
                ${Object.entries(skillsByCategory).map(([category, skills]) => `
                    <div class="skills-category">
                        <h3 class="category-name">${category}</h3>
                        <div class="skills-container">
                            ${skills.map(skill => `
                                <span class="skill-tag">
                                    ${skill.name}
                                    <span class="proficiency">${skill.proficiency}</span>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="section">
                <h2 class="section-title">Rates & Availability</h2>
                <div class="contact-grid" style="margin-bottom: 20px;">
                    <div class="contact-row">
                        <div class="contact-label">Status:</div>
                        <div class="contact-value">
                            <span class="availability-status">${profile.availability.status}</span>
                        </div>
                    </div>
                    ${profile.availability.nextAvailable ? `
                    <div class="contact-row">
                        <div class="contact-label">Available:</div>
                        <div class="contact-value">${new Date(profile.availability.nextAvailable).toLocaleDateString()}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="rates-grid">
                    <div class="rates-row">
                        <div class="rate-card">
                            <p class="rate-label">Hourly Rate</p>
                            <p class="rate-value">$${profile.hourlyRate}/hr</p>
                        </div>
                        <div class="rate-card">
                            <p class="rate-label">Daily Rate</p>
                            <p class="rate-value">$${profile.dayRate}/day</p>
                        </div>
                        <div class="rate-card">
                            <p class="rate-label">Annual Salary</p>
                            <p class="rate-value">$${profile.yearlySalary?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | On Deck Professional Profiles</p>
            <p>This profile was shared from On Deck - Your Professional Rolodex</p>
        </div>
    </div>
</body>
</html>`;
  };

  const handleDownloadHTML = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = await generateEmailHTML(profile);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profile.name.replace(/\s+/g, '_')}_Profile.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating HTML:', error);
      alert('Failed to generate HTML download');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintProfile = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = await generateEmailHTML(profile);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.print();
          setIsGenerating(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating print version:', error);
      setIsGenerating(false);
    }
  };

  const handleCopyEmailHTML = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = await generateEmailHTML(profile);
      await navigator.clipboard.writeText(htmlContent);
      alert('Email HTML copied to clipboard! You can paste this into your email client.');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      alert('Failed to copy HTML to clipboard');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    const subject = encodeURIComponent(`Professional Profile: ${profile.name}`);
    const body = encodeURIComponent(`Hi,

I&apos;m sharing ${profile.name}&apos;s professional profile with you. Please find the details below:

Name: ${profile.name}
Title: ${profile.title}
Department: ${profile.department}
Email: ${profile.contact.email}
${profile.contact.phone ? `Phone: ${profile.contact.phone}` : ''}

Availability: ${profile.availability.status}
Hourly Rate: $${profile.hourlyRate}
Daily Rate: $${profile.dayRate}
Annual Salary: $${profile.yearlySalary?.toLocaleString()}

${profile.bio ? `Summary: ${profile.bio}` : ''}

${profile.skills && profile.skills.length > 0 ? `
Key Skills: ${profile.skills.slice(0, 10).map(skill => skill.name).join(', ')}${profile.skills.length > 10 ? '...' : ''}
` : ''}

Best regards,
On Deck`);

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    if (window.electron) {
      await window.electron.openExternal(mailtoLink);
    } else {
      window.location.href = mailtoLink;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Share Profile: {profile.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 mb-6">
              Choose how you'd like to share this profile:
            </p>
            
            <div className="space-y-3">
              {/* Send Email */}
              <button
                onClick={handleSendEmail}
                className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Send Email</div>
                  <div className="text-sm text-gray-500">Open your email client with a pre-formatted message</div>
                </div>
              </button>
              
              {/* Copy HTML */}
              <button
                onClick={handleCopyEmailHTML}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Copy HTML</div>
                  <div className="text-sm text-gray-500">Copy styled HTML to paste in rich email editors</div>
                </div>
              </button>
              
              {/* Print/PDF */}
              <button
                onClick={handlePrintProfile}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <PrinterIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Print/Save as PDF</div>
                  <div className="text-sm text-gray-500">Open print dialog to save as PDF or print</div>
                </div>
              </button>
              
              {/* Download HTML */}
              <button
                onClick={handleDownloadHTML}
                disabled={isGenerating}
                className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DocumentArrowDownIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Download HTML File</div>
                  <div className="text-sm text-gray-500">Save HTML file to attach to emails or share</div>
                </div>
              </button>
            </div>
            
            {isGenerating && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-600">Generating content...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 