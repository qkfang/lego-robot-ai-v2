
import UploadAndDisplayImage from '../../components/UploadAndDisplayImage';

const Page = () => {
    return (
        <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
            <h2>Brick Images</h2>
            <p>Upload a brick image, we will find a similar one in the library.</p>
            <p>You can use one of the sample image. <a href="/block-blue.jpg" target='blank'>Blue</a> / <a href="/block-red.jpg" target='blank'>Red</a> / <a href="/block-white.jpg" target='blank'>White</a> / <a href="/block-yellow.jpg" target='blank'>Yellow</a> </p>
            <UploadAndDisplayImage />
            <br />
        </div>
    );
  };
  
export default Page;