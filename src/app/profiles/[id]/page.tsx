'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProfile } from '@/lib/actions';
import { TalentProfile } from '@/types';
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
  Dribbble
} from 'lucide-react';

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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {profile.image ? (
                <div className="relative w-24 h-24">
                  <Image
                    src={profile.image}
                    alt={`${profile.name}'s profile picture`}
                    fill
                    className="rounded-full object-cover"
                    sizes="(max-width: 96px) 100vw, 96px"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gray-200');
                        parent.classList.add('flex');
                        parent.classList.add('items-center');
                        parent.classList.add('justify-center');
                        const fallback = document.createElement('span');
                        fallback.className = 'text-2xl font-bold text-gray-500';
                        fallback.textContent = profile.name.split(' ').map(n => n[0]).join('');
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-lg text-gray-600">{profile.title}</p>
              <p className="text-sm text-gray-500">{profile.department}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ${profile.hourlyRate}/hour
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Location & Experience */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Location & Experience</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {profile.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Years of Experience:</span> {profile.yearsOfExperience} years
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {profile.contact.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {profile.contact.phone}
                  </p>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Social Profiles</h3>
                  <div className="flex flex-wrap gap-4">
                    {profile.contact.linkedin && (
                      <a
                        href={`https://${profile.contact.linkedin}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    {profile.contact.github && (
                      <a
                        href={`https://${profile.contact.github}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub Profile"
                      >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    )}
                    {profile.contact.twitter && (
                      <a
                        href={`https://${profile.contact.twitter}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Twitter Profile"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    {profile.contact.facebook && (
                      <a
                        href={`https://${profile.contact.facebook}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Facebook Profile"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                      </a>
                    )}
                    {profile.contact.instagram && (
                      <a
                        href={`https://${profile.contact.instagram}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Instagram Profile"
                      >
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                      </a>
                    )}
                    {profile.contact.youtube && (
                      <a
                        href={`https://${profile.contact.youtube}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube Channel"
                      >
                        <Youtube className="h-5 w-5" />
                        <span className="sr-only">YouTube</span>
                      </a>
                    )}
                    {profile.contact.dribbble && (
                      <a
                        href={`https://${profile.contact.dribbble}`}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Dribbble Profile"
                      >
                        <Dribbble className="h-5 w-5" />
                        <span className="sr-only">Dribbble</span>
                      </a>
                    )}
                    {profile.contact.website && (
                      <a
                        href={profile.contact.website}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Personal Website"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
                <div className="space-y-4">
                  {Object.entries(
                    profile.skills.reduce((acc, skill) => {
                      if (!acc[skill.category]) {
                        acc[skill.category] = [];
                      }
                      acc[skill.category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof profile.skills>)
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {skill.name}
                            <span className="ml-1 text-blue-600">({skill.proficiency})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Availability</h2>
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      profile.availability.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : profile.availability.status === 'Busy'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profile.availability.status}
                  </span>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Next Available:</span> {profile.availability.nextAvailable}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Preferred Hours:</span> {profile.availability.preferredHours}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Timezone:</span> {profile.availability.timezone}
                  </p>
                </div>
              </div>

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={`${edu.degree}-${edu.institution}-${edu.year}`} className="border-l-4 border-indigo-400 pl-4">
                        <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
                  <div className="space-y-4">
                    {profile.certifications.map((cert) => (
                      <div key={`${cert.name}-${cert.issuer}-${cert.year}`} className="border-l-4 border-indigo-400 pl-4">
                        <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="px-4 py-4 sm:px-6 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <Link
              href={`/profiles/${profile.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}