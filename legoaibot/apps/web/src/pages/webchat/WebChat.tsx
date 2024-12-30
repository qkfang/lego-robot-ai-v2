import React from 'react';
import LiveChatList from '../../components/WebChatList';

const Page = () => {

    const [userId, setUserId] = React.useState("");

    React.useEffect(() => {
        setUserId(crypto.randomUUID().substring(0, 3));
    });

    return (
        <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
             <h2>Chat with other users</h2>
             <LiveChatList userId={userId} />
        </div>
    );
};

export default Page;
