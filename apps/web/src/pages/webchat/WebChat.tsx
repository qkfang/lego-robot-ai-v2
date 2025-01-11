import React from 'react';
import WebChatList from '../../components/WebChatList';

const Page = () => {

    return (
        <div className="pageContainer">
             <h2>Chat with other users</h2>
             <p>Collaborate seamlessly with fellow students and teachers through an interactive webchat platform. Share engineering challenges, brainstorm solutions, and exchange creative ideas in real time.</p>
             <WebChatList  />
        </div>
    );
};

export default Page;
