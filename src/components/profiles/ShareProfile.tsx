import { TalentProfile } from '@/types';
import { useState } from 'react';
import { EnvelopeIcon, DocumentArrowDownIcon, PrinterIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface ShareProfileProps {
  profile: TalentProfile;
}

export function ShareProfile({ profile }: ShareProfileProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmailHTML = (profile: TalentProfile): string => {
    const skillsByCategory = profile.skills?.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof profile.skills>) || {};

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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
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
            <p>Generated on ${new Date().toLocaleDateString()} | TalentDeck Professional Profiles</p>
            <p>This profile was shared from TalentDeck - Internal Talent Management System</p>
        </div>
    </div>
</body>
</html>`;
  };

  const handleDownloadHTML = () => {
    const htmlContent = generateEmailHTML(profile);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_Profile.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintProfile = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = generateEmailHTML(profile);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.print();
          setIsGenerating(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error generating print version:', error);
      setIsGenerating(false);
    }
  };

  const handleCopyEmailHTML = async () => {
    try {
      const htmlContent = generateEmailHTML(profile);
      await navigator.clipboard.writeText(htmlContent);
      alert('Email HTML copied to clipboard! You can paste this into your email client.');
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      alert('Failed to copy HTML to clipboard');
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Professional Profile: ${profile.name}`);
    const body = encodeURIComponent(`Hi,

I'm sharing ${profile.name}'s professional profile with you. Please find the details below:

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
TalentDeck System`);

    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleSendEmail}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-primary rounded-md hover:bg-gradient-primary-hover transition-colors"
      >
        <EnvelopeIcon className="h-4 w-4" />
        Send Email
      </button>
      
      <button
        onClick={handleCopyEmailHTML}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <ClipboardDocumentIcon className="h-4 w-4" />
        Copy HTML
      </button>
      
      <button
        onClick={handlePrintProfile}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <PrinterIcon className="h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Print/PDF'}
      </button>
      
      <button
        onClick={handleDownloadHTML}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <DocumentArrowDownIcon className="h-4 w-4" />
        Download
      </button>
    </div>
  );
} 