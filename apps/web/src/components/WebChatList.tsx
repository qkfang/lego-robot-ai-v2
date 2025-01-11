import React, { useState, useEffect } from "react";
import styles from "./WebChatList.module.css";
import WebChatModel, { WebChatModelProps } from './WebChatModel';
import { webchatApi } from "../api";
import Pusher from 'pusher-js';
const PUSHER_APP_KEY = 'f1586bf9908b2073cda6';
const PUSHER_APP_CLUSTER = 'us2';

const LiveChatList = () => {

  const [task, setWebchat] = useState<string>('');
  const [tasks, setWebchats] = useState<WebChatModelProps[]>([]);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    
    setUserId('User-' + crypto.randomUUID().substring(0, 3));

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER
    })
    
    const channel = pusher.subscribe('legowebchats');
    channel.bind('inserted', addWebchat);

    return (() => {
      pusher.unsubscribe('legowebchats')
    })
  }, []);


  const addWebchat = (newTask: WebChatModel) => {
    console.log(newTask)
    setWebchats(ptasks => ([...ptasks, ...[newTask]]));
  }

  const postWebchat = () => {
    if (task != '') {
      webchatApi(userId + " said : " + task)
      setWebchat('');
    }
  };

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebchat(e.target.value);
    // console.log('edit->' + task)
  };
  const updateUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  return (
    <div className={styles.todowrapper}>
      <b>Your name</b>
      <input type="text" className={styles['input-todo']} placeholder="Enter your user ID" onChange={updateUserId} value={userId} />        
      <form>
        <input type="text" className={styles['input-todo']} placeholder="Say something." onChange={updateText} value={task} />
        <div className={styles['btn-add']} onClick={postWebchat}>Send</div>
      </form>

      <ul className="ultask">
        {tasks.map((x, i) => {
          return (
            <li className="litask" key={x.id}>
              <div className="text">{x.message}</div>
              {/* <div className="delete" onClick={this._onClick}>-</div> */}
            </li>
          )
        })
        }
      </ul>
    </div>
  );
}

export default LiveChatList;