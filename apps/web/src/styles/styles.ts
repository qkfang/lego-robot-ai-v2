import { createGlobalStyle } from "styled-components";

export const Styles = createGlobalStyle`

    @font-face {
        font-family: "Motiva Sans Light";
        src: url("/fonts/Motiva-Sans-Light.ttf") format("truetype");
        font-style: normal;
    }

    @font-face {
        font-family: "Motiva Sans Bold";
        src: url("/fonts/Motiva-Sans-Bold.ttf") format("truetype");
        font-style: normal;
    }


    a:hover {
        color: #18216d;
    }

    .carousel-container {
        margin: 1rem auto 4rem auto;
        max-width: 700px;

        @media only screen and (max-width: 1024px) {
            max-width: 650px;
        }

        @media only screen and (max-width: 768px) {
            max-width: 500px;
        }

        @media only screen and (max-width: 414px) {
            max-width: 250px;
        }
    }

    .pageContainer{
        padding: 50px 50px 150px 50px;
        background-color: white;
        max-width: 1200px;
        border-radius: 1rem;
        margin: 15px auto;
        background-image: url(bg-footer.png);
        background-repeat: no-repeat;
        background-position: bottom;
    }

    .carousel-item-padding-40-px {
        text-align: center;
        padding: 40px;
        overflow: hidden;
        width: 100%;
    }

    input,
    textarea {
        border-radius: 4px;
        border: 0;
        background: rgb(241, 242, 243);
        transition: all 0.3s ease-in-out;  
        outline: none;
        width: 100%;  
        padding: 1rem 1.25rem;

        :focus-within {
            background: none;
            box-shadow: #2e186a 0px 0px 0px 1px;
        }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'Motiva Sans Bold', serif;
        color: #18216d;
        line-height: 1.18;
    }

    p {
        color: #18216d;
        font-size: 21px;        
        line-height: 1.41;
    }

    h1 {
        font-weight: 600;
    }

    a {
        text-decoration: none;
        outline: none;
        color: #2E186A;

        :hover {
            color: #2e186a;
        }
    }
    
    *:focus {
        outline: none;
    }

    .about-block-image svg {
        text-align: center;
    }

    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        text-align: left;
        padding-top: 1.5rem;
    }

    .ant-drawer-content-wrapper {
        width: 300px !important;
    }
`;
