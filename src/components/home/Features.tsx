import Link from 'next/link';
import { 
  UserGroupIcon, 
  BriefcaseIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Smart Contact Management',
    description: 'Keep your professional network organized with detailed profiles, skills tracking, and project history. Never lose track of who can do what.',
    icon: UserGroupIcon,
    href: '/profiles',
  },
  {
    name: 'Project Team Building',
    description: 'Quickly assemble the perfect team for any project by matching skills and past performance. Make informed decisions with comprehensive profiles.',
    icon: BriefcaseIcon,
    href: '/projects',
  },
  {
    name: 'Skills & Expertise Tracking',
    description: 'Maintain an up-to-date directory of skills and expertise across your network. Track proficiency levels, certifications, and specializations.',
    icon: SparklesIcon,
    href: '/skills',
  }
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">Powerful Network Management</h2>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your Professional Rolodex
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          On Deck transforms how you manage your professional network. Keep track of skills, project history, and team compositions in one powerful platform. Build better teams, faster.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                {feature.name}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">{feature.description}</p>
                <p className="mt-6">
                  <Link href={feature.href} className="text-sm font-semibold leading-6 text-indigo-600 hover:text-gradient-brand-hover transition-all duration-300">
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
} 