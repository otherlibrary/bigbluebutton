import { Meteor } from 'meteor/meteor';
import Breakouts from '/imports/api/breakouts';
import Logger from '/imports/startup/server/logger';

function breakouts(credentials, moderator) {
  const {
    meetingId,
    requesterUserId,
  } = credentials;
  Logger.info(`Publishing Breakouts for ${meetingId} ${requesterUserId}`);

  if (moderator) {
    const presenterSelector = {
      $or: [
        { parentMeetingId: meetingId },
        { breakoutId: meetingId },
      ],
    };

    return Breakouts.find(presenterSelector);
  }

  const selector = {
    $or: [
      {
        parentMeetingId: meetingId,
        freeJoin: true,
      },
      {
        parentMeetingId: meetingId,
        'users.userId': requesterUserId,
      },
      {
        breakoutId: meetingId,
      },
    ],
  };

  return Breakouts.find(selector);
}

function publish(...args) {
  const boundBreakouts = breakouts.bind(this);
  return boundBreakouts(...args);
}

Meteor.publish('breakouts', publish);
