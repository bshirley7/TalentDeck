'use client';

import { useRef, useState, useEffect } from 'react';
import TalentCard from './TalentCard';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  name: string;
  title: string;
  image: string;
  skills: Array<{
    name: string;
    proficiency: string;
    category: string;
    id: string;
  }>;
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Full-Stack Developer",
    image: "/images/profiles/sarah-chen.jpg",
    skills: [
      { name: "JavaScript", proficiency: "Expert", category: "Software Development", id: "s11" },
      { name: "React", proficiency: "Expert", category: "Software Development", id: "s12" },
      { name: "Node.js", proficiency: "Expert", category: "Software Development", id: "s13" },
      { name: "TypeScript", proficiency: "Advanced", category: "Software Development", id: "s14" },
      { name: "AWS", proficiency: "Advanced", category: "Software Development", id: "s15" }
    ]
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "Lead Data Scientist",
    image: "/images/profiles/marcus-rodriguez.jpg",
    skills: [
      { name: "Python", proficiency: "Expert", category: "Software Development", id: "s21" },
      { name: "Machine Learning", proficiency: "Expert", category: "Data Science", id: "s22" },
      { name: "TensorFlow", proficiency: "Expert", category: "Data Science", id: "s23" },
      { name: "SQL", proficiency: "Advanced", category: "Data Science", id: "s24" },
      { name: "Data Analysis", proficiency: "Advanced", category: "Data Science", id: "s25" }
    ]
  },
  {
    id: "3",
    name: "Emma Thompson",
    title: "UX/UI Designer",
    image: "/images/profiles/emma-thompson.jpg",
    skills: [
      { name: "Figma", proficiency: "Expert", category: "Design", id: "s31" },
      { name: "User Research", proficiency: "Expert", category: "Design", id: "s32" },
      { name: "Prototyping", proficiency: "Expert", category: "Design", id: "s33" },
      { name: "Design Systems", proficiency: "Advanced", category: "Design", id: "s34" },
      { name: "Accessibility", proficiency: "Advanced", category: "Design", id: "s35" }
    ]
  },
  {
    id: "4",
    name: "David Kim",
    title: "DevOps Engineer",
    image: "/images/profiles/david-kim.jpg",
    skills: [
      { name: "Kubernetes", proficiency: "Expert", category: "DevOps", id: "s41" },
      { name: "Docker", proficiency: "Expert", category: "DevOps", id: "s42" },
      { name: "AWS", proficiency: "Expert", category: "DevOps", id: "s43" },
      { name: "Terraform", proficiency: "Advanced", category: "DevOps", id: "s44" },
      { name: "CI/CD", proficiency: "Advanced", category: "DevOps", id: "s45" }
    ]
  }
];

const TalentCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        // Calculate card width including gap
        const card = containerRef.current.querySelector('.card-container');
        if (card) {
          setCardWidth(card.getBoundingClientRect().width + 32); // 32 is the gap-8 (2rem)
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate the total width of all cards
  const totalWidth = cardWidth * profiles.length;

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-transparent to-gray-50/50 py-12">
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left fade gradient */}
        <div className="absolute left-0 -top-4 -bottom-4 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        
        {/* Right fade gradient */}
        <div className="absolute right-0 -top-4 -bottom-4 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -totalWidth],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
              pause: isHovered,
            },
          }}
        >
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              className="flex-shrink-0 card-container"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
            >
              <TalentCard
                name={profile.name}
                title={profile.title}
                image={profile.image}
                skills={profile.skills}
              />
            </motion.div>
          ))}
          {/* Duplicate cards for seamless loop */}
          {profiles.map((profile, index) => (
            <motion.div
              key={`duplicate-${profile.id}`}
              className="flex-shrink-0 card-container"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                duration: 0.5,
                delay: (index + profiles.length) * 0.1,
                ease: "easeInOut"
              }}
            >
              <TalentCard
                name={profile.name}
                title={profile.title}
                image={profile.image}
                skills={profile.skills}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TalentCarousel; 