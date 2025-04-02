'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProfile } from '@/lib/actions';
import { 
  TalentProfile, 
  ProfileSkill, 
  ProjectCommitment, 
  SeasonalAvailability,
  Availability 
} from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Globe, 
  Mail, 
  Phone,
  Dribbble,
  ChevronLeft,
  Calendar,
  Clock,
  Building2,
  Briefcase
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function ProfileDetailPage() {
  const params = useParams();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(params.id as string);
        setProfile(data || null);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [params.id]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/profiles"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profiles
        </Link>
      </div>

      {/* Profile Content with Value-Based Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={profile.image?.startsWith('/') ? profile.image : `/images/profiles/${profile.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                          alt={`${profile.name}'s profile picture`}
                        />
                        <AvatarFallback className="text-4xl">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={profile.image?.startsWith('/') ? profile.image : `/images/profiles/${profile.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                            alt={`${profile.name}'s profile picture`}
                          />
                          <AvatarFallback>
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{profile.name}</h4>
                          <p className="text-sm text-muted-foreground">{profile.title}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                      <Badge variant="secondary">{profile.department}</Badge>
                    </div>
                    <p className="text-lg text-gray-600">{profile.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{profile.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{profile.yearsOfExperience} years experience</span>
                      </div>
                    </div>

                    {/* Contact Information and Social Profiles */}
                    <div className="flex items-center space-x-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{profile.contact.email}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{profile.contact.phone}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <div className="flex items-center space-x-2">
                          {profile.contact.social?.linkedin && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Linkedin className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>LinkedIn Profile</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {profile.contact.social?.github && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Github className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>GitHub Profile</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {profile.contact.social?.twitter && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Twitter className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Twitter Profile</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {profile.contact.website && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Globe className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Personal Website</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profiles/${profile.id}/edit`}>
                          Edit Profile
                        </Link>
                      </Button>
                      <Button size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">About</h2>
                <Badge variant="outline">Overview</Badge>
              </div>
              <div className="space-y-3">
                {profile.bio && (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  {profile.location && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {profile.location}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Location</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {profile.yearsOfExperience && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {profile.yearsOfExperience} years
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Years of Experience</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <SkillsSection skills={profile.skills} />
          <EducationSection education={profile.education} certifications={profile.certifications} />
        </div>
        <div className="space-y-6">
          {/* Rate Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Rate Card</h3>
              <Badge variant="outline">USD</Badge>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Hourly</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">${profile.hourlyRate}</span>
                      <p className="text-xs text-gray-500">per hour</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Day Rate</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">${profile.dayRate}</span>
                      <p className="text-xs text-gray-500">per day</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Monthly</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">${(profile.hourlyRate * 160).toLocaleString()}</span>
                      <p className="text-xs text-gray-500">160 hours/month</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Yearly</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">${profile.yearlySalary.toLocaleString()}</span>
                      <p className="text-xs text-gray-500">per year</p>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-4 w-4 text-gray-400" />
                              <span>Project Rate</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="w-80">
                            <div className="space-y-2">
                              <p>Project rates are calculated based on duration and scope:</p>
                              <ul className="text-sm space-y-1">
                                <li>• Weekly: ${(profile.dayRate * 5).toLocaleString()}</li>
                                <li>• Monthly: ${(profile.dayRate * 20).toLocaleString()}</li>
                                <li>• Quarterly: ${(profile.dayRate * 60).toLocaleString()}</li>
                                <li>• Yearly: ${profile.yearlySalary.toLocaleString()}</li>
                              </ul>
                              {profile.projectRates?.discountPercentage && (
                                <p className="text-sm text-green-600">
                                  {profile.projectRates.discountPercentage}% discount for projects longer than {profile.projectRates.minimumDuration} days
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <span className="font-semibold">${(profile.dayRate * 5).toLocaleString()}</span>
                      <p className="text-xs text-gray-500">per week (5 days)</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Payment Terms</span>
              <Badge variant="secondary">Net 30</Badge>
            </div>
          </Card>
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
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
                      <Badge variant="secondary" className="cursor-default">
                        {skill.name}
                        <span className="ml-1 text-gray-500">({skill.proficiency})</span>
                      </Badge>
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
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