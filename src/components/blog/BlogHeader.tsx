'use client';

import { motion } from 'framer-motion';

interface BlogHeaderProps {
  title: string;
  description: string;
}

export default function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="text-center mb-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400"
      >
        {description}
      </motion.p>
    </div>
  );
} 