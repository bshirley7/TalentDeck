'use client';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/actions';
import { 
  TalentProfile, 
  ProfileSkill, 
  Availability
} from '@/types';
import Link from 'next/link';
import { 
  Linkedin, 
  Github, 
  Globe, 
  Mail, 
  Phone,
  Dribbble,
  ChevronLeft,
  Calendar,
  Clock,
  Building2,
  Briefcase,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/profiles/ShareButton';

// Add Electron dialog import
declare global {
  interface Window {
    electron?: {
      showMessageBox: (options: { type: string; message: string; buttons: string[] }) => Promise<{ response: number }>;
      openExternal: (url: string) => Promise<void>;
    };
  }
}

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const resolvedParams = await params;
        const data = await getProfile(resolvedParams.id as string);
        setProfile(data || null);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [params]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Profile Not Found</h1>
          <p className="mt-2 text-gray-600">The requested profile could not be found.</p>
          <Link
            href="/profiles"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 print:px-0 print:py-0">
      <div className="mb-8 print:hidden">
        <Link
          href="/profiles"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Profiles
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Profile Header, Skills, and Education */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 print:h-32 print:w-32">
                <Avatar className="h-full w-full">
                  <AvatarImage 
                    src={profile.image} 
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <div>
                    <h1 className="text-2xl font-bold print:text-3xl">{profile.name}</h1>
                    <p className="text-lg text-muted-foreground print:text-xl">{profile.title}</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{profile.department}</span>
                    </div>
                    {profile.contact.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{profile.contact.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            {/* Contact Information */}
            <div className="space-y-2">
              {profile.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${profile.contact.email}`} className="text-sm hover:underline">
                    {profile.contact.email}
                  </a>
                </div>
              )}
              {profile.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${profile.contact.phone}`} className="text-sm hover:underline">
                    {profile.contact.phone}
                  </a>
                </div>
              )}
              {profile.contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={profile.contact.website} className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                    {profile.contact.website}
                  </a>
                </div>
              )}
            </div>
            {/* Social Links */}
            <div className="space-y-2 mt-4">
              {profile.contact.social?.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${profile.contact.social.linkedin}`} className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                    {profile.contact.social.linkedin}
                  </a>
                </div>
              )}
              {profile.contact.social?.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${profile.contact.social.github}`} className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                    {profile.contact.social.github}
                  </a>
                </div>
              )}
              {profile.contact.social?.dribbble && (
                <div className="flex items-center gap-2">
                  <Dribbble className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${profile.contact.social.dribbble}`} className="text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                    {profile.contact.social.dribbble}
                  </a>
                </div>
              )}
            </div>
            <Separator className="my-6" />
            {/* About Section */}
            <div>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </div>
            <Separator className="my-6" />
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="default" 
                className="bg-gradient-primary hover:bg-gradient-primary-hover"
                onClick={async () => {
                  if (profile.contact.email) {
                    if (window.electron) {
                      await window.electron.openExternal(`mailto:${profile.contact.email}`);
                    } else {
                      window.location.href = `mailto:${profile.contact.email}`;
                    }
                  } else {
                    if (window.electron) {
                      await window.electron.showMessageBox({
                        type: 'info',
                        message: 'No email found for this profile.',
                        buttons: ['OK']
                      });
                    } else {
                      alert('No email found for this profile.');
                    }
                  }
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <ShareButton profile={profile} />
              <Link href={`/profiles/${profile.id}/edit`}>
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <SkillsSection skills={profile.skills} />
          <EducationSection education={profile.education} certifications={profile.certifications} />
        </div>

        {/* Right Column - Rate Card and Availability */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Rate Card</h2>
            <Table>
              <TableBody>
                {profile.hourlyRate && (
                  <TableRow>
                    <TableCell className="font-medium">Hourly Rate</TableCell>
                    <TableCell className="text-right">${profile.hourlyRate}/hr</TableCell>
                  </TableRow>
                )}
                {profile.dayRate && (
                  <TableRow>
                    <TableCell className="font-medium">Day Rate</TableCell>
                    <TableCell className="text-right">${profile.dayRate}/day</TableCell>
                  </TableRow>
                )}
                {profile.yearlySalary && (
                  <TableRow>
                    <TableCell className="font-medium">Yearly Salary</TableCell>
                    <TableCell className="text-right">${profile.yearlySalary.toLocaleString()}/year</TableCell>
                  </TableRow>
                )}
                {!profile.hourlyRate && !profile.dayRate && !profile.yearlySalary && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500">
                      No rate information available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <AvailabilitySection availability={profile.availability} />
        </div>
      </div>
    </div>
  );
}

const SkillsSection = ({ skills }: { skills: ProfileSkill[] }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, ProfileSkill[]>);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Skills & Expertise</h2>
        <Badge variant="outline">{skills.length} Skills</Badge>
      </div>
      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <TooltipProvider key={skill.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium hover:bg-gradient-primary hover:text-white transition-all duration-300 ease-in-out cursor-default group">
                        {skill.name}
                        <span className="ml-1 text-gray-500 group-hover:text-white/75 transition-colors duration-300 ease-in-out">({skill.proficiency})</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Proficiency Level: {skill.proficiency}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const EducationSection = ({ 
  education, 
  certifications 
}: { 
  education?: TalentProfile['education'];
  certifications?: TalentProfile['certifications'];
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Education & Certifications</h2>
        <Badge variant="outline">
          {(education?.length || 0) + (certifications?.length || 0)} Items
        </Badge>
      </div>
      <div className="space-y-6">
        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Education</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={`${edu.degree}-${edu.institution}`} className="relative pl-4 border-l-2 border-indigo-400">
                  <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-indigo-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.field}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Certifications</h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={`${cert.name}-${cert.issuer}`} className="relative pl-4 border-l-2 border-green-400">
                  <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-green-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">Issued by: {cert.issuer}</p>
                    <p className="text-xs text-gray-400">
                      Issued: {new Date(cert.date).toLocaleDateString()}
                      {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const AvailabilitySection = ({ availability }: { availability: Availability }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      case 'Away':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Availability</h2>
        <Badge variant="outline" className={getStatusColor(availability.status)}>
          {availability.status}
        </Badge>
      </div>
      <div className="space-y-6">
        {/* Status and Next Available */}
        <div className="flex items-center space-x-2">
          {availability.nextAvailable && (
            <span className="text-sm text-gray-500">
              Next Available: {new Date(availability.nextAvailable).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Preferences and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Preferences</h3>
            <div className="space-y-2">
              {availability.preferredHours && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{availability.preferredHours}</span>
                </div>
              )}
              {availability.timezone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span>{availability.timezone}</span>
                </div>
              )}
              {availability.bookingLeadTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{availability.bookingLeadTime} days lead time</span>
                </div>
              )}
            </div>
          </div>

          {availability.capacity && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Capacity</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{availability.capacity.weeklyHours} hours/week</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>Max {availability.capacity.maxConcurrentProjects} concurrent projects</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {availability.capacity.preferredProjectDuration.min} - {availability.capacity.preferredProjectDuration.max} days preferred duration
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Commitments */}
        {availability.currentCommitments && availability.currentCommitments.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Commitments</h3>
            <div className="space-y-4">
              {availability.currentCommitments.map((commitment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="font-medium">{commitment.projectName}</div>
                  <div className="text-sm text-gray-600">{commitment.role}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(commitment.startDate).toLocaleDateString()} - {new Date(commitment.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Commitment: {commitment.commitmentPercentage}%
                  </div>
                  {commitment.notes && (
                    <div className="text-sm text-gray-500 mt-2">
                      Notes: {commitment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Availability */}
        {availability.seasonalAvailability && availability.seasonalAvailability.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Seasonal Availability</h3>
            <div className="space-y-4">
              {availability.seasonalAvailability.map((season, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={season.status === 'Available' ? 'default' : 'secondary'}>
                      {season.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {season.notes && (
                    <div className="text-sm text-gray-500">
                      Notes: {season.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};