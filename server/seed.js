import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './db.js';

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@vendramini.sc.ke').toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

console.log('Seeding Vendramini database...');

const hash = bcrypt.hashSync(adminPassword, 10);
db.prepare(`
  INSERT INTO users (email, password_hash, name, role)
  VALUES (?, ?, ?, 'admin')
  ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
`).run(adminEmail, hash, 'Administrator');
console.log(`Admin user: ${adminEmail}`);

const campusCount = db.prepare('SELECT COUNT(*) as n FROM campuses').get().n;
if (campusCount === 0) {
  const insertCampus = db.prepare(`
    INSERT INTO campuses (name, slug, tagline, description, long_description, image, features, address, hours, age_range, contact_phone, contact_email, latitude, longitude, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCampus.run(
    'Pre-Primary 1 Campus', 'pre-primary-1',
    'Where learning begins',
    'A nurturing environment for our youngest learners (ages 3-5).',
    'Our Pre-Primary 1 campus provides a warm, play-based learning environment where children take their first steps into education. Qualified early childhood educators guide activities that build social skills, creativity, and foundational literacy and numeracy.',
    '/images/20250104_155143.jpg',
    JSON.stringify(['Play-based learning', 'Qualified ECD teachers', 'Safe & nurturing environment', 'Small class sizes']),
    'Kahawa West, Nairobi',
    '7:30 AM - 4:30 PM',
    'Ages 3-5',
    '0114468263 / 0722217531',
    'pambazuko@vendramini.sc.ke',
    -1.1735, 36.9532, 1
  );
  insertCampus.run(
    'Pre-Primary 2 Campus', 'pre-primary-2',
    'Growing with confidence',
    'Continuing early childhood education with focus on school readiness.',
    'Pre-Primary 2 builds on foundational skills with structured phonics, early mathematics, creative arts, and outdoor exploration. Children develop confidence and independence as they prepare for primary school.',
    '/images/20250104_155308.jpg',
    JSON.stringify(['Structured phonics', 'Early numeracy', 'Creative arts', 'School readiness program']),
    'Kahawa West, Nairobi',
    '7:30 AM - 4:30 PM',
    'Ages 4-5',
    '0114468263 / 0722217531',
    'pambazuko@vendramini.sc.ke',
    -1.1740, 36.9540, 2
  );
  insertCampus.run(
    'Pre-Primary 3 Campus', 'pre-primary-3',
    'Ready for the future',
    'The final pre-primary year preparing children for primary education.',
    'Pre-Primary 3 is our bridge to primary school. Children engage in project-based learning, early reading, handwriting practice, and collaborative activities that build the academic and social skills needed for a smooth transition.',
    '/images/20250104_155421.jpg',
    JSON.stringify(['Project-based learning', 'Reading readiness', 'Handwriting practice', 'Primary school transition']),
    'Kahawa West, Nairobi',
    '7:30 AM - 4:30 PM',
    'Ages 5-6',
    '0114468263 / 0722217531',
    'pambazuko@vendramini.sc.ke',
    -1.1745, 36.9545, 3
  );
  insertCampus.run(
    'Primary School Campus', 'primary',
    'High is our Origin and Destiny',
    'A comprehensive primary education program for ages 6-13.',
    'Our Primary School campus offers a holistic CBC-aligned curriculum with strong academics, sports, arts, and character development. We nurture every child to discover their gifts and reach their highest potential.',
    '/images/20250116_161339.jpg',
    JSON.stringify(['CBC-aligned curriculum', 'Sports & athletics', 'Arts & music', 'Character development', 'Computer lab', 'Science lab']),
    'Kahawa West, Nairobi',
    '7:30 AM - 4:30 PM',
    'Ages 6-13',
    '0114468263 / 0722217531',
    'pambazuko@vendramini.sc.ke',
    -1.1750, 36.9550, 4
  );
  console.log('Campuses seeded (4)');
} else {
  console.log('Campuses already exist, skipping');
}

const eventCount = db.prepare('SELECT COUNT(*) as n FROM events').get().n;
if (eventCount === 0) {
  const insertEvent = db.prepare(`
    INSERT INTO events (title, slug, date, time, location, description, image, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run(
    'Charity Day', 'charity-day', '2025-09-15', '9:00 AM - 3:00 PM', 'All Campuses',
    'A day of giving back to the community. Students, parents, and staff come together to support local charities and learn the value of generosity.',
    '/images/charity.jpg', 'published', 1
  );
  insertEvent.run(
    'School Re-opening', 'school-re-opening', '2026-01-06', '7:30 AM', 'All Campuses',
    'Welcome back to a new term! All students report on January 6th. Ensure all school supplies and uniforms are ready.',
    '/images/20250116_161339.jpg', 'published', 0
  );
  insertEvent.run(
    'Sports Day', 'sports-day', '2026-03-20', '8:00 AM - 4:00 PM', 'Primary Campus',
    'Annual inter-campus sports competition featuring athletics, football, and fun games for all age groups.',
    '/images/20250129_112221.jpg', 'published', 1
  );
  insertEvent.run(
    'Graduation Ceremony', 'graduation-ceremony', '2026-11-28', '10:00 AM - 1:00 PM', 'Primary Campus',
    'Celebrating our graduating class as they complete primary school and prepare for secondary education.',
    '/images/20250104_155143.jpg', 'draft', 0
  );
  console.log('Events seeded (4)');
} else {
  console.log('Events already exist, skipping');
}

const blogCount = db.prepare('SELECT COUNT(*) as n FROM blog_posts').get().n;
if (blogCount === 0) {
  const insertPost = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, category, author, image, tags, status, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const posts = [
    {
      title: 'The Importance of Early Childhood Education',
      excerpt: 'Why the first five years of learning shape a child\'s entire future.',
      content: 'Early childhood education is the foundation upon which all future learning is built. Research consistently shows that children who receive quality early education perform better academically, develop stronger social skills, and are more likely to succeed in later life.\n\nAt Vendramini, we believe every child deserves a warm, stimulating start. Our pre-primary programs focus on play-based learning, literacy, numeracy, and creativity in a nurturing environment.',
      category: 'Early Education',
      image: '/images/20250104_155143.jpg',
      tags: ['early-learning', 'pre-primary', 'development']
    },
    {
      title: 'How to Support Your Child\'s Homework Routine',
      excerpt: 'Practical tips for parents to make homework time less stressful.',
      content: 'Homework time can be a source of stress for many families. The key is establishing a consistent routine that works for your child.\n\nStart with a designated homework space that is quiet and well-lit. Set a regular time each day, take short breaks for younger children, and always praise effort rather than perfection.',
      category: 'Parenting',
      image: '/images/20250116_161339.jpg',
      tags: ['parenting', 'homework', 'study-skills']
    },
    {
      title: 'Arts Education: More Than Just Drawing',
      excerpt: 'How creative arts build confidence, discipline, and critical thinking.',
      content: 'Arts education is often undervalued, yet it plays a crucial role in child development. Through music, visual arts, and drama, children develop fine motor skills, emotional expression, and the confidence to share their ideas with the world.\n\nAt Vendramini, arts are integrated across the curriculum, not treated as an afterthought.',
      category: 'Arts Education',
      image: '/images/20250129_112221.jpg',
      tags: ['arts', 'creativity', 'curriculum']
    },
    {
      title: 'Keeping Children Healthy During School Terms',
      excerpt: 'Nutrition, sleep, and hygiene tips for a productive school year.',
      content: 'A healthy child is a happy learner. Ensuring your child gets proper nutrition, adequate sleep, and practices good hygiene are the simplest ways to support their school performance.\n\nPack balanced lunchboxes, establish consistent bedtimes, and teach handwashing routines that keep illness at bay during term time.',
      category: 'Health & Wellness',
      image: '/images/20250104_155308.jpg',
      tags: ['health', 'nutrition', 'wellness']
    },
    {
      title: 'Technology in the Classroom: A Balanced Approach',
      excerpt: 'How we use technology to enhance learning without replacing human connection.',
      content: 'Technology is a powerful tool for education when used thoughtfully. At Vendramini, our computer lab and classroom technology support the curriculum rather than distract from it.\n\nWe balance screen time with hands-on activities, outdoor play, and face-to-face interaction, ensuring children develop both digital literacy and essential social skills.',
      category: 'Educational Technology',
      image: '/images/20250116_161339.jpg',
      tags: ['technology', 'digital-learning', 'balance']
    },
    {
      title: 'Understanding Your Child\'s Learning Style',
      excerpt: 'Visual, auditory, or kinesthetic — knowing how your child learns best.',
      content: 'Every child learns differently. Some absorb information best through pictures and diagrams (visual), others through listening and discussion (auditory), and many through hands-on activities (kinesthetic).\n\nUnderstanding your child\'s learning style helps you support them at home and collaborate effectively with their teachers.',
      category: 'Child Psychology',
      image: '/images/20250104_155421.jpg',
      tags: ['learning-styles', 'psychology', 'parenting']
    }
  ];
  for (const p of posts) {
    insertPost.run(
      p.title, slugify(p.title), p.excerpt, p.content, p.category,
      'Vendramini', p.image, JSON.stringify(p.tags), 'draft', null
    );
  }
  console.log('Blog posts seeded (6 drafts)');
} else {
  console.log('Blog posts already exist, skipping');
}

const catCount = db.prepare('SELECT COUNT(*) as n FROM gallery_categories').get().n;
if (catCount === 0) {
  const cats = ['Classroom', 'Facilities', 'Science', 'Sports', 'Pre-Primary', 'Events', 'Arts'];
  const insertCat = db.prepare('INSERT INTO gallery_categories (name, sort_order) VALUES (?, ?)');
  cats.forEach((c, i) => insertCat.run(c, i));
  console.log('Gallery categories seeded');
}

const imgCount = db.prepare('SELECT COUNT(*) as n FROM gallery_images').get().n;
if (imgCount === 0) {
  const insertImg = db.prepare('INSERT INTO gallery_images (src, alt, category_id, sort_order) VALUES (?, ?, ?, ?)');
  const images = [
    { src: '/images/20250104_155143.jpg', alt: 'Pre-Primary classroom activity', cat: 'Pre-Primary' },
    { src: '/images/20250104_155308.jpg', alt: 'Young learners at work', cat: 'Pre-Primary' },
    { src: '/images/20250104_155421.jpg', alt: 'Classroom learning session', cat: 'Classroom' },
    { src: '/images/20250116_161339.jpg', alt: 'Primary school campus', cat: 'Facilities' },
    { src: '/images/20250129_112221.jpg', alt: 'School sports activities', cat: 'Sports' },
    { src: '/images/charity.jpg', alt: 'Charity day event', cat: 'Events' }
  ];
  for (let i = 0; i < images.length; i++) {
    const im = images[i];
    const catRow = db.prepare('SELECT id FROM gallery_categories WHERE name = ?').get(im.cat);
    insertImg.run(im.src, im.alt, catRow?.id || null, i);
  }
  console.log('Gallery images seeded (6)');
} else {
  console.log('Gallery images already exist, skipping');
}

const testCount = db.prepare('SELECT COUNT(*) as n FROM testimonials').get().n;
if (testCount === 0) {
  const insertTest = db.prepare(
    'INSERT INTO testimonials (quote, name, role, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)'
  );
  insertTest.run(
    'Vendramini has transformed my daughter\'s confidence. She loves going to school every day!',
    'Parent of Primary Student', 'Parent', '', 0
  );
  insertTest.run(
    'The teachers genuinely care about each child. It\'s more than a school — it\'s a family.',
    'Parent of Pre-Primary Student', 'Parent', '', 1
  );
  insertTest.run(
    'I\'ve seen incredible growth in my students. The curriculum is engaging and the environment is supportive.',
    'Mathematics Teacher', 'Teacher', '', 2
  );
  insertTest.run(
    'High is our Origin and Destiny — and at Vendramini, every child is given the chance to soar.',
    'Executive Principal', 'Leadership', '', 3
  );
  console.log('Testimonials seeded (4)');
} else {
  console.log('Testimonials already exist, skipping');
}

const staffCount = db.prepare('SELECT COUNT(*) as n FROM staff').get().n;
if (staffCount === 0) {
  const insertStaff = db.prepare(
    'INSERT INTO staff (name, role_title, bio, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)'
  );
  insertStaff.run(
    'Sr. Agnes', 'Executive Principal',
    'Leading Vendramini Schools with vision, compassion, and a commitment to academic excellence.',
    '', 0
  );
  insertStaff.run(
    'Fred Wasike', 'Head of Primary School',
    'Dedicated to nurturing well-rounded learners through the CBC curriculum.',
    '/images/20250116_161339.jpg', 1
  );
  insertStaff.run(
    'Early Education Director', 'Early Education Director',
    'Championing play-based learning for our youngest students.',
    '', 2
  );
  console.log('Staff seeded (3)');
} else {
  console.log('Staff already exist, skipping');
}

const settings = [
  ['site_name', 'Vendramini Schools'],
  ['tagline', 'High is our Origin and Destiny'],
  ['hero_tagline', 'High is our Origin and Destiny'],
  ['footer_phone', '0114468263 / 0722217531'],
  ['footer_email', 'vendraminischools@gmail.com'],
  ['footer_address', 'Kahawa West, Nairobi, Kenya'],
  ['contact_phone', '0114468263 / 0722217531'],
  ['contact_email', 'vendraminischools@gmail.com'],
  ['hero_images', JSON.stringify([
    '/images/20250104_155143.jpg',
    '/images/20250116_161339.jpg',
    '/images/20250129_112221.jpg',
    '/images/charity.jpg'
  ])],
  ['about_mission', 'To provide holistic, Christ-centered education that empowers every child to discover their gifts and reach their highest potential.'],
  ['about_vision', 'To be the leading multi-campus school network in Kenya, known for academic excellence, character formation, and innovation.'],
  ['about_history', 'Vendramini Schools was founded with a simple but powerful belief: that every child, regardless of background, deserves access to quality education in a nurturing environment. From humble beginnings, the school has grown into a multi-campus network serving families across Kahawa West and beyond.'],
  ['core_values', JSON.stringify([
    { title: 'Excellence', description: 'We pursue the highest standards in teaching, learning, and character.' },
    { title: 'Integrity', description: 'We act with honesty, fairness, and respect in all we do.' },
    { title: 'Service', description: 'We give back to our community and lift others as we climb.' },
    { title: 'Innovation', description: 'We embrace creativity and modern methods to prepare children for the future.' }
  ])],
  ['chatbot', JSON.stringify([
    { question: 'What are the school fees?', answer: 'For current fee structure and payment options, please contact the school office at 0114468263 or 0722217531, or email vendraminischools@gmail.com.' },
    { question: 'How do I enroll my child?', answer: 'You can enroll by filling out the enrollment form on our Contact page, visiting any campus, or calling 0114468263 for an appointment.' },
    { question: 'What events are coming up?', answer: 'Check our Events page or the Events section on the home page for the latest school events, open days, and activities.' },
    { question: 'Where are the campuses located?', answer: 'We have campuses in Kahawa West, Nairobi. Visit the Campuses page for addresses and contact details for each campus.' },
    { question: 'What are the school hours?', answer: 'School hours are 7:30 AM to 4:30 PM, Monday to Friday. Please contact your campus for any variations.' },
    { question: 'How can I contact the school?', answer: 'You can reach us at 0114468263 / 0722217531 or email vendraminischools@gmail.com. You can also use the contact form on our Contact page.' }
  ])]
];

const upsertSetting = db.prepare(`
  INSERT INTO site_settings (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);
for (const [key, value] of settings) {
  upsertSetting.run(key, value);
}
console.log('Site settings seeded');

console.log('\nSeeding complete!');
console.log(`Login: ${adminEmail} / ${adminPassword}`);
