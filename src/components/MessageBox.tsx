import React from 'react';

// Define the props this component expects
interface MessageBoxProps {
    message: string | null; // The message string to display, or null if no message
}

const MessageBox: React.FC<MessageBoxProps> = ({ message }) => {
    // Render the message box only if there is a message
    if (!message) {
        return null; // Don't render anything if no message
    }

    return (
        <div id="message-box" className="show">
            {message}
        </div>
    );
};

export default MessageBox;
