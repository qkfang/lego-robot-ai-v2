import React from 'react';

const Page = () => {

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "/realtime.js";
        script.async = true;
        document.body.appendChild(script);
    });

    return (
        <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
            <h2>Realtime Voice Conversation</h2>

            <main className="container">
                <article>
                    <button id="toggleButton" className="black-button">Start Conversation</button>
                    <div id="statusMessage"></div>
                    <pre id="report"></pre>
                </article>
            </main>
        </div>
    );
};

export default Page;
