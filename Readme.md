# LEGO AI Bot

LEGO AI Bot is a project designed to help young learners write Python code for LEGO Spike Prime 3 robots. The project includes various applications and tools to support coding education, including a chat interface, API services, and web components.

## Project Structure

```
.gitignore
legoaibot/
    apps/
        api/
        api-rt/
        chat/
        logicapp/
        web/
    bicep/
        aisearch-index/
        apim-policy/
        

main.bicep


        main.parameters.json
        modules/
    data/
        legoaibot-index-reset.ps1
        legoaibot-sp3api-data/
        

legoaibot-sp3api-gen.js


        legoaibot-sp3api-raw.json
        legoaibot-sp3api-upload.ps1
        legoaibot-sp3code-data/
        

legoaibot-sp3code-gen.js


        legoaibot-sp3code-raw.json
        legoaibot-sp3code-upload.ps1
        legoaibot-sp3doc-data/
    file/
    lab/
    script/


note.txt




Readme.md


```

## Applications

### API

The API application provides backend services for the LEGO AI Bot project. It includes various tools and middle-tier services.

- **Main File:** [legoaibot/apps/api/lego_robot/lego_robot_ai_agent.js](legoaibot/apps/api/lego_robot/lego_robot_ai_agent.js)

### Chat

The Chat application provides a user interface for interacting with the LEGO AI Bot. It includes various features such as chat menus, error displays, and scroll areas.

- **Main File:** [legoaibot/apps/chat/app/(authenticated)/chat/layout.tsx](legoaibot/apps/chat/app/(authenticated)/chat/layout.tsx)

### Web

The Web application provides a frontend interface for the LEGO AI Bot project. It includes various components such as footers, middle blocks, and content sections.

- **Main File:** [legoaibot/apps/web/src/index.tsx](legoaibot/apps/web/src/index.tsx)

## Bicep

The Bicep directory contains infrastructure as code (IaC) files for deploying the LEGO AI Bot project on Azure. It includes main deployment files and modules for various services.

- **Main File:** [legoaibot/bicep/main.bicep](legoaibot/bicep/main.bicep)

## Data

The Data directory contains various data files and scripts used by the LEGO AI Bot project. It includes raw JSON data, PowerShell scripts, and generated data files.

- **Main File:** [legoaibot/data/legoaibot-sp3doc-raw.json](legoaibot/data/legoaibot-sp3doc-raw.json)

## Lab

The Lab directory contains experimental and research code for the LEGO AI Bot project. It includes various scripts and tools for testing and development.

- **Main File:** [legoaibot/lab/agent_executor.js](legoaibot/lab/agent_executor.js)

## Scripts

The Scripts directory contains various scripts used by the LEGO AI Bot project. It includes build scripts, deployment scripts, and utility scripts.

## Getting Started

To get started with the LEGO AI Bot project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/legoaibot.git
    ```

2. Install dependencies for each application:
    ```sh
    cd legoaibot/apps/chat
    npm install
    cd ../api
    npm install
    cd ../web
    npm install
    ```

3. Build and run the applications:
    ```sh
    cd legoaibot/apps/chat
    npm run dev
    cd ../api
    npm run dev
    cd ../web
    npm run dev
    ```

## Contributing

We welcome contributions to the LEGO AI Bot project. Please read our contributing guidelines for more information.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- LEGO®, SPIKE™, and Minifigure are trademarks of ©The LEGO® Group.
- Web serial port function is created by [edanahy's WebSPIKE](https://github.com/edanahy/WebSPIKE).

