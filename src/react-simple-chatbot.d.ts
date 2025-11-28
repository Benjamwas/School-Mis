declare module 'react-simple-chatbot' {
  import React from 'react';

  interface ChatbotStep {
    id: string;
    message?: string;
    trigger?: string;
    end?: boolean;
    options?: Array<{
      value: string;
      label: string;
      trigger: string;
    }>;
  }

  interface ChatbotProps {
    steps: ChatbotStep[];
    floating?: boolean;
    opened?: boolean;
    headerTitle?: string;
    placeholder?: string;
    width?: string | number;
    height?: string | number;
  }

  const Chatbot: React.FC<ChatbotProps>;
  export default Chatbot;
}
