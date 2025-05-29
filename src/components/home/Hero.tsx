'use client';

import Link from 'next/link';
import TalentCarousel from '@/components/home/TalentCarousel';
import { 
  UserCircle, UserRound, UserSearch,
  MailOpen, MessageSquareText, Brain, Code2, Lightbulb, Rocket, Target,
  Layers2
} from 'lucide-react';

export default function Hero() {
  return (
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
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <UserRound className="absolute top-[10%] left-[10%] w-10 h-10 hidden sm:hidden md:block md:w-8 md:h-8 text-indigo-400 opacity-80 transform -rotate-15 transition-opacity duration-300" />
        <Rocket className="absolute top-[5%] left-[25%] w-10 h-10 hidden sm:hidden md:block md:w-8 md:h-8 text-purple-400 opacity-80 transform rotate-30 transition-opacity duration-300" />
        <Target className="absolute top-[0%] right-[35%] w-10 h-10 hidden sm:hidden md:block md:w-8 md:h-8 text-fuchsia-400 opacity-80 transform -rotate-45 transition-opacity duration-300" />
        <MessageSquareText className="absolute top-[13%] left-[25%] w-10 h-10 hidden sm:hidden md:block md:w-8 md:h-8 text-violet-400 opacity-80 transform rotate-15 transition-opacity duration-300" />
        <Brain className="absolute top-[25%] left-[15%] w-8 h-8 hidden sm:hidden md:block md:w-6 md:h-6 text-indigo-300 opacity-80 transform -rotate-0 transition-opacity duration-300" />
        <Code2 className="absolute top-[35%] left-[25%] w-8 h-8 hidden sm:hidden md:block md:w-6 md:h-6 text-purple-300 opacity-80 transform rotate-0 transition-opacity duration-300" />
        <Lightbulb className="absolute top-[18%] right-[20%] w-12 h-12 hidden sm:hidden md:block md:w-6 md:h-6 text-fuchsia-300 opacity-80 transform -rotate-45 transition-opacity duration-300" />
        <MailOpen className="absolute top-[25%] right-[15%] w-9 h-9 hidden sm:hidden md:block md:w-7 md:h-7 text-violet-300 opacity-80 transform rotate-25 transition-opacity duration-300" />
        <Layers2 className="absolute top-[5%] left-[40%] w-6 h-6 hidden sm:hidden md:block md:w-4 md:h-4 text-indigo-500 opacity-80 transform -rotate-15 transition-opacity duration-300" />
        <UserSearch className="absolute top-[10%] right-[22%] w-8 h-8 hidden sm:hidden md:block md:w-6 md:h-6 text-purple-500 opacity-80 transform rotate-30 transition-opacity duration-300" />
        <UserCircle className="absolute top-[35%] right-[30%] w-8 h-8 hidden sm:hidden md:block md:w-6 md:h-6 text-fuchsia-500 opacity-80 transform -rotate-30 transition-opacity duration-300" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Always Know<br />Who&apos;s <span className="text-gradient-brand bg-clip-text text-transparent">On Deck</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Your personal rolodex of heavy hitters. Keep track of your professional network, their skills, and availability - all in one rapidly searchable database.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Link
              href="/profiles"
              className="rounded-md bg-gradient-primary hover:bg-gradient-primary-hover px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              Browse Contacts
            </Link>
            <Link
              href="/skills"
              className="text-sm font-semibold leading-6 text-gray-900 group"
            >
              Explore Skills <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
        
        {/* Talent Carousel */}
        <div className="mt-12">
          <TalentCarousel />
        </div>
      </div>
    </div>
  );
} 