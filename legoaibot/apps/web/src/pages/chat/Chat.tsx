import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import readNDJSONStream from "ndjson-readablestream";
import styles from "./Chat.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};


import {
    chatApi,
    RetrievalMode,
    ChatAppResponse,
    ChatAppResponseOrError,
    ChatAppRequest,
    ResponseMessage,
    VectorFieldOptions,
    GPT4VInput
} from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { ClearChatButton } from "../../components/ClearChatButton";
import { VectorSettings } from "../../components/VectorSettings";
import { Padding } from "@mui/icons-material";
//import { useMsal } from "@azure/msal-react";

const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(RetrievalMode.Hybrid);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [shouldStream, setShouldStream] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);
    const [vectorFieldList, setVectorFieldList] = useState<VectorFieldOptions[]>([VectorFieldOptions.Embedding]);
    const [useOidSecurityFilter, setUseOidSecurityFilter] = useState<boolean>(false);
    const [useGroupsSecurityFilter, setUseGroupsSecurityFilter] = useState<boolean>(false);
    const [gpt4vInput, setGPT4VInput] = useState<GPT4VInput>(GPT4VInput.TextAndImages);
    const [useGPT4V, setUseGPT4V] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();
    const [sessionId, setSessionId] = useState<string>("");

    const [activeCitation, setActiveCitation] = useState<string>();

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: ChatAppResponse][]>([]);
    const [showGPT4VOptions, setShowGPT4VOptions] = useState<boolean>(false);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);

        if (sessionId == "") {
            setSessionId(crypto.randomUUID());
        }
        // console.log('sessionId='+ sessionId);

        try {
            const request: ChatAppRequest = {
                prompt: question,
                session_id: sessionId // TODO: Need to generate a session id
            };

            const response = await chatApi(request);
            const contentType = response.headers.get("content-type");
            if (!response.body) {
                throw Error("No response body");
            } else if (contentType?.indexOf('text/html') !== -1 || contentType?.indexOf('text/plain') !== -1) {
                const bodyText = await response.text();
                console.error(`Chat Error: ${bodyText}`);
                setError(bodyText);
            } else {
                const parsedResponse: ChatAppResponse = await response.json();
                // console.log(`Chat: ${parsedResponse}`);
                // debugger;
                setAnswers([...answers, [question, parsedResponse]]);
            }
            // if (shouldStream) {
            //     const parsedResponse: ChatAppResponse = await handleAsyncRequest(question, answers, setAnswers, response.body);
            //     setAnswers([...answers, [question, parsedResponse]]);
            // } else {
            //     const parsedResponse: ChatAppResponseOrError = await response.json();
            //     if (response.status > 299 || !response.ok) {
            //         throw Error(parsedResponse.error || "Unknown error");
            //     }
            //     setAnswers([...answers, [question, parsedResponse as ChatAppResponse]]);
            // }
        } catch (e) {
            console.error(`Chat Error: ${e}`);
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };


    const robotRequest = async (code: string) => {
        try {
            var codeSession = `
from hub import light_matrix
import runloop

async def main():
    # write your code here
    await light_matrix.write("Hi!")

runloop.run(main())
            `
            window.pyrepl.write = codeSession;
        } catch (e) {
            console.error(`Chat Error: ${e}`);
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };


    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setAnswers([]);
        setIsLoading(false);
        setIsStreaming(false);
        setSessionId(crypto.randomUUID());
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);
    //useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "auto" }), [streamedAnswers]);
    // useEffect(() => {
    //     getConfig();
    // }, []);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onShouldStreamChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setShouldStream(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onUseOidSecurityFilterChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseOidSecurityFilter(!!checked);
    };

    const onUseGroupsSecurityFilterChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseGroupsSecurityFilter(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        // if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
        //     setActiveAnalysisPanelTab(undefined);
        // } else {
        setActiveCitation(citation);
        //    setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        //}

        setSelectedAnswer(index);
    };

    return (
        <div className={styles.container}>

            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div>
                            <Carousel
                                swipeable={false}
                                draggable={false}
                                showDots={true}
                                centerMode={false}
                                responsive={responsive}
                                ssr={false} // means to render carousel on server-side.
                                infinite={true}
                                autoPlay={true}
                                autoPlaySpeed={3000}
                                keyBoardControl={true}
                                customTransition="all .5"
                                containerClass="carousel-container"
                                // deviceType={"desktop"}
                                dotListClass="custom-dot-list-style"
                                itemClass="carousel-item-padding-40-px"
                            >
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-6.webp)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-5.jpg)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-1.webp)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-2.webp)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-4.webp)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                                <div style={{ width: "100%", height: "300px", backgroundImage: "url(sp-img-3.png)", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
                            </Carousel>
                            <div className={styles.chatEmptyState}>
                                <h1 className={styles.chatEmptyStateTitle}>LEGO + AI + Robotics = Fun</h1>
                                {/* <img style={{ padding: "15px" }} src="../../robot.png" /> */}
                                <h2 className={styles.chatEmptyStateSubtitle}>Build a Spike Prime 3 Robot and control it by Python</h2>
                                <ExampleList onExampleClicked={onExampleClicked} useGPT4V={useGPT4V} />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
                            {/* {isStreaming &&
                                streamedAnswers.map((streamedAnswer, index) => (
                                    <div key={index}>
                                        <UserChatMessage message={streamedAnswer[0]} />
                                        <div className={styles.chatMessageGpt}>
                                            <Answer
                                                isStreaming={true}
                                                key={index}
                                                answer={streamedAnswer[1]}
                                                isSelected={false}
                                                onCitationClicked={c => onShowCitation(c, index)}
                                                onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            />
                                        </div>
                                    </div>
                                ))} */}
                            {!isStreaming &&
                                answers.map((answer, index) => (
                                    <div key={index}>
                                        <UserChatMessage message={answer[0]} />
                                        <div className={styles.chatMessageGpt}>
                                            <Answer
                                                isStreaming={false}
                                                key={index}
                                                answer={answer[1]}
                                                isSelected={selectedAnswer === index}
                                                onCitationClicked={c => onShowCitation(c, index)}
                                                onThoughtProcessClicked={() => { }} // {() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                onSupportingContentClicked={() => { }} // {() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            />
                                        </div>
                                    </div>
                                ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                    </div>
                                </>
                            ) : null}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question (e.g. how to move robot forward?)"
                            disabled={isLoading}
                            clearChat={clearChat}
                            sessionId={sessionId}
                            onSend={question => makeApiRequest(question)}
                        />
                    </div>
                </div>

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many search results:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />

                    <VectorSettings
                        showImageOptions={useGPT4V && showGPT4VOptions}
                        updateVectorFields={(options: VectorFieldOptions[]) => setVectorFieldList(options)}
                        updateRetrievalMode={(retrievalMode: RetrievalMode) => setRetrievalMode(retrievalMode)}
                    />

                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={shouldStream}
                        label="Stream chat completion responses"
                        onChange={onShouldStreamChange}
                    />
                </Panel>
            </div>
        </div >
    );
};

export default Chat;
