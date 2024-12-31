import { lazy } from "react";

import chatbotContent from "../../content/ChatbotContent.json";
import conversationContent from "../../content/ConversationContent.json";
import brickContent from "../../content/BrickContent.json";
import imageContent from "../../content/ImageContent.json";
import webchatContent from "../../content/WebchatContent.json";

const MiddleBlock = lazy(() => import("../../components/MiddleBlock"));
const Container = lazy(() => import("../../common/Container"));
const ContentBlock = lazy(() => import("../../components/ContentBlock"));

const Home = () => {
    return (
        <div className="pageContainer">
            <Container>
                <ContentBlock
                    direction="right"
                    title={chatbotContent.title}
                    content={chatbotContent.text}
                    button={chatbotContent.button}
                    icon="banner-chatbot.png"
                    id="intro"
                />
                <MiddleBlock
                    title={conversationContent.title}
                    content={conversationContent.text}
                    button={conversationContent.button}
                />
                <ContentBlock
                    direction="left"
                    title={brickContent.title}
                    content={brickContent.text}
                    section={brickContent.section}
                    icon="banner-brick.png"
                    id="about"
                />
                <ContentBlock
                    direction="right"
                    title={imageContent.title}
                    content={imageContent.text}
                    icon="banner-image.png"
                    id="mission"
                />
                <ContentBlock
                    direction="left"
                    title={webchatContent.title}
                    content={webchatContent.text}
                    icon="banner-webchat.png"
                    id="product"
                />
            </Container>
        </div>
    );
};

export default Home;
