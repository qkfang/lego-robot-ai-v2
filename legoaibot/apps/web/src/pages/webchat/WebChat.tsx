import React from 'react';
import WebChatList from '../../components/WebChatList';

const Page = () => {

    return (
        <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
             <h2>Chat with other users</h2>
             <WebChatList  />
        </div>
    );
};

export default Page;
