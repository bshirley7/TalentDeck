import Link from 'next/link';
import Hero from '@/components/Hero';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Talent Discovery',
    description: 'Find the right people for your projects with our advanced search and matching algorithms.',
    icon: UserGroupIcon,
    href: '/profiles',
  },
  {
    name: 'Skills Management',
    description: 'Track and manage skills across your organization with our comprehensive skills directory.',
    icon: ChartBarIcon,
    href: '/skills',
  },
  {
    name: 'Project Matching',
    description: 'Connect talent with projects based on skills, availability, and preferences.',
    icon: LightBulbIcon,
    href: '/projects',
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      <Hero />

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Talent at Your Fingertips</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your network&apos;s expertise, thoughtfully organized
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            TalentDeck brings together your entire talent landscape in one intuitive interface. Discover capabilities, make connections, and assemble the ideal team for any project.
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
                    <Link href={feature.href} className="text-sm font-semibold leading-6 text-indigo-600">
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
