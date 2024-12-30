import React from 'react';

export interface WebChatModelProps {
    id: number;
    message: string;
}

declare const WebChatModel: React.SFC<WebChatModelProps>
export default WebChatModel