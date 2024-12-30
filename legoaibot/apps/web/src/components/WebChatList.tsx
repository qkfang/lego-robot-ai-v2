import React, { useState, useEffect } from "react";
import styles from "./WebChatList.module.css";
import WebChatModel, { WebChatModelProps } from './WebChatModel';
import { webchatApi } from "../api";
import Pusher from 'pusher-js';
const PUSHER_APP_KEY = 'f1586bf9908b2073cda6';
const PUSHER_APP_CLUSTER = 'us2';

const LiveChatList = () => {

  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<WebChatModelProps[]>([]);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    
    setUserId(crypto.randomUUID().substring(0, 3));

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER
    })
    
    const channel = pusher.subscribe('legowebchats');
    channel.bind('inserted', addTask);

    return (() => {
      pusher.unsubscribe('legowebchats')
    })
  }, []);


  const addTask = (newTask: WebChatModel) => {
    console.log('addTask')
    console.log(newTask)
    // setTasks([...tasks, newTask]);
    setTasks(ptasks => ([...ptasks, ...[newTask]]));
  }

  const postTask = () => {
    if (task != '') {
      webchatApi("User-" + userId + " said : " + task)
      setTask('');
    }
  };

  const updateText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
    // console.log('edit->' + task)
  };



  return (
    <div className={styles.todowrapper}>
      <b>Your name is [User-{userId}]</b>
      <p>Open 2 windows to simulate a chat using mongodb change stream.</p>
      <form>
        <input type="text" className={styles['input-todo']} placeholder="Say something." onChange={updateText} value={task} />
        <div className={styles['btn-add']} onClick={postTask}>Send</div>
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