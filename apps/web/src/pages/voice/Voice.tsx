import React from 'react';

const Page = () => {

    React.useEffect(() => {
        if (!document.querySelector(`script[src="realtime.js"]`)) {
            const script = document.createElement('script');
            script.src = "realtime.js";
            script.async = true;
            document.body.appendChild(script);
        
            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    return (
        <div className="pageContainer">
            <h2>Realtime Voice Conversation</h2>
            <p>Engage in real-time conversations with AI to streamline tasks and automate actions effortlessly. From recording practice game scores to generating on-the-spot insights.</p>
            <br/>
            <h3>Practise Game Score Assistent</h3>
            <main className="container">
                <article>
                    <p>Click the start button and wait for the browser to initiate voice conversation. Say "Hi"  to start chatting.</p>
                    <button id="toggleButton" className="black-button">Start Conversation</button>
                    <div id="statusMessage"></div>
                    <pre id="report"></pre>
                </article>
            </main>
        </div>
    );
};

export default Page;