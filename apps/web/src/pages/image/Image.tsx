import React, { useState } from "react";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";
import {
    imageApi,
    visionApi,
    dalleApi
} from "../../api";

const Page = () => {

    const { promiseInProgress } = usePromiseTracker();
    const [imageDalleText, setImageDalleText] = useState<string>();
    const [imageDalleUrl, setImageDalleUrl] = useState<string>("");

    async function execImageCreateApi() {
        if (imageDalleText != null) {
            trackPromise(
                dalleApi(imageDalleText)
            ).then((response) => {

                // console.log(response);
                setImageDalleUrl(response);
                // setImageDesc(response);   
            }

            )
        }
    }

    const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageDalleText(e.target.value);
        // console.log('edit->' + task)
    };


    return (
        <div className="pageContainer">
            <h2>Creative Images</h2>
            <p>Enhance your LEGO building experience with AI-powered tools that enable you to search for bricks using images and receive detailed descriptions, helping you identify, learn, and create with ease.</p>
            <p>
                <input type="text" placeholder="describe an image (e.g. lego block in rainbow color)" onChange={updateText} />
                <button onClick={() => execImageCreateApi()}>Start Imagine</button><br />
                {
                    (promiseInProgress === true) ?
                        <span>Loading...</span>
                        :
                        null
                }
            </p>
            <p>
                <img height={"550px"} src={imageDalleUrl} />
            </p>
        </div>
    );
};

export default Page;