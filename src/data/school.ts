export const SCHOOL = {
  name: 'St. Ann Lifred Academy Schools',
  short: 'SALA',
  motto: 'Learn. Grow. Lead.',
  tagline: 'Where Every Child Learns, Grows and Leads.',
  address: 'Kiambu Road, Runda Gardens, Nairobi, Kenya',
  phone: '+254 712 480 115',
  altPhone: '+254 733 902 447',
  whatsapp: '254712480115',
  email: 'admissions@salaschools.ac.ke',
  hours: 'Mon – Fri, 7:30am – 5:00pm',
  est: 'Est. 2002 · Nairobi',
  location: 'Kiambu Road, Runda Gardens'
};

export const WHATSAPP_URL = (msg: string) =>
  `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(msg)}`;

export const IMAGES = {
  hero: "/f0725f19-1a55-4d88-b28e-2b4922171fcf.jpg",
  classroom: "/2d566343-4fbd-46a6-a8a3-b23f6d140fae.jpg",
  sports: "/94ae269b-4012-4ab0-aa87-a0490e2640db.jpg",
  library: "/b55d9617-e5d4-4353-a210-302c11ebf49a.jpg",
  arts: "/4afa8433-c5bd-4890-a728-63ad60032b1e.jpg"
};

export const PUBLIC_NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Campus', to: '/campus' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Contact', to: '/contact' }
];

export const FOOTER_NAV = [
  { label: 'School Life', to: '/school-life' },
  { label: 'News & Events', to: '/news' },
  { label: 'Academics', to: '/academics' }
];

export const MARQUEE_ITEMS = [
  'Playgroup to Grade 9',
  'CBC & Montessori-inspired early years',
  'Music from Grade 1',
  'Gated 6-acre campus',
  'Personalised learning profiles',
  '14 transport routes across Nairobi',
  'Learn. Grow. Lead.',
  'Parents in the loop every week'
];

export const HIGHLIGHTS = [
  { value: '24', label: 'Years of educational excellence' },
  { value: '1,148', label: 'Learners from Playgroup to Grade 9' },
  { value: '86', label: 'Qualified teachers & support staff' },
  { value: '31', label: 'Clubs, sports & co-curricular activities' }
];

export const CAMPUS_STATS = [
  { value: '6', label: 'Acres of gated campus' },
  { value: '1:18', label: 'Teacher ratio in early years' },
  { value: '14', label: 'Nairobi transport routes' },
  { value: '24', label: 'Hour on-site security' }
];

export const WHY_SALA = [
  {
    title: 'Competency-based teaching',
    body: 'Our CBC delivery is designed around mastery, not memorisation — every learner is assessed on what they can actually do.',
    icon: 'GraduationCap'
  },
  {
    title: 'Experienced teachers',
    body: 'TSC-registered teachers with an average of 11 years in the classroom, supported by continuous professional development.',
    icon: 'Users'
  },
  {
    title: 'A safe, secure campus',
    body: 'Gated 6-acre campus, 24-hour security, a full-time school nurse and verified transport across Nairobi.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Personalised learning',
    body: 'Each learner has a live strengths and support profile that shapes their weekly practice and teacher attention.',
    icon: 'Target'
  },
  {
    title: 'Character & leadership',
    body: 'Weekly values lessons, house captains and service projects build children who lead with integrity.',
    icon: 'Heart'
  },
  {
    title: 'Parents in the loop',
    body: 'Live attendance, results, assignments and fees in the Parent Portal — no more waiting for the end of term.',
    icon: 'MessageSquare'
  }
];

export type Program = {
  slug: string;
  name: string;
  short: string;
  ages: string;
  stage: string;
  blurb: string;
  approach: string;
  subjects: string[];
  activities: string[];
  image: string;
  icon: string;
  highlights: string[];
};

export const PROGRAMS: Program[] = [
  {
    slug: 'playgroup',
    name: 'Playgroup',
    short: 'Playgroup',
    ages: 'Ages 2 – 3',
    stage: 'Early Years',
    blurb: 'A gentle first step into structured play, social skills and routine — in a warm, home-like setting where every child is known by name.',
    approach: 'Montessori-inspired play stations, outdoor discovery, music and movement. Maximum 12 children with a teacher and a trained caregiver.',
    subjects: ['Sensory play', 'Music & movement', 'Language & rhyme', 'Outdoor exploration', 'Social routines'],
    activities: ['Story circle', 'Sand & water play', 'Garden walks', 'Nap routine', 'Snack & social time'],
    image: 'arts',
    icon: 'Heart',
    highlights: ['Max 12 children', 'Teacher + caregiver', 'Montessori play stations', 'Daily outdoor time']
  },
  {
    slug: 'pp1',
    name: 'PP1 · Pre-Primary 1',
    short: 'PP1',
    ages: 'Ages 3 – 4',
    stage: 'Early Years',
    blurb: 'Discovery-based learning through hands-on materials. Music lessons begin — every child finds an instrument they love.',
    approach: 'Play-based inquiry with phonics foundations, number sense through manipulatives, and specialist music from the first term.',
    subjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor & Creative', 'Religious Education', 'Music'],
    activities: ['Music & movement', 'Outdoor discovery', 'Messy play', 'Swimming', 'Story circle'],
    image: 'arts',
    icon: 'Sparkles',
    highlights: ['Music specialist', 'Phonics foundations', 'Classes of 18', 'Weekly swimming']
  },
  {
    slug: 'pp2',
    name: 'PP2 · Pre-Primary 2',
    short: 'PP2',
    ages: 'Ages 4 – 5',
    stage: 'Early Years',
    blurb: 'Bridging play and academics. Strong pre-reading and number readiness so Grade 1 starts with confidence, not catch-up.',
    approach: 'Structured early literacy and numeracy alongside continued play. Every child reads aloud weekly and builds number fluency through games.',
    subjects: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Creative Arts', 'Music', 'Religious Education'],
    activities: ['Reading readiness', 'Number games', 'Music ensemble', 'Swimming', 'Farm visits'],
    image: 'classroom',
    icon: 'BookOpen',
    highlights: ['Pre-reading mastery', 'Number fluency', 'Grade 1 readiness', 'Small classes']
  },
  {
    slug: 'lower-primary',
    name: 'Lower Primary',
    short: 'Grade 1 – 3',
    ages: 'Ages 6 – 8 · Grade 1 – 3',
    stage: 'Primary',
    blurb: 'Where reading becomes fluent, number sense becomes confidence and school becomes a place children run into.',
    approach: 'Structured literacy and numeracy every morning, project-based afternoons, weekly one-to-one reading conferences.',
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Environmental Activities', 'Creative Arts', 'CRE', 'Digital Literacy', 'Music'],
    activities: ['Reading buddies', 'Swimming', 'Chess club', 'Farm visits', 'Music'],
    image: 'classroom',
    icon: 'GraduationCap',
    highlights: ['Fluent reading by Grade 3', 'One-to-one conferences', 'Digital literacy', 'CBC aligned']
  },
  {
    slug: 'upper-primary',
    name: 'Upper Primary',
    short: 'Grade 4 – 6',
    ages: 'Ages 9 – 12 · Grade 4 – 6',
    stage: 'Primary',
    blurb: 'Deeper subject study, real research skills and the leadership habits that carry learners into junior school.',
    approach: 'Specialist subject teachers, fortnightly formative assessment and a personalised support plan per learner.',
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Science & Technology', 'Social Studies', 'Agriculture', 'Home Science', 'CRE', 'Creative Arts'],
    activities: ['Science fair', 'Debate', 'Athletics', 'Journalism club', 'Leadership council'],
    image: 'library',
    icon: 'Trophy',
    highlights: ['Specialist teachers', 'Science fair', 'Leadership council', 'JSS preparation']
  },
  {
    slug: 'junior-secondary',
    name: 'Junior Secondary',
    short: 'Grade 7 – 9',
    ages: 'Ages 13 – 15 · Grade 7 – 9',
    stage: 'Junior Secondary',
    blurb: 'The junior school years — deeper thinking, subject mastery and the independence that prepares learners for senior secondary and beyond.',
    approach: 'Subject-specialist teaching, dual-pathway guidance (STEM & humanities), continuous assessment and a dedicated JSS mentor for every learner.',
    subjects: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Pre-Technical Studies', 'Social Studies', 'CRE', 'Creative Arts & Sports', 'Agriculture & Nutrition'],
    activities: ['STEM club', 'Model UN', 'Debate & public speaking', 'Athletics & games', 'Entrepreneurship projects'],
    image: 'sports',
    icon: 'Rocket',
    highlights: ['Subject specialists', 'STEM pathway', 'JSS mentorship', 'Senior school readiness']
  }
];

export const DAY_SCHEDULE = [
  { time: '7:30am', title: 'Gates open — early drop-off', body: 'Supervised drop-off at the Acacia Wing gate.' },
  { time: '8:00am', title: 'Morning assembly & devotion', body: 'Whole-school assembly, prayer and the day\'s focus.' },
  { time: '8:30am', title: 'Core learning block', body: 'Literacy, numeracy and subject teaching.' },
  { time: '10:30am', title: 'Break & outdoor play', body: 'Structured play on the field and play courts.' },
  { time: '11:00am', title: 'Continued learning & activities', body: 'Projects, clubs and co-curricular sessions.' },
  { time: '12:40pm', title: 'Lunch (hot meal served)', body: 'Nutritious hot lunch in the dining hall.' },
  { time: '2:00pm', title: 'Rest / quiet reading time', body: 'Guided reading and calm activities.' },
  { time: '3:30pm', title: 'Pick-up — school day ends', body: 'Verified transport and parent pick-up.' }
];

export const SCHOOL_LIFE = [
  { title: 'Sports & athletics', body: 'Football, netball, swimming, athletics and taekwondo, with inter-house galas every term.', image: 'sports' },
  { title: 'Music & performance', body: 'Choir, recorder ensemble, traditional dance and an annual Kenya Music Festival entry.', image: 'arts' },
  { title: 'Art & making', body: 'Studio art, pottery and a maker space where Grade 4–9 learners prototype their science projects.', image: 'classroom' },
  { title: 'Clubs & societies', body: 'Chess, coding, journalism, environment, Red Cross and debate — 31 clubs meeting weekly.', image: 'library' },
  { title: 'Trips & expeditions', body: 'Termly learning trips to Nairobi National Park, Olorgesailie, Kazuri Beads and the KICC.', image: 'hero' },
  { title: 'Service & leadership', body: 'House captains, peer mentors and a community service term project for every upper primary and JSS class.', image: 'sports' }
];

export const CAMPUS_FACILITIES = [
  {
    title: 'Bright classrooms',
    body: 'Well-ventilated, fully equipped classrooms designed to inspire focus and creativity. Every seat is a good one.',
    image: 'classroom',
    icon: 'School',
    tag: 'Learning spaces'
  },
  {
    title: 'Baobab Library',
    body: 'A purpose-built library with a reading programme across every class — fiction, reference and a quiet study wing.',
    image: 'library',
    icon: 'BookOpen',
    tag: 'Reading'
  },
  {
    title: 'Music & arts studio',
    body: 'A dedicated music space with instruments, acoustics and specialist teachers. Choir, band and visual arts run weekly.',
    image: 'arts',
    icon: 'Sparkles',
    tag: 'Creative arts'
  },
  {
    title: 'Sports field & courts',
    body: 'Full-size field, netball and basketball courts, and a swimming programme — sport is part of every school week.',
    image: 'sports',
    icon: 'Trophy',
    tag: 'Athletics'
  },
  {
    title: 'Maker space & ICT lab',
    body: 'Where Grade 4–9 learners prototype science projects, code, and build — curiosity with tools behind it.',
    image: 'classroom',
    icon: 'Blocks',
    tag: 'STEM'
  },
  {
    title: 'Dining hall & nurse\'s bay',
    body: 'Hot lunches served daily in the dining hall, with a full-time school nurse and a dedicated wellbeing room.',
    image: 'hero',
    icon: 'Heart',
    tag: 'Care'
  }
];

export const CAMPUS_SAFETY = [
  '24-hour gated security with controlled visitor access',
  'Verified school transport with GPS tracking and matrons',
  'Full-time school nurse and first-aid trained staff',
  'No-tolerance bullying policy with trained counsellors',
  'Fire drills and emergency evacuation plans every term',
  'Parent portal live attendance — you know when your child arrives'
];

export const TESTIMONIALS = [
  {
    quote: 'We moved Wanjiru here in Grade 2 after a hard year. Within a term she was reading for pleasure — and I could see exactly why, week by week, in the portal.',
    name: 'Grace Wanjiku',
    role: 'Parent, Grade 4'
  },
  {
    quote: 'What convinced me was the honesty. At the first parent meeting they showed me the two topics my son was struggling with and the plan for each one.',
    name: 'Dennis Otieno',
    role: 'Parent, Grade 6'
  },
  {
    quote: 'I like science week best because we built a water filter and mine actually worked. My teacher put it in the gallery.',
    name: 'Amani Kiplagat',
    role: 'Learner, Grade 5'
  }
];

export const NEWS = [
  {
    id: 'n1',
    title: 'SALA wins the Nairobi County Primary Science Fair',
    category: 'Academics',
    date: '12 Sep 2026',
    author: 'Mrs. Faith Wambui',
    excerpt: 'Our Grade 6 team took first place with a low-cost rainwater filtration prototype developed in the maker space.',
    status: 'Published'
  },
  {
    id: 'n2',
    title: 'Term 3 calendar and examination dates released',
    category: 'Notice',
    date: '02 Sep 2026',
    author: 'Academic Office',
    excerpt: 'End of term assessments run from 20 – 30 October. Reports will be released in the Parent Portal on 6 November.',
    status: 'Published'
  },
  {
    id: 'n3',
    title: 'New early years wing opens with six extra classrooms',
    category: 'School News',
    date: '25 Aug 2026',
    author: 'Office of the Principal',
    excerpt: 'The Acacia Wing adds six ECD classrooms, an indoor play hall and a dedicated parent waiting lounge.',
    status: 'Published'
  },
  {
    id: 'n4',
    title: 'Grade 4 learning trip to Nairobi National Park',
    category: 'School Life',
    date: '18 Aug 2026',
    author: 'Mr. Brian Kimani',
    excerpt: 'Ninety-two learners spent the day studying habitats and food chains ahead of their term science project.',
    status: 'Published'
  }
];

export const EVENTS = [
  { id: 'e1', title: 'Parent–Teacher Consultation Day', date: '26 Sep 2026', time: '8:00am – 3:00pm', type: 'Parent Event', location: 'Main Hall', status: 'Scheduled' },
  { id: 'e2', title: 'Inter-House Athletics Gala', date: '03 Oct 2026', time: '9:00am – 4:00pm', type: 'Sports', location: 'School Field', status: 'Scheduled' },
  { id: 'e3', title: 'Grade 5 Trip — Olorgesailie Pre-history Site', date: '10 Oct 2026', time: '7:00am – 6:00pm', type: 'Trip', location: 'Kajiado', status: 'Planning' },
  { id: 'e4', title: 'End of Term 3 Assessments Begin', date: '20 Oct 2026', time: 'All week', type: 'Exams', location: 'All classes', status: 'Scheduled' },
  { id: 'e5', title: 'Open Day & Admissions Clinic', date: '31 Oct 2026', time: '9:00am – 1:00pm', type: 'Admissions', location: 'Acacia Wing', status: 'Scheduled' }
];

export const GALLERY = [
  { id: 'g1', title: 'Science Fair 2026', category: 'Academics', count: 34, image: 'classroom', status: 'Published' },
  { id: 'g2', title: 'Inter-House Gala', category: 'Sports', count: 58, image: 'sports', status: 'Published' },
  { id: 'g3', title: 'Reading Week', category: 'School Life', count: 22, image: 'library', status: 'Published' },
  { id: 'g4', title: 'Music Festival Rehearsals', category: 'Activities', count: 41, image: 'arts', status: 'Published' },
  { id: 'g5', title: 'Nairobi Park Trip', category: 'Trips', count: 67, image: 'hero', status: 'Published' },
  { id: 'g6', title: 'Grade 1 Welcome Morning', category: 'Events', count: 19, image: 'classroom', status: 'Published' }
];

export const GALLERY_PHOTOS = [
  { id: 'p1', title: 'Morning assembly on the main lawn', category: 'School Life', image: 'hero' },
  { id: 'p2', title: 'Grade 3 literacy circle', category: 'Academics', image: 'classroom' },
  { id: 'p3', title: 'Inter-house athletics gala', category: 'Sports', image: 'sports' },
  { id: 'p4', title: 'Baobab Library reading corner', category: 'School Life', image: 'library' },
  { id: 'p5', title: 'Music ensemble rehearsal', category: 'Activities', image: 'arts' },
  { id: 'p6', title: 'Science fair prototypes', category: 'Academics', image: 'classroom' },
  { id: 'p7', title: 'Swimming gala heats', category: 'Sports', image: 'sports' },
  { id: 'p8', title: 'Art studio open session', category: 'Activities', image: 'arts' },
  { id: 'p9', title: 'Grade 6 leadership council', category: 'School Life', image: 'library' },
  { id: 'p10', title: 'Campus aerial view', category: 'Campus', image: 'hero' },
  { id: 'p11', title: 'Playgroup outdoor discovery', category: 'Academics', image: 'arts' },
  { id: 'p12', title: 'Open Day family tour', category: 'Events', image: 'classroom' }
];

export const GALLERY_CATEGORIES = ['All', 'Academics', 'Sports', 'Activities', 'School Life', 'Events', 'Campus', 'Trips'];

export const TIMELINE = [
  { year: '2002', title: 'A nursery of nineteen children', body: 'Ann Lifred Mwangi opens a single ECD class in a converted family home in Runda.' },
  { year: '2007', title: 'Primary school opens', body: 'The first Standard 1 class begins on the current Kiambu Road campus.' },
  { year: '2013', title: 'The Baobab Library', body: 'A purpose-built library and reading programme is introduced across all classes.' },
  { year: '2019', title: 'CBC transition completed', body: 'SALA becomes one of the first Nairobi schools to fully align to competency-based assessment.' },
  { year: '2023', title: 'One digital campus', body: 'Parent, student and teacher portals launch, putting attendance, results and fees in one place.' },
  { year: '2026', title: 'The Acacia Wing', body: 'Six new early years classrooms and an indoor play hall open to 180 additional learners.' }
];

export const LEADERSHIP = [
  { name: 'Dr. Ann Lifred Mwangi', role: 'Founder & Director', note: 'PhD Education Leadership, Kenyatta University. 31 years in education.' },
  { name: 'Mr. Samuel Kariuki', role: 'Head Teacher', note: 'Leads academic delivery and teacher development across all three sections.' },
  { name: 'Mrs. Faith Wambui', role: 'Deputy Head, Academics', note: 'Oversees curriculum, assessment and the personalised learning programme.' },
  { name: 'Ms. Lydia Achieng', role: 'Head of Early Years', note: 'Specialist in early literacy and play-based pedagogy.' },
  { name: 'Mr. Peter Njoroge', role: 'Finance Manager', note: 'Fees, bursaries and the school development fund.' },
  { name: 'Mrs. Susan Muthoni', role: 'HR Manager', note: 'Staff welfare, recruitment and professional development.' }
];

export const VALUES = [
  { title: 'Integrity', body: 'We tell children — and parents — the truth, kindly and early.', icon: 'ShieldCheck' },
  { title: 'Curiosity', body: 'Questions are the work, not an interruption to it.', icon: 'Sparkles' },
  { title: 'Respect', body: 'Every child, every family, every member of staff is treated with dignity.', icon: 'Handshake' },
  { title: 'Perseverance', body: 'We teach children that difficulty is a normal part of learning something worthwhile.', icon: 'Target' },
  { title: 'Service', body: 'Leadership at SALA means responsibility for others, not privilege over them.', icon: 'Heart' }
];

export const ADMISSION_REQUIREMENTS = [
  'Copy of the child\'s birth certificate',
  'Most recent school report (Grade 1 and above)',
  'Two passport-size photographs',
  'Immunisation record (ECD applicants)',
  'Copy of parent/guardian national ID or passport',
  'Completed online application form'
];

export const ADMISSION_STEPS = [
  { step: '01', title: 'Enquire or book a visit', body: 'Tour the campus, meet the section head and see a normal school day.' },
  { step: '02', title: 'Submit the online application', body: 'Seven short steps, saved as you go. Upload documents from your phone.' },
  { step: '03', title: 'Assessment & interview', body: 'A friendly readiness conversation for ECD, a short written assessment from Grade 1.' },
  { step: '04', title: 'Offer & acceptance', body: 'Decisions within 10 working days. Accept your place and pay the commitment fee.' },
  { step: '05', title: 'Enrolment', body: 'Uniform fitting, transport route, class placement and portal accounts activated.' }
];

export const ADMISSION_STEPS_SIMPLE = [
  { step: '01', title: 'Book a school visit', body: 'Come and see classrooms in session, meet the section head and ask everything.' },
  { step: '02', title: 'Submit your application', body: 'A short online form — or send us a WhatsApp and we will help you complete it.' },
  { step: '03', title: 'Assessment & offer', body: 'A friendly readiness check for early years; a short written assessment from Grade 1. Offers within 10 working days.' },
  { step: '04', title: 'Enrol & begin', body: 'Uniform, transport route, class placement and parent portal — your child\'s first day, sorted.' }
];

export const FEE_STRUCTURE = [
  { level: 'Playgroup (Age 2 – 3)', tuition: 38000, transport: 18000, meals: 10000, total: 66000 },
  { level: 'PP1 – PP2 (Age 3 – 5)', tuition: 48000, transport: 18000, meals: 12000, total: 78000 },
  { level: 'Lower Primary (Grade 1 – 3)', tuition: 56000, transport: 18000, meals: 12000, total: 86000 },
  { level: 'Upper Primary (Grade 4 – 6)', tuition: 62000, transport: 18000, meals: 12000, total: 92000 },
  { level: 'Junior Secondary (Grade 7 – 9)', tuition: 72000, transport: 18000, meals: 12000, total: 102000 }
];

export const FAQS = [
  { q: 'When does the admissions window open?', a: 'Applications for the January 2027 intake are open now. We also admit mid-year into most classes where space allows.' },
  { q: 'Is there an entrance exam?', a: 'Playgroup and PP1 applicants have a play-based readiness session. From PP2 there is a short English and Mathematics assessment lasting about 45 minutes.' },
  { q: 'How long does a decision take?', a: 'Ten working days from the date of assessment. You can follow every stage in the application tracker.' },
  { q: 'Do you offer transport?', a: 'Yes — 14 routes across Nairobi, Kiambu and Ruiru, all with a matron and GPS tracking.' },
  { q: 'Can fees be paid in instalments?', a: 'Yes. Termly fees can be split into three instalments by arrangement with the finance office, payable by M-Pesa or bank transfer.' },
  { q: 'What is your class size?', a: 'A maximum of 12 in Playgroup, 18 in PP1–PP2 and 26 in primary and junior secondary, with a teaching assistant in every early years class.' },
  { q: 'Can my child join mid-term?', a: 'Mid-term joining is considered case by case where space allows. Contact the admissions office to discuss your situation.' }
];

export const CONTACT_TOPICS = [
  'Admissions',
  'Fees and payments',
  'Transport',
  'An existing learner',
  'Employment',
  'Other'
];

export const VISIT_REASONS = [
  'Considering Playgroup / PP1',
  'Considering PP2',
  'Considering Grade 1',
  'Considering Grade 4 – 6',
  'Considering Junior Secondary (Grade 7 – 9)',
  'General campus tour'
];
