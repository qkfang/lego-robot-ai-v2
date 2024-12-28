

const Page = () => {
    return (
      <div style={{ margin: "15px 50px 50px 50px", padding: "20px", backgroundColor: "white" }}>
          <h2>Help</h2>
          <p>
            Our girls' First Lego League team (Year 6 girls) started to write Python code for <a target='_blank' href='https://spike.legoeducation.com'>Spike Prime 3</a> Lego Robot last year in preparation of <a target='_blank' href='https://www.firstlegoleague.org/'>First Lego League</a> competition but struggled to get the program running. One of them turned to ChatGPT for help. These young learners need an innovative approach to support their coding education.
          </p>
          <p>
            The LEGO AI BOT can write Python code using the Spike Prime 3 API, with the generated code executed directly in the browser via a web serial port. This seamless experience helps young kids learn coding while watching their robots in action.
          </p>
          <p>
            Check out this <a target='_blank' href='https://youtu.be/1URVErLXnMk'>video tutorial</a> for the app.
          </p>
          <p>
            <b>Note:</b>
            <ul>
              <li>Spike Prime robot required to see Python code running. Above video demo (second half) includes robot in action.</li>
              <li>Chat response might take time as all SKU has been reduced to reduce spend.</li>
            </ul>
          </p>
          <p>
            <b>Features:</b>
            <ul>
              <li>ChatBot with Knowledge of Lego Spike Prime</li>
              <li>ChatBot with Knowledge of Spike Prime 3 Python API / Function / Execution</li>
              <li>Translate chat response to French</li>
              <li>Search similar Lego brick via Image Vector Search</li>
              <li>Describe Lego brick image in text</li>
              <li>Generate Lego brick image by description</li>
              <li>Receive Chat prompt via voice</li>
              <li>Read Chat responses by voice</li>
              <li>Python code chat response syntax highlighting</li>
              <li>Live chat with other users via browse</li>
              <li>Lego Spike Prime Web Serial Port integration in browser</li>
              <li>Execute python code directly from Browser</li>
            </ul>
          </p>
          <p>
            <b>Disclaimer:</b>
            <ul>
              <li>LEGO®, SPIKE™, and Minifigure are trademarks of ©The LEGO® Group.</li>
              <li>Web serial port function is created by <a href="https://github.com/edanahy/WebSPIKE/">edanahy's WebSPIKE</a></li>
            </ul>
          </p>
          <br />
        </div>
    );
  };
  
  export default Page;
  