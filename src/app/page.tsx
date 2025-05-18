import Link from 'next/link';
import TalentCarousel from '@/components/TalentCarousel';
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
      {/* Hero section */}
      <div className="relative pt-10">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Discover Your TalentDeck
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Connect with skilled professionals across your organization. Find the right talent for your projects and foster internal mobility.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link
                href="/profiles"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse Profiles
              </Link>
              <Link
                href="/skills"
                className="text-sm font-semibold leading-6 text-gray-900 group"
              >
                View Skills Directory <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-2">→</span>
              </Link>
            </div>
          </div>
          
          {/* Talent Carousel */}
          <div className="mt-12">
            <TalentCarousel />
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-16">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Internal Talent Marketplace</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to find the right talent
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            TalentDeck helps you discover and connect with internal talent across your organization. Find the perfect match for your projects and foster internal mobility.
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
