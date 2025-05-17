import React from 'react';
import { Globe, Phone, BookOpen, Mail } from 'lucide-react';

const resources = [
  {
    name: 'Full Fact',
    description: `The UK's independent fact-checking charity. They check claims made by politicians, public figures, and the media, providing clear, unbiased information to help people form their own conclusions. This aligns well with WISE's goal of demanding evidence.`,
    website: 'https://fullfact.org/',
    contact: 'Contact form available on their website.'
  },
  {
    name: 'Ofcom - Making Sense of Media',
    description: `The UK's communications regulator runs this initiative to improve media literacy among UK adults and children. They provide research, guides, and link to various educational resources tackling misinformation and online safety.`,
    website: 'https://www.ofcom.org.uk/research-and-data/media-literacy-research',
    contact: 'General Ofcom contact details are on their main website.'
  },
  {
    name: 'Action Fraud',
    description: `The UK's national reporting centre for fraud and cybercrime. Users can report scams and find information on different types of fraud and prevention advice. Useful for users who suspect they have been targeted by financial manipulation.`,
    website: 'https://www.actionfraud.police.uk/',
    phone: '0300 123 2040 (reporting line)'
  },
  {
    name: 'Citizens Advice',
    description: `Offers free, confidential, and impartial advice on a wide range of issues, including consumer rights, scams, and debt. Their consumer service helps people understand their rights and what to do if they feel misled or treated unfairly.`,
    website: 'https://www.citizensadvice.org.uk/',
    phone: '0808 223 1133 (Consumer Helpline), 0800 144 8848 (England), 0800 702 2020 (Wales)'
  },
  {
    name: 'Victim Support',
    description: `An independent charity supporting victims and witnesses of crime, including fraud and domestic abuse (which can involve coercive control/manipulation). They offer emotional and practical support, regardless of whether the crime was reported.`,
    website: 'https://www.victimsupport.org.uk/',
    phone: '08 08 16 89 111 (24/7 Supportline)'
  },
  {
    name: 'International Fact-Checking Network (IFCN) - Verified Signatories List',
    description: `While not a UK org itself, Poynter's IFCN maintains a list of fact-checking organisations globally that adhere to its code of principles. Users can check this list to find other credible fact-checkers relevant to international information.`,
    website: 'https://ifcncodeofprinciples.poynter.org/signatories',
  },
  {
    name: 'National Literacy Trust - Critical Media Literacy',
    description: `Offers resources and programmes aimed at developing critical media literacy skills in young people, helping them analyse and evaluate online information. While aimed at schools, the principles are relevant for WISE users.`,
    website: 'https://literacytrust.org.uk/resources/?q=media+literacy',
    phone: '020 7587 1842'
  },
  {
    name: 'Stop! Think Fraud (Gov.uk Campaign)',
    description: `A UK government campaign providing accessible information on how to spot different types of fraud, protect oneself, and report it. Covers online, phone, email, and other common scam methods.`,
    website: 'https://www.gov.uk/government/news/stop-think-fraud',
  },
  {
    name: 'Refuge',
    description: `Provides specialist support for women and children experiencing domestic abuse, including coercive control. They run the National Domestic Abuse Helpline.`,
    website: 'https://www.refuge.org.uk/',
    phone: '0808 2000 247 (National Domestic Abuse Helpline - 24/7 Freephone)'
  },
  {
    name: "Men's Advice Line",
    description: `A confidential helpline offering advice and support for men experiencing domestic abuse from a partner or ex-partner.`,
    website: 'https://mensadviceline.org.uk/',
    phone: '0808 801 0327 (Freephone)'
  },
  {
    name: 'Galop',
    description: `An LGBT+ anti-abuse charity providing support for those who have experienced hate crime, domestic abuse, or sexual violence.`,
    website: 'https://galop.org.uk/',
    phone: '0800 999 5428 (National LGBT+ Domestic Abuse Helpline)'
  },
  {
    name: 'Get Safe Online',
    description: `Provides practical advice on protecting yourself, your finances, and your devices from online threats, including fraud, scams, and other forms of online manipulation.`,
    website: 'https://www.getsafeonline.org/',
    contact: 'Contact form available on their website.'
  },
  {
    name: 'The Cyber Helpline',
    description: `A free, confidential helpline for individuals who have been victims of cybercrime and online harm, offering assistance to understand, contain, and recover from attacks. Relevant for those manipulated through digital means.`,
    website: 'https://www.thecyberhelpline.com/',
    contact: 'Online chat and contact form available on their website.'
  },
];

const books = [
  {
    title: 'Free Your Mind: The new world of manipulation and how to resist it',
    description: 'A book by Laura Dodsworth and Patrick Fagan exploring modern manipulation techniques (from social media to subliminal messages) and offering strategies for resistance. Provides deeper reading for interested users.',
    availability: 'Available from major booksellers (e.g., HarperCollins UK, local libraries).'
  },
  {
    title: 'Influence: The Psychology of Persuasion',
    description: 'A classic book by Robert Cialdini outlining key principles of persuasion (reciprocity, commitment, social proof, authority, liking, scarcity). Understanding these helps in recognising when they might be used manipulatively.',
    availability: 'Widely available from booksellers and libraries.'
  }
];

const ResourceRow = ({ resource }) => (
  <div className="flex flex-col md:flex-row items-start gap-6 bg-base-200/60 rounded-xl shadow-sm p-6 mb-4 border border-base-300 text-left">
    <div className="flex flex-col items-start justify-start min-w-[48px] gap-4">
      <Globe className="text-info" size={28} />
      {resource.phone && <Phone className="text-info" size={24} />}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-xl font-bold text-base-content mb-3">{resource.name}</h3>
      <p className="text-base-content/80 mb-4">{resource.description}</p>
      <div className="flex flex-wrap gap-6 items-center text-base-content/80 text-sm">
        {resource.website && (
          <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline text-info font-semibold">
            <Globe size={18} /> Website
          </a>
        )}
        {resource.phone && (
          <span className="inline-flex items-center gap-2">
            <Phone size={16} /> {resource.phone}
          </span>
        )}
        {resource.contact && (
          <span className="inline-flex items-center gap-2">
            <Mail size={16} /> {resource.contact}
          </span>
        )}
      </div>
    </div>
  </div>
);

const ResourcesTabContent = () => (
  <div className="max-w-4xl mx-auto py-16 px-6 md:px-8 text-left">
    <h2 className="text-4xl font-bold mb-6 text-primary">Resources</h2>
    <p className="text-lg text-base-content/80 mb-12">A curated list of organisations, helplines, and further reading to help you stay informed, safe, and empowered.</p>
    <div className="space-y-4 mb-16">
      {resources.map((resource, idx) => (
        <ResourceRow resource={resource} key={resource.name + idx} />
      ))}
    </div>
    <div className="bg-base-200/80 border border-info/30 rounded-2xl shadow-md p-8">
      <div className="flex items-center mb-8">
        <BookOpen className="text-info mr-4" size={32} />
        <h3 className="text-2xl font-bold text-info">Book Resources</h3>
      </div>
      <div className="space-y-4">
        {books.map((book, idx) => (
          <div key={book.title + idx} className="bg-white/60 rounded-lg p-6 shadow-sm border border-base-300 text-left">
            <h4 className="text-lg font-semibold text-base-content mb-3 flex items-center gap-3">
              <BookOpen className="text-info flex-shrink-0" size={20} />
              {book.title}
            </h4>
            <p className="text-base-content/80 mb-3">{book.description}</p>
            <p className="text-base-content/60 italic text-sm">{book.availability}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ResourcesTabContent; 