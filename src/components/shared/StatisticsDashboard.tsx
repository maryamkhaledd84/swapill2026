import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface StatItemProps {
  value: number;
  suffix?: string;
  title: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, suffix = '', title, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: "easeOut"
      }}
      className="flex flex-col items-center text-center"
    >
      <div className="text-5xl md:text-6xl font-bold text-violet-500 mb-3">
        {inView && (
          <CountUp
            start={0}
            end={value}
            duration={2.5}
            delay={delay}
            suffix={suffix}
            separator=","
          />
        )}
      </div>
      <div className="text-sm md:text-base uppercase tracking-wider text-gray-400 font-medium">
        {title}
      </div>
    </motion.div>
  );
};

export default function StatisticsDashboard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const statistics = [
    { value: 500, suffix: '+', title: 'Skills Exchanged', delay: 0 },
    { value: 1200, suffix: '+', title: 'Active Swappers', delay: 0.2 },
    { value: 3200, suffix: '+', title: 'Swaps Completed', delay: 0.4 },
    { value: 98, suffix: '%', title: 'Success Rate', delay: 0.6 },
  ];

  return (
    <section 
      ref={ref}
      className="bg-gray-950 py-32 md:py-36 relative overflow-hidden"
    >
      {/* Background gradient for subtle depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-950/50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main heading with lavender glow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative">
            <span className="relative">
              Swapill by the numbers
              {/* Subtle lavender glow effect */}
              <div className="absolute inset-0 blur-xl bg-violet-500/20 -z-10 scale-110" />
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of professionals already swapping skills and growing together
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statistics.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              title={stat.title}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
