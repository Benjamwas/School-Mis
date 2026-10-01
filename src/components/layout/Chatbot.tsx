import { Suspense, lazy, useEffect, useState } from 'react';
import 'styled-components';
import api from '../../api';

const ChatbotImpl = lazy(async () => {
  try {
    const module = await import('react-simple-chatbot');
    const Chatbot = module.default || module;
    return { default: Chatbot };
  } catch (error) {
    console.error('Failed to load chatbot module:', error);
    return {
      default: () => (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '300px',
          padding: '15px', backgroundColor: '#f0f0f0', border: '1px solid #ccc',
          borderRadius: '8px', fontFamily: 'Arial, sans-serif', fontSize: '14px', zIndex: 9999
        }}>
          💬 Chatbot (Loading...)
        </div>
      )
    };
  }
});

interface ChatbotEntry {
  question: string;
  answer: string;
}

const defaultEntries: ChatbotEntry[] = [
  { question: 'What are the school fees?', answer: 'For current fee structure and payment options, please contact the school office at 0114468263 or 0722217531, or email vendraminischools@gmail.com.' },
  { question: 'How do I enroll my child?', answer: 'You can enroll by filling out the enrollment form on our Contact page, visiting any campus, or calling 0114468263 for an appointment.' },
  { question: 'What events are coming up?', answer: 'Check our Events page or the Events section on the home page for the latest school events, open days, and activities.' },
  { question: 'Where are the campuses located?', answer: 'We have campuses in Kahawa West, Nairobi. Visit the Campuses page for addresses and contact details for each campus.' },
  { question: 'What are the school hours?', answer: 'School hours are 7:30 AM to 4:30 PM, Monday to Friday. Please contact your campus for any variations.' },
  { question: 'How can I contact the school?', answer: 'You can reach us at 0114468263 / 0722217531 or email vendraminischools@gmail.com. You can also use the contact form on our Contact page.' }
];

function buildSteps(entries: ChatbotEntry[], phone: string) {
  const options = entries.map((e, i) => ({ value: `q${i}`, label: e.question, trigger: `a${i}` }));
  const answerSteps = entries.map((e, i) => ({
    id: `a${i}`,
    message: e.answer,
    trigger: 'ask-more'
  }));

  return [
    {
      id: '1',
      message: `Hello! Welcome to Vendramini School. How can I help you today?`,
      trigger: 'options'
    },
    {
      id: 'options',
      options: [
        ...options,
        { value: 'talk', label: 'Talk to the secretary', trigger: 'show-secretary' },
        { value: 'contact', label: 'Contact Information', trigger: 'show-contact' }
      ]
    },
    ...answerSteps,
    {
      id: 'show-secretary',
      message: `Our secretary will assist you shortly. Please call ${phone} or visit any campus, and we'll get back to you as soon as possible.`,
      trigger: 'ask-more'
    },
    {
      id: 'show-contact',
      message: `You can reach Vendramini Schools in Kahawa West, Nairobi. Phone: ${phone}, Email: vendraminischools@gmail.com.`,
      trigger: 'ask-more'
    },
    {
      id: 'ask-more',
      message: 'Is there anything else I can help you with?',
      trigger: 'final-options'
    },
    {
      id: 'final-options',
      options: [
        { value: 'yes', label: 'Yes', trigger: 'options' },
        { value: 'no', label: 'No (Goodbye)', trigger: 'end-message' }
      ]
    },
    {
      id: 'end-message',
      message: 'Thank you for chatting with us! Have a great day!',
      end: true
    }
  ];
}

const ChatbotComponent = () => {
  const [steps, setSteps] = useState(() => buildSteps(defaultEntries, '0114468263 / 0722217531'));

  useEffect(() => {
    api.get('/settings/public')
      .then((res) => {
        let entries = defaultEntries;
        if (Array.isArray(res.data.chatbot) && res.data.chatbot.length > 0) {
          entries = res.data.chatbot as ChatbotEntry[];
        }
        const phone = typeof res.data.footer_phone === 'string' ? res.data.footer_phone : '0114468263 / 0722217531';
        setSteps(buildSteps(entries, phone));
      })
      .catch(() => {});
  }, []);

  return (
    <Suspense fallback={null}>
      <ChatbotImpl
        steps={steps}
        floating={true}
        opened={false}
        headerTitle="Vendramini School Assistant"
        placeholder="Type your message..."
        width="400px"
        height="500px"
      />
    </Suspense>
  );
};

export default ChatbotComponent;
