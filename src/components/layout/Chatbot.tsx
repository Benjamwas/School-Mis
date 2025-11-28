import { Suspense, lazy } from 'react';
import 'styled-components'; // Ensure styled-components is loaded before chatbot

// Lazy load the chatbot library with error boundary
const ChatbotImpl = lazy(async () => {
  try {
    const module = await import('react-simple-chatbot');
    console.log('✓ Chatbot module loaded successfully');
    const Chatbot = module.default || module;
    return { default: Chatbot };
  } catch (error) {
    console.error('✗ Failed to load chatbot module:', error);
    // Return a fallback component if loading fails
    return { 
      default: () => (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '300px',
          padding: '15px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          zIndex: 9999
        }}>
          💬 Chatbot (Loading...)
        </div>
      )
    };
  }
});

const Steps = [
    {
        id: '1',
        message: "Hello! Welcome to Vendramini School. How can I help you today?",
        trigger: 'options',
    },
    {
        id: 'options',
        options: [
            { value: 'fees', label: 'View recent fee structure', trigger: 'show-fees' },
            { value: 'Admissions', label: 'In need of Assistance with Admissions', trigger: 'show-admissions' },
            {value: 'events', label: 'Upcoming School Events', trigger: 'show-events' },
            {value: 'contact', label: 'Contact Information', trigger: 'show-contact' },
            {value: 'talk', label: 'Talk to the secretary', trigger: 'show-secretary' }, 
        
        ],
    },
    // Fee Structure path
    {
        id: 'show-fees',
        message: " Certainly! You can download the latest fee structure from the following link: [Fee Structure PDF](Link to Pdf). Is there anything else I can assist you with?",
        trigger: 'Ask  More',
    },
    // Admissions path
    {
        id: 'show-admissions',
        message: "For admissions assistance, please visit our Admissions page /Contact page or contact us through 0114468263/07222217531.",
        trigger: 'Ask  More',
    },
    // Events path
    {
        id: 'show-events',
        message: "Check out our upcoming school events! Visit our Events page for more details or contact us for specific event information.",
        trigger: 'Ask  More',
    },
    // Contact Information 
    {
        id: 'show-contact',
        message: "You can reach us at Vendramini School, along Kamae-Kiwanja Rd, Kahawa west Ward,Roysambu,Nairobi,Kenya . Phone: (123) 456-7890, Email:",
        trigger: 'Ask  More',
    },
    // Secretary path
    {
        id: 'show-secretary',
        message: "Our secretary will assist you shortly. Please provide your name and contact information, and we'll get back to you as soon as possible.",
        trigger: 'Ask  More',
    },
    // Loop back to options
    {
        id: 'Ask  More',
        message: "Is there anything else I can help you with?",
        trigger:  'final-options',
    },
    {
        id: 'final-options',
        options: [
            { value: 'yes', label: 'Yes', trigger: 'options' },
            { value: 'no', label: 'No(Goodbye)', trigger: 'end-message' },
        ],
    },
    {
        id: 'end-message',
        message: "Thank you for chatting with us! Have a great day!",
        end: true,
    },
];
const ChatbotComponent = () => {
    return (
        <Suspense fallback={
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '300px',
                padding: '15px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                zIndex: 9999
            }}>
              💬 Chatbot Loading...
            </div>
        }>
            <ChatbotImpl
                steps={Steps}
                floating={true}
                opened={false}
                headerTitle="Vendramini School Assistant"
                placeholder="Type your message..."
                width="400px"
                height="500px"
            />
        </Suspense>
    );
}
export default ChatbotComponent;