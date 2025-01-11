import { Delete24Regular } from "@fluentui/react-icons";
import { Button, Tooltip } from "@fluentui/react-components";

import styles from "./ClearChatButton.module.css";

interface Props {
    className?: string;
    onClick: () => void;
    disabled?: boolean;
    sessionId: string
}

export const ClearChatButton = ({ className, disabled, onClick, sessionId }: Props) => {
    return (
        <Tooltip content="Clear chat history" relationship="label">
            <Button size="large" icon={<Delete24Regular primaryFill="rgba(115, 118, 225, 1)" />} disabled={disabled} onClick={onClick} title={sessionId}>
            </Button>
        </Tooltip>
    );
};
