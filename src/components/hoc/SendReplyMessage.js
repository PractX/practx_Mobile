import React from 'react';
import { usePubNub } from 'pubnub-react';

const SendReplyMessage = (data, input) => {
  const pubnub = usePubNub();
  console.log('Channel name', data);
  // console.log('SENDING____')

  //UNCOMMENT LATER

  // chatRef.scrollToEnd();
  pubnub.setUUID(data ? data?.chatId : 0);
  if (data) {
    pubnub.publish(
      {
        message: {
          // text: data[0].text,
          text: input,
          userType: 'patient',
          profile: {
            id: parseInt(data?.userId),
            name: data?.firstname + ' ' + data?.lastname,
          },
        },
        channel: data?.channel,
      },
      (status, response) => {
        // setMessage('');
        // handle status, response
        console.log('Status', status);
        console.log('Response', response);
        // console.log(oldLength, 'SENT____', messages.length);
      },
    );
  } else {
    console.log('NO message');
  }
};

export default SendReplyMessage;
