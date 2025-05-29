'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  proficiency: string;
  category: string;
  id: string;
}

interface TalentCardProps {
  name: string;
  title: string;
  image: string;
  skills: Skill[];
}

const TalentCard = ({ name, title, image, skills }: TalentCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative w-72 h-96 bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="relative h-48 w-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            // If image fails to load, show initials
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const initials = name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
              const initialsDiv = document.createElement('div');
              initialsDiv.className = 'absolute inset-0 flex items-center justify-center text-4xl font-bold text-gradient-primary';
              initialsDiv.textContent = initials;
              parent.appendChild(initialsDiv);
            }
          }}
        />
      </div>
      
      <motion.div 
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{title}</p>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <motion.span
              key={skill.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="px-2 py-1 text-xs bg-gradient-primary text-white rounded-full hover:bg-gradient-primary-hover transition-all duration-200"
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TalentCard; 