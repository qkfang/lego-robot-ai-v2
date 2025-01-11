
import UploadAndDisplayImage from '../../components/UploadAndDisplayImage';

const Page = () => {
    return (
        <div className="pageContainer">
            <h2>Brick Images</h2>
            <p>Enhance your LEGO building experience with AI-powered tools that enable you to search for bricks using images and receive detailed descriptions, helping you identify, learn, and create with ease.</p>
            <p>Upload a brick image, we will find a similar one in the library.</p>
            <p>You can use one of the sample image. <a href="/block-blue.jpg" target='blank'>Blue</a> / <a href="/block-red.jpg" target='blank'>Red</a> / <a href="/block-white.jpg" target='blank'>White</a> / <a href="/block-yellow.jpg" target='blank'>Yellow</a> </p>
            <UploadAndDisplayImage />
            <br />
        </div>
    );
  };
  
export default Page;