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
        <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
            <h2>Creative Images</h2>
            <p>Use your imagination to create an image by description</p>
            <p>
                <input type="text" placeholder="describe an image (e.g. lego block in rainbow color)" onChange={updateText} />
                <button onClick={() => execImageCreateApi()}>Create Lego Brick Image (Dall-e)</button><br />
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