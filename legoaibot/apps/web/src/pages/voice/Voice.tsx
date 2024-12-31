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
            <p>Engage in real-time conversations with AI to streamline tasks and automate actions effortlessly.</p>

            <main className="container">
                <article>
                    <button id="toggleButton" className="black-button">Practise Game Assistent</button>
                    <div id="statusMessage"></div>
                    <pre id="report"></pre>
                </article>
            </main>
        </div>
    );
};

export default Page;
