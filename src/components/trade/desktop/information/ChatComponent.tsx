/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
// import { Button } from 'react-bootstrap';
// import moment from 'moment';
// import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
// import { IconButton } from '@mui/material';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { db, firebaseAnalytics } from '@/const/firebaseConfig';
import collectionList from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentToken, wsIsLogin } from '@/stores/WalletState';
import { walletProvider } from '@/utils/walletProvider';

const getCollectionInformation = (curentCollection: any) => {
  const targetCollection = collectionList.filter(coll => coll.collection?.toUpperCase() === curentCollection.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function setCollectionChat(curentCollection: any) {
  const roomId = process.env.NEXT_PUBLIC_FIREBASE_CHAT_ROOMID ?? '';
  const { contractId: currentFirebaseChatContractId } = getCollectionInformation(curentCollection);
  return collection(db, 'rooms', roomId, 'contracts', currentFirebaseChatContractId, 'chats');
}

function MessageBubble(props: any) {
  const { messageItem, checkIsSender } = props;
  const router = useRouter();
  const shortenAddress = `${messageItem.sender.substring(0, 7)}...${messageItem.sender.slice(-3)}`;
  const fwdUserPage = () => {
    router.push(`/userprofile/${messageItem.sender}`);
  };
  return (
    <div className="chattext">
      <div
        className={checkIsSender ? 'userrow-issender col-auto' : 'userrow-notsender col-auto'}
        onClick={() => {
          if (checkIsSender) {
            fwdUserPage();
          }
        }}>
        <Image
          src={checkIsSender ? '/images/common/chat/current_user.png' : '/images/common/chat/baycicon.png'}
          className="image"
          alt=""
          width={32}
          height={32}
        />
        <span className="">{checkIsSender ? 'You' : shortenAddress}</span>
      </div>
      <div className={checkIsSender ? 'chatbubble-issender col-auto' : 'chatbubble-notsender col-auto'}>
        <div className={checkIsSender ? 'row textrow ownsender' : 'row textrow'}>{messageItem.message}</div>
        <div className="row timetext textrow" style={{ marginTop: '12px' }}>
          {/* {moment(messageItem.createTime).format('HH:mm DD MMMM YYYY')} */}
        </div>
      </div>
    </div>
  );
}

function ChatDisplays(props: any) {
  const { chatData, chatScrollKey } = props;
  const [isScrollButtonShow, setIsScrollButtonShow] = useState(true);
  const messagesEndRef = useRef(null);
  const messageRef = useRef(null);
  const fullWalletAddress = walletProvider.holderAddress;

  // const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

  const checkShowScrollKey = () => {
    if (messageRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageRef.current;
      const currentHeight = scrollTop + clientHeight;
      const expectedHeight = scrollHeight - 150;
      setIsScrollButtonShow(currentHeight <= expectedHeight);
    } else {
      setIsScrollButtonShow(false);
    }
  };

  useEffect(() => {
    // smoothScrollBottom();
  }, []);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [chatScrollKey]);

  if (chatData.length > 0) {
    return (
      <>
        <div className="col chatcontents" id="chatroomDisplay" ref={messageRef} onScroll={checkShowScrollKey}>
          {chatData.map((item: any) => (
            <MessageBubble key={item.createTime} messageItem={item} checkIsSender={item.sender === fullWalletAddress} />
          ))}
          <div style={{ marginBottom: 16 }} ref={messagesEndRef} />
        </div>
        {/* <div className="dropbottombutton col-auto">
          {isScrollButtonShow ? (
            <IconButton color="primary" onClick={() => scrollToBottom()}>
              <ArrowDropDownCircleOutlined style={{ width: '44px', height: '44px', color: 'white' }} />
            </IconButton>
          ) : null}
        </div> */}
      </>
    );
  }
  return <div className="col chatcontent startchat">Start your chat here!</div>;
}

function ChatInput(props: any) {
  const isLoginState = useNanostore(wsIsLogin);
  const { setChatScrollKey } = props;
  const [messageInfo, setMessageInfo] = useState('');
  const allowSendMessage = isLoginState && messageInfo.trim().length > 0;
  const [pressTime, setPressTime] = useState(0);
  const fullWalletAddress = walletProvider.holderAddress;
  const currentToken = useNanostore(wsCurrentToken);

  const logUserEvent = (eventName: any) => {
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, eventName, {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent(eventName, {
      page: 'Trade',
      collection: currentToken // from tokenRef.current
    });
  };
  const sendMessage = async function sendMessage() {
    logUserEvent('social_sendmsg_pressed');
    if (allowSendMessage) {
      await addDoc(setCollectionChat(currentToken), {
        // from tokenRef.current
        createTime: Date.now(),
        sender: fullWalletAddress,
        message: messageInfo
      }).then(() => {
        setMessageInfo('');
        setChatScrollKey(`message sent ${Date.now().toString()}`);
      });
      setPressTime(0);
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && pressTime === 0) {
      sendMessage();
      setPressTime(pressTime + 1);
    }
  };

  return (
    <div className="row chatsendercontainer" id="chatdisplays">
      <div className="col-1 iconstate">
        <Image src="/images/common/chat/current_user.png" alt="" height={32} width={32} style={{ borderRadius: '50%' }} />
      </div>
      <div className="col inputrow my-auto">
        <div className="col inputcontainer my-auto">
          <input
            className="inputs"
            placeholder="Say something..."
            value={messageInfo}
            onChange={e => setMessageInfo(e.target.value)}
            onClick={() => logUserEvent('social_textinput_pressed')}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="col-1 newiconstate my-auto">
        <div className="mx-auto">
          <button className={`sendbutton${!allowSendMessage ? ' disable-send' : ''} p-0`} onClick={sendMessage}>
            <Image src="/static/arrow_fill.svg" alt="" height={11.26} width={11.26} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatComponent(props: any, ref: any) {
  const { tokenRef } = props;
  const [chatData, setChatData] = useState([]);
  const [chatScrollKey, setChatScrollKey] = useState('');
  const currentToken = useNanostore(wsCurrentToken);

  const getFirebaseChat = function getFirebaseChat() {
    const q = query(setCollectionChat(currentToken), orderBy('createTime', 'asc')); // from tokenRef.current
    onSnapshot(q, querySnapshot => {
      const listenChats: any = [];
      querySnapshot.forEach(listenDoc => listenChats.push(listenDoc.data()));
      setChatData(listenChats);
      setChatScrollKey(`chatPushed ${Date.now().toString()}`);
    });
  };
  useImperativeHandle(ref, () => ({ getFirebaseChat }));

  useEffect(() => {
    getFirebaseChat();
  }, [currentToken]); // from tokenRef.current

  return (
    <div className="chatcontainer">
      <ChatDisplays chatData={chatData} chatScrollKey={chatScrollKey} />
      <ChatInput setChatScrollKey={setChatScrollKey} tokenRef={tokenRef} />
    </div>
  );
}
export default forwardRef(ChatComponent);
