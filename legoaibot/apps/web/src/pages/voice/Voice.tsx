import React from 'react';

const Page = () => {

    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "/realtime.js";
        script.async = true;
        document.body.appendChild(script);
    });

    return (
        <div className="pageContainer">
            <h2>Realtime Voice Conversation</h2>
            <p>Engage in real-time conversations with AI to streamline tasks and automate actions effortlessly. From recording practice game scores to generating on-the-spot insights.</p>

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
