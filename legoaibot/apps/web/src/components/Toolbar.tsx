import React from 'react';
import ServiceButton from './ServiceButton';
import Modal from 'react-modal';
import LiveChatList from './WebChatList';
import styles from "./Toolbar.module.css";
import { Height } from '@mui/icons-material';
import { height } from '@mui/system';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '80%',
    marginRight: '-50%',
    marginLeft: '20px',
    transform: 'translate(-50%, -50%)',
  },
};

export function Toolbar() {
  let subtitle;
  const [userId, setUserId] = React.useState("");

  React.useEffect(() => {
    setUserId(crypto.randomUUID().substring(0, 3));
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
      <div>
        <div className={styles.toolbarimage}>
          <ServiceButton
            id={"service_spike"}
            className={""}
          />
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
