import React, { useState } from 'react';
import { Search, Brain, ShieldCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingDots = () => {
  const dotVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { 
      opacity: [0, 1, 0],
      y: [0, -8, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="inline-flex gap-1.5 ml-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current"
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
};

const ScatterText = ({ text }) => {
  const [hoveredChars, setHoveredChars] = useState(new Set());

  const handleCharHover = (index) => {
    setHoveredChars(prev => new Set([...prev, index]));
  };

  return (
    <motion.div className="relative min-h-[4em]">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="relative inline-block cursor-default"
          animate={
            hoveredChars.has(i) 
              ? {
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 60,
                  rotate: Math.random() * 30 - 15,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0
                }
          }
          onHoverStart={() => handleCharHover(i)}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const LandingPageContent = ({ analysisData, onGetStartedClick, isLoading }) => {
  const [showInsight, setShowInsight] = useState(false);

 
  // Animation variants for scroll animations
  const manifestoVariants = {
    hidden: { 
      opacity: 0,
      rotateX: 8,
      y: 50,
      transformPerspective: 2000,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        type: "tween",
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };



  return (
    // Centering container - REMOVED px-4
    <div className="flex flex-col items-center justify-center py-2">
      {/* Container without specific background/shadow, only padding/width/rounding */}
      <div className="rounded-lg pt-8 pb-8 px-8 w-full max-w-6xl">

        {/* Informational content - Always visible */}
        {/* Welcome to WISE Section */}
        <div className="text-center space-y-12 mb-24">
          {/* Main heading */}
          <h2 className="text-8xl font-bold text-black tracking-tighter"> 
            <div className="font-body mt-8">
          The age of persuasion requires a new kind of
           </div>
            <span className="text-primary text-8xl font-black font-heading tracking-tighter">
            intelligence
           </span>
           </h2>
          
          {/* Subheading */}
          <h2 className="text-3xl font-semibold text-black tracking-tighter">
            We believe it's not about telling people what to think,<br />
            but showing them how to see.
            </h2> 

          {/* Start Here Button Section */}
          <div className="flex justify-center">
            {!analysisData && (
              <button
                onClick={onGetStartedClick}
                disabled={isLoading}
                className={`font-semibold text-md px-8 py-3 rounded-2xl shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent bg-primary text-primary-content hover:brightness-110 disabled:cursor-wait disabled:brightness-90 flex items-center`}
              >
                <span>Start Here</span>
                {isLoading && <LoadingDots />}
              </button>
            )}
          </div>
        </div>

        {/* START OF CARD SECTION */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {/* Analyze Content Card */}
          <div className="group bg-base-200 p-6 rounded-lg shadow-md border-l-4 border-l-info transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20">
              <div className="flex h-auto justify-center mb-4">
              <Search size={52} className="text-info transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-black transition-colors group-hover:text-info">Analyse</h3>
            <p className="text-black opacity-90 text-xl/relaxed text-center">
              Our Ai engine takes any text: news articles, social media posts, blogs and pinpoints persuasive tactics designed to influence you.
            </p>
          </div>

          {/* Understand Tactics Card */}
          <div className="group bg-base-200 p-6 rounded-lg shadow-md border-l-4 border-l-info transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20">
            <div className="flex justify-center mb-4">
              <Brain size={52} className="text-info transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-black transition-colors group-hover:text-info">Understand</h3>
            <p className="text-black opacity-90 text-xl/relaxed text-center">
              When does legitimate persuasion cross the line into manipulation? That's what WISE helps you understand.
            </p>
          </div>

          {/* Protect Yourself Card */}
          <div className="group bg-base-200 p-6 rounded-lg shadow-md border-l-4 border-l-info transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20">
            <div className="flex justify-center mb-4">
              <ShieldCheck size={52} className="text-info transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-black transition-colors group-hover:text-info">Protect</h3>
            <p className="text-black opacity-90 text-xl/relaxed text-center">
              We'll show you not only how to spot these harmful tactics, but how to become immune, and how to disarm them.
            </p>
          </div>
        </div>
      </div>
      {/* END OF FIRST MAX-WIDTH CONTAINER */}  

      {/* FULL WIDTH SECTION */}
      <div className="w-screen bg-primary py-16 mb-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-8xl font-bold font-body text-base-200 text-center tracking-tighter mb-12">
            <span className="group inline-block relative cursor-default">
              Clarity
              <span className="absolute bottom-0 left-0 w-full h-1 bg-info transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </span>
            <span className="mx-4">not</span>
            <span className="group inline-block relative cursor-default">
              censorship
              <span className="absolute bottom-0 left-0 w-full h-1 bg-info transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </span>
          </h2>
          <div className="text-3xl font-semibold text-base-200 tracking-tighter text-center space-y-8 leading-relaxed">
            <div className="group cursor-default transition-all duration-300 hover:scale-[1.02]">
              <p className="opacity-80 group-hover:opacity-100">
                We're drowning in persuasive content:<br />
                from political narratives to influencer echo chambers.
              </p>
            </div>
            <div className="group cursor-default transition-all duration-300 hover:scale-[1.02]">
              <p className="opacity-80 group-hover:opacity-100">
                Everyone is trying to win your attention,<br />
                your identity, your allegiance.
              </p>
            </div>
            <div className="group cursor-default transition-all duration-300 hover:scale-[1.02]">
              <p className="opacity-80 group-hover:opacity-100">
                And they're doing it with techniques that defy logic<br />
                and appeal straight to your fears, hopes, and biases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Text Scatter Section */}
      <div className="w-full max-w-6xl mx-auto mb-24 px-8">
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-base-200/30 p-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {!showInsight ? (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-4xl/tight font-bold text-black tracking-tighter space-y-1 leading-tight">
                  <ScatterText text="When you try to understand what's being said..." />
                  <ScatterText text="The meaning starts to slip through your fingers..." />
                  <ScatterText text="Until you're left wondering what's really true." />
                  <p className="mt-12 text-xl font-semibold text-info/80 tracking-normal">
                    Move your cursor over the text to see how meaning scatters.
                  </p>
                </div>
                <button
                  onClick={() => setShowInsight(true)}
                  className="mt-8 text-xl text-info underline underline-offset-4 decoration-2 decoration-dashed hover:decoration-solid transition-all duration-300"
                >
                  I see what you mean
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                <div className="text-4xl font-bold text-black tracking-tighter leading-tight">
                  <p>
                    This is how subtle manipulation works.
                    <span className="block mt-6 text-3xl font-semibold opacity-90">
                      The truth becomes harder to grasp as words shift their meaning just enough to mislead.
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setShowInsight(false)}
                  className="mt-8 text-xl text-info underline underline-offset-4 decoration-2 decoration-dashed hover:decoration-solid transition-all duration-300"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* How WISE Works Section - Moved above tactics cards */}
      <div className="w-full max-w-6xl mx-auto mb-24">
        <div className="relative">
          {/* Step Circles with Numbers and Dotted Lines */}
          <div className="flex justify-between items-start mb-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center text-4xl font-bold text-black mb-8">
                1
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Sign up for free</h3>
              <p className="text-center text-black/80 max-w-sm">
                No credit card is needed. Get access to our Analysis Engine and educational content.
              </p>
            </div>

            {/* Dotted Line 1-2 */}
            <div className="flex-grow border-t-4 border-dotted border-info mx-4 relative top-10"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center text-4xl font-bold text-black mb-8">
                2
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Configure your API Key</h3>
              <p className="text-center text-black/80 max-w-sm">
                Enter your Gemini API key which you can get for free, we'll show you how to get one if you need help.
              </p>
            </div>

            {/* Dotted Line 2-3 */}
            <div className="flex-grow border-t-4 border-dotted border-info mx-4 relative top-10"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 relative">
              <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center text-4xl font-bold text-black mb-8">
                3
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Start analyzing</h3>
              <p className="text-center text-black/80 max-w-sm">
                Upload your content and let our AI engine work its magic and give you a detailed report on the contents persuasive tactics and how to protect yourself.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EXAMPLES AND HOW IT WORKS SECTION */}
      <div className="w-full max-w-6xl mx-auto space-y-24 mb-24 px-8">
        {/* First Example Row - Card on Right */}
        <div className="flex items-center justify-between gap-12">
          {/* Text Content - Left */}
          <div className="flex-1 pr-8 group">
            <h3 className="text-3xl font-bold text-black mb-4 transition-colors duration-300 group-hover:text-info">Spot manipulation tactics in real-time</h3>
            <p className="text-xl text-black/80 transition-opacity duration-300 group-hover:opacity-100">
              Our AI engine analyzes content in real-time, identifying persuasive tactics and manipulation attempts. 
              Get instant feedback on the intent behind the messages you encounter.
            </p>
          </div>
          
          {/* Example 1: Blatant Card - Right */}
          <div className="w-[450px]">
            <div className="group bg-base-200/50 border border-base-300 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20 relative">
             <div className="p-6">
                {/* Pill label */}
                <span className="absolute top-4 right-4 inline-block bg-error text-error-content px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Blatant Manipulation
                </span>
                {/* Content */}
               <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300" role="img" aria-label="Assertion Icon">📢</span>
                  <div>
                    <h4 className="text-lg font-bold text-base-content">Assertion</h4>
                    <p className="text-sm font-medium text-left pb-4 text-base-content/70">Logical Fallacies</p>
                  </div>
               </div>
                <p className="text-base-content/80 pb-4 mb-3 italic text-sm">
                  "...frankly I thought to myself Britain is broken and then I couldn't help it but if Britain is broken then logically Britain needs Reform..."
               </p>
                <div className="bg-info/5 border-l-4 border-info/40 p-4 rounded-lg mt-4 transition-all duration-300 group-hover:border-info/60 group-hover:bg-info/10">
                  <h5 className="font-semibold text-left text-info/80 mb-1 text-sm">YOUR DEFENSE</h5>
                  <p className="text-left text-sm text-base-content/90">
                   Demand evidence. Ask "How do you know that?" or "What proof is there?". Distinguish opinions from facts.
                 </p>
               </div>
             </div>
           </div>
          </div>
        </div>

        {/* Second Example Row - Card on Left */}
        <div className="flex items-center justify-between gap-12">
          {/* Example 2: Borderline Card - Left */}
          <div className="w-[450px]">
            <div className="group bg-base-200/50 border border-base-300 rounded-lg shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-info/20 relative">
             <div className="p-6">
                {/* Pill label */}
                <span className="absolute top-4 right-4 inline-block bg-warning text-warning-content px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Borderline Manipulation
                </span>
                {/* Content */}
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300" role="img" aria-label="Fear Icon">😨</span>
                   <div>
                    <h4 className="text-lg font-bold text-base-content">Appeal to Fear</h4>
                    <p className="text-sm font-medium text-left pb-4 text-base-content/70">Emotional Manipulation</p>
                   </div>
               </div>
                <p className="text-base-content/80 pb-4 mb-3 italic text-sm">
                 "In today's fast-paced world, our health is constantly under attack..."
               </p>
                <div className="bg-info/5 border-l-4 border-info/40 p-4 rounded-lg mt-4 transition-all duration-300 group-hover:border-info/60 group-hover:bg-info/10">
                  <h5 className="font-semibold text-left text-info/80 mb-1 text-sm">YOUR DEFENSE</h5>
                  <p className="text-left text-sm text-base-content/90">
                   Question whether the severity of health threats is being exaggerated. Seek balanced information. What is the actual evidence?
                 </p>
               </div>
             </div>
           </div>
        </div>

          {/* Text Content - Right */}
          <div className="flex-1 pl-8 group">
            <h3 className="text-3xl font-bold text-black mb-4 transition-colors duration-300 group-hover:text-info">Learn effective defense strategies</h3>
            <p className="text-xl text-black/80 transition-opacity duration-300 group-hover:opacity-100">
              Each identified tactic comes with clear, actionable defense strategies. 
              Build your resilience against manipulation by understanding how to counter these techniques effectively.
            </p>
          </div>
        </div>
      </div>
      {/* End of main flex container */}

      {/* WISE Manifesto Section */}
      <motion.div 
        className="w-full py-24 mt-24 relative overflow-hidden bg-gradient-to-b from-base-200/80 via-base-200/50 to-base-200/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        variants={manifestoVariants}
      >
        {/* Enhanced shadow layers */}
        <div className="absolute inset-0 shadow-[inset_0_4px_30px_rgba(0,0,0,0.08)]"></div>
        <div className="absolute inset-0 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)]"></div>
        
        <div className="max-w-6xl mx-auto px-8 relative">
          <div className="relative backdrop-blur-[2px]">
            <h2 className="text-6xl font-bold text-center mb-16">
              <span className="text-primary font-title">WISE</span> Manifesto
            </h2>

            {/* Core Statement */}
            <div className="text-2xl font-medium text-center mb-16 max-w-4xl mx-auto leading-relaxed">
              <p className="group cursor-default transition-all duration-300 hover:scale-[1.02]">
                WISE shines a light on hidden persuasion in everyday texts. It shows you how writers and speakers might be trying to influence you—through emotional appeals, identity framing, logical shortcuts, and psychological techniques—and gives you simple, practical ways to stay clear-headed.
              </p>
            </div>

            {/* Key Principles Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group bg-white/50 p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm">
                <p className="text-xl font-semibold mb-3 text-primary">We don't just label 'good' or 'bad'.</p>
                <p className="text-lg opacity-80 group-hover:opacity-100">We add nuance to help you understand the full picture.</p>
              </div>
              <div className="group bg-white/50 p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm">
                <p className="text-xl font-semibold mb-3 text-primary">We help you spot influence attempts.</p>
                <p className="text-lg opacity-80 group-hover:opacity-100">We reveal what's happening beneath the words, then you can decide.</p>
            </div>
              <div className="group bg-white/50 p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm">
                <p className="text-xl font-semibold mb-3 text-primary">We empower clear thinking.</p>
                <p className="text-lg opacity-80 group-hover:opacity-100">Think of it as your personal decoder for today's information overload.</p>
              </div>
            </div>

            {/* Origin Story */}
            <div className="bg-primary/5 p-12 rounded-2xl border border-primary/10 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-8 text-center">Why I Created WISE</h3>
              <div className="space-y-6 max-w-3xl mx-auto">
                <p className="text-xl leading-relaxed group cursor-default transition-all duration-300 hover:scale-[1.01]">
                  I built WISE because I've seen what happens when good people are gradually guided into belief systems they didn't consciously choose. I've experienced being influenced by sophisticated persuasion techniques without realizing it was happening.
                </p>
                <p className="text-xl leading-relaxed group cursor-default transition-all duration-300 hover:scale-[1.01]">
                  I created what I wished existed when I needed it most.
                </p>
                <p className="text-xl leading-relaxed group cursor-default transition-all duration-300 hover:scale-[1.01]">
                  WISE helps you see the strategies behind the message—like having X-ray vision for persuasion techniques.
                </p>
              </div>
            </div>

            {/* Final Statement */}
            <div className="mt-16 text-center">
              <p className="text-2xl font-semibold text-primary mb-4">Our Promise</p>
              <p className="text-3xl font-light max-w-3xl mx-auto group cursor-default transition-all duration-300 hover:scale-[1.02]">
                WISE isn't about profit margins or user growth. It's about helping people think more clearly in a noisy world.
                <span className="block mt-4 font-normal">
                  Because everyone deserves to see how persuasion works before deciding what to believe.
                </span>
              </p>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

LandingPageContent.propTypes = {
  analysisData: PropTypes.shape({
    metadata: PropTypes.shape({
      confidenceScore: PropTypes.number
    })
  }),
  onGetStartedClick: PropTypes.func.isRequired
};

LandingPageContent.defaultProps = {
  analysisData: null
};

export default LandingPageContent; 