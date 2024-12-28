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

            <h4>Create Lego Brick By Description</h4>
            <table>
                <tbody>
                    <tr>
                        <td style={{ verticalAlign: 'top' }}>
                            <input type="text" placeholder="describe an image (e.g. lego block in rainbow color)" onChange={updateText} />
                            <button onClick={() => execImageCreateApi()}>Create Lego Brick Image (Dall-e)</button><br />
                            {
                                (promiseInProgress === true) ?
                                    <span>Loading...</span>
                                    :
                                    null
                            }
                        </td>
                    </tr>
                    <tr>
                        <td valign="top">
                            <img height={"150px"} src={imageDalleUrl} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Page;